// ========================================
// 権限・認証管理 (auth.js)
// ========================================

const STAFF_EMAILS = [
  "staff@example.com",
  "super@example.com"
];

const SUPER_EMAILS = [
  "super@example.com"
];

function getCurrentEmail() {
  return (firebase.auth().currentUser?.email || "").trim().toLowerCase();
}

async function hasRole(role) {
  const user = firebase.auth().currentUser;
  if (!user) return false;

  await user.getIdToken(true);

  // 【修正】当日のトラブルを防ぐため、メール認証(Link)の強制チェックを解除
  // if (!user.emailVerified) return false;

  // 【修正】コメントアウトを解除し、emailを正しく取得
  const email = getCurrentEmail();

  if (role === "super") {
    return SUPER_EMAILS.includes(email);
  }
  return STAFF_EMAILS.includes(email) || SUPER_EMAILS.includes(email);
}

async function signInWithRole(email, password, role) {
  const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
  const ok = await hasRole(role);

  if (!ok) {
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
