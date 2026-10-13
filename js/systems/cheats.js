/* ============ cheats.js — 金手指 (Mo 自己的版本專用，原版沒有) ============
 * 設定存在 G.Settings（本機 localStorage），所以跟畫質、音效一樣是「這台裝置的設定」。
 *
 *   難度：讀 G.Settings.get('difficulty')，spawner.js 用 spawnMul()/capMul() 調整
 *         怪物生成速度與同時在場上限；player.js 用 xpMul() 調整經驗倍率。
 *   金幣/抽獎券無限、圖鑑全開：每秒把存檔內容覆寫成「滿」，持續生效，
 *         不用每次手動按。
 *   強化全滿、任務/成就全完成、下一隻必異色：一次性動作，按鈕觸發。
 */
G.Cheats = (() => {
  const DIFF = {
    easy:   { spawn: 1,  cap: 1,  xp: 2 },
    normal: { spawn: 1,  cap: 1,  xp: 1 },
    hard:   { spawn: 3,  cap: 3,  xp: 1 },
    hell:   { spawn: 10, cap: 10, xp: 1 },
    purgatory: { spawn: 20, cap: 20, xp: 1 },
    abyss:     { spawn: 35, cap: 35, xp: 1 },
    despair:   { spawn: 55, cap: 55, xp: 1 },
    apocalypse:{ spawn: 80, cap: 80, xp: 1 }
  };
  function diff() { return DIFF[G.Settings.get('difficulty')] || DIFF.normal; }
  const spawnMul = () => diff().spawn;
  const capMul = () => diff().cap;
  const xpMul = () => diff().xp;
  const godMode = () => !!G.Settings.get('cheatGod');
  const allMoves = () => !!G.Settings.get('cheatAllMoves');
  const typeExpand = () => !!G.Settings.get('cheatTypeExpand');

  /** 目前這個角色，額外屬性解鎖帶來的招式池（還沒學過的也在裡面，交給 levelup.js 過濾）。 */
  function extraPool(pl) {
    const ids = new Set();
    for (const t of (pl.extraTypes || [])) for (const id of (G.Moves.POOL[t] || [])) ids.add(id);
    return [...ids];
  }

  /** 是否已經把目前的格子學滿，可以選下一個額外屬性了。 */
  function canPickType(pl) { return pl.slots.length >= pl.maxMoves; }

  /** 選一個額外屬性：學滿才能選，同屬性不能重複選。 */
  function pickType(pl, type) {
    if (!canPickType(pl) || pl.extraTypes.includes(type)) return false;
    pl.extraTypes.push(type);
    return true;
  }
  const dmgMul = () => { const v = +G.Settings.get('cheatDmgMul'); return v > 0 ? v : 1; };

  /** Se llama sola cada segundo: mantiene monedas/tickets/dex "llenos" mientras estén activados. */
  function applySave() {
    const s = G.DB && G.DB.save;
    if (!s) return;
    let touched = false;
    if (G.Settings.get('cheatCoins') && s.coins !== 999999999) { s.coins = 999999999; touched = true; }
    if (G.Settings.get('cheatTickets')) {
      s.tickets = s.tickets || { t1: 0, t10: 0 };
      if (s.tickets.t1 !== 999999 || s.tickets.t10 !== 999) { s.tickets.t1 = 999999; s.tickets.t10 = 999; touched = true; }
    }
    if (G.Settings.get('cheatDexAll') && G.DEX) {
      s.owned = s.owned || {}; s.shiny = s.shiny || {};
      for (const p of G.DEX) {
        if (!s.owned[p.dex]) { s.owned[p.dex] = { at: Date.now(), from: 'cheat' }; touched = true; }
        if (!s.shiny[p.dex]) { s.shiny[p.dex] = { at: Date.now(), from: 'cheat' }; touched = true; }
      }
    }
    // El marcador de arriba (monedas/tickets) no se actualiza solo: hay que avisarle.
    if (touched && G.UI && G.UI.refreshCoins) G.UI.refreshCoins();
  }

  /** 把目前所有任務（日/週）直接標記完成並領獎。 */
  function completeMissions() {
    const s = G.DB && G.DB.save;
    if (!s || !G.Progress) return;
    G.Progress.ensure(s);
    for (const m of (s.missions && s.missions.daily) || []) { m.prog = Math.max(m.prog, 1e9); G.Progress.claim(m, false); }
    for (const m of (s.missions && s.missions.weekly) || []) { m.prog = Math.max(m.prog, 1e9); G.Progress.claim(m, true); }
    G.DB.commit(true);
  }

  /** 解鎖全部成就（含獎勵，不含稱號以外的額外效果）。 */
  function completeAchievements() {
    const s = G.DB && G.DB.save;
    if (!s || !G.AchDefs || !G.Progress) return;
    s.ach = s.ach || {};
    for (const a of G.AchDefs.LIST) {
      if (s.ach[a.id]) continue;
      s.ach[a.id] = Date.now();
      G.Progress.grant(a.reward);
    }
    G.DB.commit(true);
  }

  /** 把所有已擁有寶可夢的強化點滿。 */
  function maxUpgrades() {
    const s = G.DB && G.DB.save;
    if (!s || !G.Upgrades) return;
    for (const dex in s.owned || {}) {
      const lv = G.DB.upgradesOf(+dex);
      for (const u of G.Upgrades.LIST) lv[u.id] = u.max;
    }
    G.DB.commit(true);
  }

  function forceWildShiny(n = 3) { G.Spawner && G.Spawner.debugForceShiny(n); }
  function forceGachaShiny(n = 1) { G.Gacha && G.Gacha.debugForceShiny(n); }
  function forceRift() { G.Rift && G.Rift.debugOpen(); }

  setInterval(applySave, 1000);

  return { spawnMul, capMul, xpMul, godMode, dmgMul, allMoves, applySave,
           typeExpand, extraPool, canPickType, pickType,
           completeMissions, completeAchievements, maxUpgrades,
           forceWildShiny, forceGachaShiny, forceRift };
})();
