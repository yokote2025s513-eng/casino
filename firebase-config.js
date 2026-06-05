const firebaseConfig = {
  apiKey: "AIzaSyBAX1uTae02ISqUl614si6sZWRLIEQsJBk",
  authDomain: "casino-9a068.firebaseapp.com",
  projectId: "casino-9a068",
  storageBucket: "casino-9a068.firebasestorage.app",
  messagingSenderId: "307945730969",
  appId: "1:307945730969:web:fdeba132bbc42083ebd908"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const GAMES = [
  { id: "poker",     label: "ポーカー",       icon: "♠" },
  { id: "blackjack", label: "ブラックジャック", icon: "♥" },
  { id: "chinchiro", label: "チンチロ",       icon: "🎲" },
  { id: "keiba",     label: "競馬",           icon: "🏇" }
];

const rankingCol  = () => db.collection("rankings");
const reserveCol  = () => db.collection("reserves");
const waitTimeCol = () => db.collection("waitTimes");
const visitorCol  = () => db.collection("visitors");
