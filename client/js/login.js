const form = document.getElementById("reg__form");
const usernameInputDOM = document.getElementById("username");
const passwordInputDOM = document.getElementById("password");
const btn = document.getElementById("btn");
const user__container = document.querySelector(".user__container");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInputDOM.value;
  const password = passwordInputDOM.value;

  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    console.log(result);
    const {user, status, data} = result;
    console.log(data)
    localStorage.setItem("token", data);
    //sessionStorage.setItem("token", data);
   
    if(user.jobtype == 'employee'){
        location.replace("../user-page.html")
    }
    else if( user.jobtype == 'admin'){
        location.replace("../admin-page.html")
    }
    else if(user.jobtype == 'technician'){
        location.replace('../technician-page.html')
    }
    if (!status.error) {
      
      alert("login Successful, welcome!!");
      

     // location.replace("../admin-page.html");
      //user__container.innerHTML = `<a href ="./profile.html"><button>my profile</button></a>`;
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.log(error);
  }
});
