const form = document.getElementById("reg__form");
const usernameInputDOM = document.getElementById("username");
const passwordInputDOM = document.getElementById("password");
const jobtypeInputDOM = document.getElementById("jobtype");
const buildingNameInputDOM = document.getElementById("buildingname");
const buildingNumberInputDOM = document.getElementById("buildingnumber");
const officeNumberInputDOM = document.getElementById("officenumber");
const phoneNumberInputDOM = document.getElementById("phonenumber");

const btn = document.getElementById("btn");
const user__container = document.querySelector(".user__container");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInputDOM.value;
  const password = passwordInputDOM.value;
  const jobtype = jobtypeInputDOM.value;
  const buildingname = buildingNameInputDOM.value;
  const buildingnumber = buildingNumberInputDOM.value;
  const officenumber = officeNumberInputDOM.value;
  const phonenumber = phoneNumberInputDOM.value
  //   try {
  //     await axios.post("/api/register", { username, password });
  //   } catch (error) {
  //     console.log("something went wrong");
  //   }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, jobtype, buildingname, buildingnumber, officenumber, phonenumber }),
    });
    const result = await response.json();
    console.log(result);
    if (!result.error) {
      show_result();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.log(error);
  }
});
const show_result = async () => {
  try {
    const response = await fetch("/api/users/");
    const data = await response.json();

    console.log(data);
    const allUsers = data
      .map((user) => {
        const { username, password, _id: userID } = user;
        return `<tr>
      <td>${username}</td>
      <td>  ${password}</td>
      <td><button class="btn" onclick ="delete_user(this)" data-id ="${userID}">delete</button></td>
       </tr> 
        `;
      })
      .join("");

    user__container.innerHTML = `<table>
  <tr>
     <th>username</th>
     <th>password</th>
  </tr>
 ${allUsers}
    </table>`;
  } catch (error) {
    console.log(error);
  }
};
btn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/users/");
    const data = await response.json();

    console.log(data);
    const allUsers = data
      .map((user) => {
        const { username, password, _id: userID } = user;
        return `<tr>
      <td>${username}</td>
      <td>  ${password}</td>
      <td><button class="btn" onclick ="delete_user(this)" data-id ="${userID}">delete</button></td>
       </tr> 
        `;
      })
      .join("");

    user__container.innerHTML = `<table>
  <tr>
     <th>username</th>
     <th>password</th>
  </tr>
 ${allUsers}
    </table>`;
  } catch (error) {
    console.log(error);
  }
});

const delete_user = async (x) => {
  // const btn = document.querySelector(".btn");
  const userID = x.dataset.id.toString();
  console.log(userID);
  try {
    const response = await fetch(`/api/users/${userID}`, {
      method: "DELETE", // Method itself
      headers: {
        "Content-type": "application/json; charset=UTF-8", // Indicates the content
      },
    });
    console.log(response.status, response.ok);
    show_result();
  } catch (error) {
    console.log(error);
  }
};
