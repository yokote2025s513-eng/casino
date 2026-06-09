// ============================================================
// auth.js
// Firestore roles 管理版
// ============================================================

async function getRole() {
  const user = firebase.auth().currentUser;

  if (!user) return null;

  const doc = await firebase.firestore()
    .collection("roles")
    .doc(user.uid)
    .get();

  if (!doc.exists) return null;

  return doc.data().roles || null;
}

async function hasRole(role) {
  const user = firebase.auth().currentUser;

  if (!user) return false;

  const currentRole = await getRole();

  if (!currentRole) return false;

  if (role === "super") {
    return currentRole === "super";
  }

  return currentRole === "staff" ||
         currentRole === "super";
}

async function signInWithRole(email, password, role) {
  const cred = await firebase.auth()
    .signInWithEmailAndPassword(email, password);

  const ok = await hasRole(role);

  if (!ok) {
    await firebase.auth().signOut();
    throw new Error("権限のないアカウントです");
  }

  return cred.user;
}

function requireRole(role) {
  firebase.auth().onAuthStateChanged(async (user) => {

    if (!user) {
      location.replace("admin.html");
      return;
    }

    try {
      const ok = await hasRole(role);

      if (!ok) {
        await firebase.auth().signOut();
        alert("管理者権限がありません");
        location.replace("admin.html");
      }

    } catch (err) {
      console.error(err);
      await firebase.auth().signOut();
      location.replace("admin.html");
    }

  });
}

async function signOutAdmin() {
  try {
    await firebase.auth().signOut();
  } finally {
    location.replace("admin.html");
  }
}
