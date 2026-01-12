const input_form = document.querySelector('.input-form');
const t_body = document.getElementById('table-body');

function displayinput_form() {
    input_form.style.display = 'block';
}

function close_form() {
    input_form.style.display = 'none';
}

/* when user clicks on submit button the data should store in server and add into the UI */
function submit_form() {
    let emp_id = document.getElementById('emp-id');
    let name_e = document.getElementById('name');
    let age = document.getElementById('age');
    let salary = document.getElementById('salary');
    let mobile = document.getElementById('mobile');
    let city = document.getElementById('city');
    let department = document.getElementById('department');

    if (emp_id.value !="" && name_e.value!=""&& age.value !="" && salary.value !="" && mobile.value !="" && city.value !="" && department.value !="") {
        var employees_data = { 
           emp_id: emp_id.value,
           name: name_e.value, 
           age: age.value,
           salary: salary.value,
           mobile: mobile.value,
           city: city.value,
           department: department.value
        };

      
        emp_id.value = ""; 
        name_e.value = ""; 
        age.value = ""; 
        salary.value = "";
        mobile.value = ""; 
        city.value = "";
        department.value = "";
        input_form.style.display = 'none';

      send_dataToServer(employees_data)
          .then(() => fetch_and_render())
          .catch(err => console.error(err));
    } else {
        document.getElementById('error-msg').innerText = "Please enter all details before submitting";
        document.getElementById('error-msg').style.color = 'red';
    }
}

function send_dataToServer(employees_data) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.open('POST', 'http://localhost:3000/api/employees/data');
        http.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 300) {
                    console.log('data successfully sent to the server');
                    
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject("Error occurred: " + this.status);
                }
            }
        };
        http.setRequestHeader('Content-type', "application/json");
        http.send(JSON.stringify(employees_data));
    });
}

const loader = document.getElementById("loader");
function fetch_data_from() {
  loader.style.display = "block";
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.open("GET", "http://localhost:3000/api/employees");
    http.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          const data = JSON.parse(this.responseText);
           loader.style.display = "none";
          resolve(data);

        } else {
          reject("Error fetching employees");
        }
      }
    };
    http.send();
  });
}

// Render employees into table
function fetch_and_render() {
  fetch_data_from()
    .then((employees) => {
      t_body.innerHTML = "";
      employees.forEach((emp) => {
      const tr = document.createElement("tr");

       tr.dataset.empId = emp.emp_id;

      tr.innerHTML = `
          <td>${emp.name}</td>
          <td>${emp.age}</td>
          <td>${emp.mobile}</td>
          <td>${emp.city}</td>
        `;
     tr.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.empId;
          const employee = employees.find(emp => emp.emp_id == id);

          show_employee_details(employee);
        });

        t_body.appendChild(tr);
      });
    })
    .catch((err) => console.error(err));
}

function show_employee_details(emp){
      const emp_info_ele= document.querySelector(".emp-info");
      emp_info_ele.innerHTML=`
      <span>
      <button type="button" onclick="close_emp_info()" class="emp-info-button" style="height:25px;width:25px;margin:1% 90%;">x</button>

      </span>
      <h3 style='text-align:center'>Employee information</h3>
      <h6><b>EMP_id:</b> ${emp.emp_id}</h6>
      <h6><b>Name:</b> ${emp.name}</h6>
      <h6><b>Age:</b> ${emp.age}</h6>
      <h6><b>Mobile:</b> ${emp.mobile}</h6>
      <h6><b>City:</b> ${emp.city}</h6>
      <h6><b>Department:</b> ${emp.department}</h6>
      <h6><b>Salary:</b> ${emp.salary}</h6>`
      emp_info_ele.style.display="block";
}
function close_emp_info(){
  document.querySelector(".emp-info").style.display='none';
}
window.onload = fetch_and_render;
