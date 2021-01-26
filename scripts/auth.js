//GET DATA
// db.collection('guides').get().then(snapshot => {
//     setupGuides(snapshot.docs);
// }); 

//ADD ADMIN CLOUD FUNCTION


//LISTEN FOR AUTH STATUS CHANGE
auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('guides').onSnapshot(snapshot => {
        setupGuides(snapshot.docs);
        setupUI(user);
      }, err => console.log(err.message));
    } else {
      setupUI();
      setupGuides([]);
    }
});

//CREATE NEW GUİDE
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(() => {
        //clean form & close modal
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
        console.log("New Post Created");
    }).catch(err => {
        console.log(err.message);
    })

})

//SIGN UP
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    console.log(email, password);

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        });
        console.log(cred);
    }).then(()=>{
       //close the signup modal
       const modal = document.querySelector('#modal-signup');
       M.Modal.getInstance(modal).close();
       signupForm.reset();
    });
});

//LOGOUT
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e)=>{
    e.preventDefault();
    auth.signOut();
})

//LOGIN
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        //close the login modal & reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})

