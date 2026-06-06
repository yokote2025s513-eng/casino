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

  if (!user.emailVerified) return false;

//  const email = getCurrentEmail();

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

    const ok = await hasRole(role);
    if (!ok) {
      await firebase.auth().signOut();
      alert("権限がありません");
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
