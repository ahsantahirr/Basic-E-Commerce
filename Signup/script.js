import {
    auth,
    createUserWithEmailAndPassword,
    doc,
    setDoc,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
   
} from "../utils/utils.js"

const imgInput = document.getElementById("imgfile-input");
const userImage = document.getElementById("user-image");
const signup_btn = document.getElementById("signup_form");
const submit_btn = document.getElementById("submit_btn");


signup_btn.addEventListener("submit", (e)=>{
    e.preventDefault()
    console.log(e);
    const img = e.target[0].files[0];
    const firstname = e.target[1].value;
    const lastname = e.target[2].value;
    const phonenumber = e.target[3].value;
    const email = e.target[4].value;
    const password= e.target[5].value;

    const userInfo ={
        img,
        firstname,
        lastname,
        phonenumber,
        email,
        password,
    }
    console.log(userInfo);
    submit_btn.disabled=true;
    submit_btn.value="Loading..."
    createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      console.log("user=>", user.user.uid);
      // upload user image
      const userRef = ref(storage, `user/${user.user.uid}` );
      uploadBytes(userRef, img)
        .then(() => {
          console.log("user image uploaded");
          // getting url of the image we just uploaded
          getDownloadURL(userRef)
            .then((url) => {
              console.log("url agya bhai=>", url);

              // update user info object
              userInfo.img = url;

              // created user document reference
              const userDbRef = doc(db, "users", user.user.uid);

              // set this document to db
              setDoc(userDbRef, userInfo).then(() => {
                console.log("User Object Updated into DB");
                window.location.href = "/";
                submit_btn.disabled = false;
                submit_btn.value = "Submit";
              });
            })
            .catch((err) => {
              console.log("url firebase nahn de raha");
              submit_btn.disabled = false;
              submit_btn.value = "Submit";
            });
        })
        .catch(() => {
          console.log("Error in uploading user image");
          submit_btn.disabled = false;
          submit_btn.value = "Submit";
        });
    })
    .catch((err) => {
      alert(err), (submit_btn.disabled = false);
      submit_btn.value = "Submit";
    });

    
});


imgInput.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userImage.src = e.target.result;
            userImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
