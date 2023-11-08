
const signup = document.getElementById("signup");
    signup.addEventListener("click", (e) => {
      e.preventDefault();
      if (document.getElementById("Name").value == '' || document.getElementById("userName").value == '' || document.getElementById("password1").value == '') {
        alert("Enter all Fields");
      }
      else {
        const name = document.getElementById("Name").value
        const userName = document.getElementById("userName").value
        const password = document.getElementById("password1").value

        const object = {
          name: name,
          userName: userName,
          password: password,

        }
        signUp(object);

      }
      document.getElementById('Name').value = '';
      document.getElementById("userName").value = '';
      document.getElementById("password1").value = '';
    })
    
     const signUp = async (object) => {
      try {
        const Response = await axios.post("user/signup", object)
        alert('Signup Successfully Done');

        //domload()
      }
      catch (error) {
        //console.log(error)
        document.body.innerHTML = "<h3>User Already Exists<h3>"
      }
    }

    const signin = document.getElementById('signin');
    signin.addEventListener("click", (e) => {
      e.preventDefault();
      if (document.getElementById("loguserName").value == '' || document.getElementById("logpassword").value == '') {
        alert("Enter all Fields");
      }
      else {
        const userName = document.getElementById("loguserName").value
        const password = document.getElementById("logpassword").value
        const object = {
          userName: userName,
          password: password,
        }
        signIn(object);

      }
      document.getElementById('loguserName').value = '';
      document.getElementById("logpassword").value = '';
    })

   

    const signIn = async (object) => {
      try {
        const Response = await axios.post("user/signin", object)
        alert(Response.data.message);
        console.log(Response)
        localStorage.setItem('token', Response.data.token);
        window.location.replace('expense');
      }
      catch (error) {
        console.log("Authentication failed. User is not found.");
      }
    }

    const forgotPassword = document.getElementById("paswdresetbtn");

    forgotPassword.addEventListener("click", (e) => {
      e.preventDefault();
      if (document.getElementById("forgotEmail").value == '') {
        alert("Please Enter Email");
      }
      else {
        const forgotemail = document.getElementById("forgotEmail").value

        const object = {
          email: forgotemail,
        }
        forgotPasswordHandler(object);
      }
      document.getElementById('forgotEmail').value = '';
    })

    async function forgotPasswordHandler(object) {
      try {
        const res = await axios.post('password/forgotpassword', object);
        console.log('res in forgotHandler----', res);
        alert(res.data.message);
        //const Response = await axios.post("http://localhost:3000/expense/addexpense", object, { headers: { "Authorization": token } })
      }
      catch (error) {
        document.body.innerHTML = "<h3>Something went wrong<h3>"
      }
    }
