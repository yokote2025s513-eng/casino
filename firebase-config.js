// ==============================
// Firebase 設定
// ここを自分のFirebaseプロジェクトの値に書き換えてください
// ==============================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
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
