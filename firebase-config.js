// ==============================
// Firebase 設定
// ここを自分のFirebaseプロジェクトの値に書き換えてください
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyBAX1uTae02ISqUl614si6sZWRLIEQsJBk",
  authDomain: "casino-9a068.firebaseapp.com",
  projectId: "casino-9a068",
  storageBucket: "casino-9a068.firebasestorage.app",
  messagingSenderId: "307945730969",
  appId: "1:307945730969:web:fdeba132bbc42083ebd908"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
// ※ データベース名が (default) 以外の場合は databaseId を指定
// 例: const db = firebase.firestore(firebase.app(), 'your-database-name');
const db = firebase.firestore();

// ゲーム定義
const GAMES = [
  { id: "poker",       label: "ポーカー",         icon: "♠" },
  { id: "blackjack",   label: "ブラックジャック",   icon: "♥" },
  { id: "chinchiro",   label: "チンチロ",           icon: "🎲" },
  { id: "keiba",       label: "競馬",               icon: "🏇" }
];

// Firestoreコレクション参照
const rankingCol  = () => db.collection("rankings");
const reserveCol  = () => db.collection("reserves");
const waitTimeCol = () => db.collection("waitTimes");
const visitorCol  = () => db.collection("visitors");
