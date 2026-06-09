// ============================================================
// auth.js - シンプル版
// Firestoreの roles/{uid} ドキュメントの roles フィールドで判定
// roles フィールドの値: "staff" または "super"
// ============================================================

// ロールを取得してセッションにキャッシュ
async function getRole() {
  const user = firebase.auth().currentUser;
  if (!user) return null;

  // セッションキャッシュがあればそれを使う
  const cached = sessionStorage.getItem('casino_role');
  if (cached) return cached;

  try {
    const doc = await firebase.firestore()
      .collection('roles')
      .doc(user.uid)
      .get();
    if (!doc.exists) return null;
    const role = doc.data().roles || null;
    if (role) sessionStorage.setItem('casino_role', role);
    return role;
  } catch(e) {
    console.error('getRole error:', e);
    return null;
  }
}

// staff以上かどうか（staffもsuperもtrue）
async function hasRole(requiredRole) {
  const user = firebase.auth().currentUser;
  if (!user) return false;

  const role = await getRole();
  if (!role) return false;

  if (requiredRole === 'super') {
    return role === 'super';
  }
  // 'staff' チェック → staffもsuperもOK
  return role === 'staff' || role === 'super';
}

// ログイン処理
async function signInWithRole(email, password, requiredRole) {
  const cred = await firebase.auth()
    .signInWithEmailAndPassword(email, password);

  // ロールキャッシュをクリアして再取得
  sessionStorage.removeItem('casino_role');

  const ok = await hasRole(requiredRole);
  if (!ok) {
    await firebase.auth().signOut();
    sessionStorage.removeItem('casino_role');
    throw new Error('権限のないアカウントです');
  }

  return cred.user;
}

// ページ保護（ロールがなければloginページへ飛ばす）
function requireRole(requiredRole) {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      location.replace('admin.html');
      return;
    }
    try {
      const ok = await hasRole(requiredRole);
      if (!ok) {
        await firebase.auth().signOut();
        sessionStorage.removeItem('casino_role');
        alert('管理者権限がありません');
        location.replace('admin.html');
      }
    } catch(err) {
      console.error(err);
      await firebase.auth().signOut();
      sessionStorage.removeItem('casino_role');
      location.replace('admin.html');
    }
  });
}

// ログアウト
async function signOutAdmin() {
  try {
    await firebase.auth().signOut();
  } finally {
    sessionStorage.removeItem('casino_role');
    sessionStorage.removeItem('casino_admin_auth');
    location.replace('admin.html');
  }
}
