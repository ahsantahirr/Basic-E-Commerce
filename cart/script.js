import {
  auth,
  db,
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  onAuthStateChanged,
  signOut
} from "../utils/utils.js";

const cart_container = document.getElementById("cart_container");
const user_img = document.getElementById("user_img");
const user_mail = document.getElementById("useremailhtml");
const user_name = document.getElementById("usernamehtml");
const login_link = document.getElementById("login_link");
const logout_btn = document.getElementById("logout");
const addProduct_link = document.getElementById("addProduct_link");
const myEvents_link = document.getElementById("myEvents_link");
const cart_link = document.getElementById("cart_link");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    // login_link.style.display = "none";
    user_img.style.display = "inline-block";
    addProduct_link.style.display = "inline-block";
    myEvents_link.style.display = "inline-block";
    cart_link.style.display = "inline-block";
    getUserInfo(uid);
    getCartItems(uid);
  } else {
    login_link.style.display = "inline-block";
    user_img.style.display = "none";
    addProduct_link.style.display = "none";
    myEvents_link.style.display = "none";
    cart_link.style.display = "none";
    window.location.href = "../Login/index.html"; // Redirect to login if not authenticated
  }
});

logout_btn.addEventListener("click", () => {
  signOut(auth);
});

function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef)
    .then((data) => {
      const userData = data.data();
      user_img.src = userData.img;
      user_mail.textContent = userData.email;
      user_name.textContent = `${userData.firstname} ${userData.lastname}`;
    })
    .catch((error) => {
      console.error("Error fetching user data: ", error);
    });
}

async function getCartItems(uid) {
  try {
    const cartRef = collection(db, 'carts', uid, 'items');
    const querySnapshot = await getDocs(cartRef);
    cart_container.innerHTML = ""; // Clear existing content
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const { banner, title, description, price } = item;
      const cartItemHTML = `
        <div class="card w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img class="p-8 rounded-t-lg h-96 w-full object-cover" src="${banner}" alt="product image" />
          </a>
          <div class="px-5 pb-5">
            <a href="#">
              <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">${title}</h5>
              <h5 class="text-md font-semibold tracking-tight text-gray-900 dark:text-white">${description}</h5>
            </a>
            <div class="flex items-center mt-2.5 mb-5"></div>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-gray-900 dark:text-white">$${price}</span>
              <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="deleteFromCart('${doc.id}')">Remove from cart</a>
            </div>
          </div>
        </div>`;
      window.deleteFromCart = deleteFromCart;
      cart_container.innerHTML += cartItemHTML;
    });
  } catch (error) {
    console.error("Error fetching cart items: ", error);
    alert("Failed to load cart items. Please try again.");
  }
}

async function deleteFromCart(docId) {
  try {
    const user = auth.currentUser;
    if (user) {
      const itemRef = doc(db, 'carts', user.uid, 'items', docId);
      await deleteDoc(itemRef);
      alert('Item deleted successfully!');
      getCartItems(user.uid); // Refresh the cart items
    } else {
      alert('User not authenticated!');
    }
  } catch (error) {
    console.error("Error deleting cart item: ", error);
    alert("Failed to delete item. Please try again.");
  }
}
