import {
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    db,
    collection,
    addDoc,
    auth
} from "../utils/utils.js"


const event_form = document.getElementById("createEvent_form")
event_form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e);
    const eventinfo =
    {
        banner: e.target[0].files[0],
        title: e.target[1].value,
        description: e.target[2].value,
        price: e.target[3].value,
        createdByemail: auth.currentUser.email,
        createdBy: auth.currentUser.uid,
    }
    console.log(eventinfo.createdByemail);
    const imgref = ref(storage, eventinfo.banner.name)
    uploadBytes(imgref, eventinfo.banner).then(() => {
        console.log("img uploaded");
        getDownloadURL(imgref).then((url) => {
            console.log("url", url);
            eventinfo.banner = url;
            const eventsCollection = collection(db, "events")
            addDoc(eventsCollection, eventinfo).then(() => {
                console.log("document Added");
                window.location.href = "../index.html"
            })
        })
    })
})


