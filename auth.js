// ========================================
// 権限・認証管理 (auth.js)
// ========================================

// イベント当日に使用するスタッフ用メールアドレスのリスト
const STAFF_EMAILS = [
  "staff@example.com",
  "super@example.com"
];

// 最高管理者用メールアドレスのリスト
const SUPER_EMAILS = [
  "super@example.com"
];

function getCurrentEmail() {
  return (firebase.auth().currentUser?.email || "").trim().toLowerCase();
}

async function hasRole(role) {
  const user = firebase.auth().currentUser;
  if (!user) return false;

  // 強制的にトークンを最新にする
  await user.getIdToken(true);

  const email = getCurrentEmail();

  if (role === "super") {
    return SUPER_EMAILS.includes(email);
  }
  // staff または super のいずれかに含まれていればOK
  return STAFF_EMAILS.includes(email) || SUPER_EMAILS.includes(email);
}

async function signInWithRole(email, password, role) {
  // Firebase Authentication でサインイン
  const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
  
  // ログインしたアカウントの権限をチェック
  const ok = await hasRole(role);

  if (!ok) {
    // 権限がない場合は即座にサインアウトしてエラーを投げる
    await firebase.auth().signOut();
    throw new Error("この画面へのアクセス権限がないアカウントです");
  }

  return cred.user;
}

function requireRole(role) {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      location.replace("admin.html");
      return;
    }

    const ok = await hasRole(role);
    if (!ok) {
      await firebase.auth().signOut();
      alert("アクセス権限がありません。ログインし直してください。");
      location.replace("admin.html");
    }
  });
}

async function signOutAdmin() {
  try {
    await firebase.auth().signOut();
    location.replace("admin.html");
  } catch (e) {
    console.error("Signout Error", e);
    location.replace("admin.html");
  }
}
