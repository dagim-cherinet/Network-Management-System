const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");
const token = localStorage.getItem("token");
//const token = sessionStorage.getItem('token');

// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get(`/api/v1/tasks`);
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((stask) => {
        const { completed, _id: taskID, name, accepted } = stask;
        return `<div class="single-task ${completed && "task-completed"}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">
${
  accepted
    ? '<h5 id ="accepted">Accepted</h5><span>    </span>'
    : "Not Accepted"
}
 <button class ="btn" data-id="${
   stask.userID
 }" onclick ="get_user(this)"> click </button>


<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>

</div>
  <div  id=${stask.userID} ></div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;
  const token = localStorage.getItem("token");
  console.log(token);

  try {
    await axios.post("/api/v1/tasks", { name, token });
    showTasks();
    taskInputDOM.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});

const get_user = async (btn) => {
  console.log(btn);
  // const btn = document.querySelector(".btn");
  const userID = btn.dataset.id.toString();
  //console.log(userID);
  try {
    const response = await fetch(`/api/users_Task/${userID}`, {
      method: "GET", // Method itself
      headers: {
        "Content-type": "application/json; charset=UTF-8", // Indicates the content
      },
    });
    const result = await response.json();
    const {
      username,
      jobtype,
      buildingname,
      buildingnumber,
      officenumber,
      phonenumber,
    } = result;

    const child = document.createElement("div");
    const container = document.getElementById(userID);
    console.log(container);
    child.innerHTML = `
      <div>
      <table>
            <thead>
               <tr>
                <th>
                Detail
                </th>
               </tr>
            </thead>

            <tbody>
            <tr>
                  <td>
                  username
                  </td>
                  <td>
                  ${username}
                  </td>
            </tr>
            <tr>
                  <td>
                  Building name
                  </td>
                  <td>
                  ${buildingname}
                  </td>
            </tr>
            <tr>
                  <td>
                  Building Number
                  </td>
                  <td>
                  ${buildingnumber}
                  </td>
            </tr>
      <tr>
          <td>
            Office number
           </td>
           <td>
            ${officenumber}
           </td>
      </tr>
      <tr>
          <td>
            Phone number
           </td>
           <td>
            ${phonenumber}
           </td>
      </tr>
            </tbody>
      <table>
      <div>
      
      
      `;

    container.appendChild(child);

    console.log(result.jobtype);

    // show_result();
  } catch (error) {
    console.log(error);
  }
};
