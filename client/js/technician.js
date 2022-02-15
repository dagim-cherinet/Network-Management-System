const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");
const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get("/api/v1/tasks");
    console.log(tasks);
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        return `<div class="single-task ${completed && "task-completed"}">
          <div>
          <div class= "table_div" id=${task.userID} >
          <div class= "name-btn">
  <h5>${name}</h5>
  <button class ="btn" data-id="${
    task.userID
  }" onclick ="get_user(this)"> click </button>
    <button id = "btn-${task.userID}" class ="btn" data-id="${
          task.userID
        }" onclick ="accept_task(this)"> Accept </button> </div>

  </div>
  
  
  </div>
  
  
</div>
  
  
  </div>`;
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

const accept_task = async (btn) => {
  const userID = btn.dataset.id.toString();
  const accept = userID;

  const {
    data: { task },
  } = await axios.patch(`/api/v1/tasks/accept/${accept}`, {
    accepted: true,
  });

  document.getElementById(`btn-${userID}`).style.backgroundColor = "brown";
  document.getElementById(`btn-${userID}`).disabled = true;
};
