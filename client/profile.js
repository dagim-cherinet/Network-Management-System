const nameField = document.getElementById('name')
const token2 = localStorage.getItem('token').toString()
//const btn = document.getElementById('btn-nav-bar');
const showUserName = async () => {
    loadingDOM.style.visibility = 'visible'
    try {
      const {
        data
      } = await axios.get(`/api/users/${token2}`)
      console.log(data)
//console.log(data.username)
nameField.innerText = data.username
const{jobtype, username, buildingnumber, buildingname, officenumber, phonenumber} = data;
const child = document.createElement('div');
child.innerHTML = `<div id = "user-table" class= "hide-info info-table">
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
     ${buildingname}
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
`
document.body.appendChild(child)
    }
    catch(error){
        console.log(error)
    }}
    showUserName()
    nameField.style.cursor = "pointer"
    nameField.addEventListener("click", ()=>{

  document.getElementById('user-table').classList.toggle('hide-info')
       // console.log()
    })