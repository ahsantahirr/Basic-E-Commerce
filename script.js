// import{auth,db,storage,onAuthStateChanged, signOut} from "./utils/utils.js"

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/auth.user
//       const uid = user.uid;
//       // ...

//     } else {
//       // User is signed out
//       // ...
//       window.location.href = "../Login/index.html"
//     }
//   });

//   const logout_btn = document.getElementById("logout");
//   logout_btn.addEventListener("click", ()=>{
//     signOut(auth)
//   })
import {
  auth,
  storage,
  db,
  signOut,
  getDoc,
  doc,
  onAuthStateChanged,
} from "./utils/utils.js";


// const login_link = document.getElementById("login_link");
const user_img = document.getElementById("user_img");
const user_mail = document.getElementById("useremailhtml");
const user_name = document.getElementById("usernamehtml");

// console.log("auth=>", auth);
// console.log("storage=>", storage);
// console.log("db=>", db);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // login_link.style.display = "none";
    user_img.style.display = "inline-block";
    getUserInfo(uid);
    // ...
  } else {
    window.location.href = "./Login/index.html";
    // login_link.style.display = "inline-block";
    // user_img.style.display = "none";
  }
});
const logout_btn = document.getElementById("logout");
logout_btn.addEventListener("click", () => {
  signOut(auth)
})

function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((data) => {
    console.log("data==>", data.id);
    console.log("data==>", data.data());
    user_img.src = data.data().img;
    user_mail.textContent = data.data().email;
    user_name.textContent = `${data.data().firstname} ${data.data().lastname}`;
  })
}