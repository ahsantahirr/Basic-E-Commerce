import {
  auth,
  storage,
  db,
  signOut,
  getDoc,
  getDocs,
  doc,
  onAuthStateChanged,
  collection,
  addDoc
} from "./utils/utils.js";

const user_img = document.getElementById("user_img");
const user_mail = document.getElementById("useremailhtml");
const user_name = document.getElementById("usernamehtml");
const login_link = document.getElementById("login_link");
const event_container = document.getElementById("event_container");
const logout_btn = document.getElementById("logout");
const addProduct_links = document.getElementById("addProduct_link");
const myEvents_link = document.getElementById("myEvents_link");
const cart_link = document.getElementById("cart_link");


getallevents();
addProduct_links.style.display = "none";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    login_link.style.display = "none";
    user_img.style.display = "inline-block";
    addProduct_links.style.display = "inline-block";
    myEvents_link.style.display = "inline-block";
    cart_link.style.display = "inline-block";
    getUserInfo(uid);
  } else {
    login_link.style.display = "inline-block";
    user_img.style.display = "none";
    addProduct_links.style.display = "none"; 
    myEvents_link.style.display = "none";
    cart_link.style.display = "none";
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

async function getallevents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    event_container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const event = doc.data();
      const { banner, title, description, createdByemail, price } = event;
      const card = `
      <div class="card w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
        <a href="#">
          <img class="p-8 rounded-t-lg  w-full object-cover h-96" src="${banner}" alt="product image" />
        </a>
        <div class="px-5 pb-5 h-1/2">
          <a href="#">
            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">${title}</h5>
            <h5 class="text-md font-semibold tracking-tight text-gray-900 dark:text-white">${description}</h5>
            <h5 class="text-md font-semibold tracking-tight text-gray-900 dark:text-white">${createdByemail}</h5>
          </a>
          <div class="flex items-center mt-2.5 mb-5"></div>
          <div class="flex items-center justify-between">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">$${price}</span>
            <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="addtoCart(this)">Add to cart</a>
          </div>
        </div>
      </div>`;
      window.addtoCart = addtoCart
      event_container.innerHTML += card;
    });
  } catch (err) {
    console.error("Error fetching events: ", err);
    alert(err);
  }
}

async function addtoCart(e) {
  if (auth.currentUser) {
    const user = auth.currentUser;
    const eventCard = e.closest('.card');
    const title = eventCard.querySelector('h5:nth-child(1)').textContent;
    const description = eventCard.querySelector('h5:nth-child(2)').textContent;
    const createdByemail = eventCard.querySelector('h5:nth-child(3)').textContent;
    const price = parseFloat(eventCard.querySelector('.text-3xl').textContent.replace('$', ''));
    const banner = eventCard.querySelector('img').src;

    const cartItem = {
      title,
      description,
      createdByemail,
      price,
      banner,
      userId: user.uid
    };

    try {
      // Add to Firestore
      const cartRef = collection(db, 'carts', user.uid, 'items');
      await addDoc(cartRef, cartItem);
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart: ', error);
      alert('Failed to add to cart. Please try again.');
    }
    
  } else {
    window.location.href = "../Login/index.html";
  }
}
