/* ============ firebase-config.js — conexión con tu proyecto de Firebase ============
 * Pega aquí la configuración de tu app web de Firebase (Consola de Firebase >
 * Configuración del proyecto > Tus apps > SDK setup and configuration > Config).
 * Los pasos completos están en docs/FIREBASE.md.
 *
 * Estos datos NO son secretos: Firebase los diseña para ir en la web. Lo que
 * protege las partidas son las reglas de Firestore (firestore.rules).
 *
 * Si se pone a null, el juego funciona en modo local (sólo en el navegador).
 */
// Mo 自己的 Firebase 專案（poke-bac05，2026-10-13 換上）。
// 注意：還沒有 databaseURL，代表多人房間用的 Realtime Database 還沒開，
// 之後若要開「邀朋友一起玩」功能，照 docs/FIREBASE.md 第 3b 步設定後補上即可。
G.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAhHIBUK-WUyavlMe5O7HI_whPZHyNFKRI',
  authDomain: 'poke-bac05.firebaseapp.com',
  projectId: 'poke-bac05',
  storageBucket: 'poke-bac05.firebasestorage.app',
  messagingSenderId: '517822086554',
  appId: '1:517822086554:web:28dbdc6d4c217edd288e23'
};

/* Ejemplo de cómo debe quedar:
G.FIREBASE_CONFIG = {
  apiKey: 'AIza...',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto',
  storageBucket: 'tu-proyecto.firebasestorage.app',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abc123'
};
*/
