// ==============================
// Firebase 設定
// ここを自分のFirebaseプロジェクトの値に書き換えてください
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyCTjWRVRDRHbkKCoHUVs8mVacE-Nyoetj8",
  authDomain: "casino-b8102.firebaseapp.com",
  databaseURL: "https://casino-b8102-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "casino-b8102",
  storageBucket: "casino-b8102.firebasestorage.app",
  messagingSenderId: "737208136730",
  appId: "1:737208136730:web:bd35fb984adbd92d818da3"
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
