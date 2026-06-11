// ============================================================
// auth.js
// Firestore roles/{uid}.roles === "staff" | "super" で判定
// ============================================================

async function getRole() {
  const user = firebase.auth().currentUser;
  if (!user) return null;
  const cached = sessionStorage.getItem('casino_role');
  if (cached) return cached;
  try {
    const doc = await firebase.firestore().collection('roles').doc(user.uid).get();
    if (!doc.exists) return null;
    const role = doc.data().roles || null;
    if (role) sessionStorage.setItem('casino_role', role);
    return role;
  } catch(e) {
    console.error('getRole error:', e);
    return null;
  }
}

async function hasRole(requiredRole) {
  const user = firebase.auth().currentUser;
  if (!user) return false;
  const role = await getRole();
  if (!role) return false;
  if (requiredRole === 'super') return role === 'super';
  return role === 'staff' || role === 'super';
}

async function signInWithRole(email, password, requiredRole) {
  const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
  sessionStorage.removeItem('casino_role');
  const ok = await hasRole(requiredRole);
  if (!ok) {
    await firebase.auth().signOut();
    sessionStorage.removeItem('casino_role');
    throw new Error('権限のないアカウントです');
  }
  return cred.user;
}

// ページ保護：認証確認中はページを非表示にする
function requireRole(requiredRole) {
  // body を即座に非表示（チラ見え防止）
  document.documentElement.style.visibility = 'hidden';

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
        location.replace('admin.html');
        return;
      }
      // 認証OK → 表示
      document.documentElement.style.visibility = '';
    } catch(err) {
      console.error(err);
      await firebase.auth().signOut();
      sessionStorage.removeItem('casino_role');
      location.replace('admin.html');
    }
  });
}

async function signOutAdmin() {
  try {
    await firebase.auth().signOut();
  } finally {
    sessionStorage.removeItem('casino_role');
    location.replace('admin.html');
  }
}
