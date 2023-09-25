const submit = async function (event) {
    event.preventDefault();
  
    let input = document.querySelectorAll("#Email,#Name,#Birth"),
      json = {
        Email: input[0].value,
        Name: input[1].value,
        Birth: input[2].value,
        Age: age(input[2].value),
      };
  
    function age(birth) {
      let date = new Date(birth);
      let diff = Date.now() - date.getTime();
      let date1 = new Date(diff);
      let age = Math.abs(date1.getUTCFullYear() - 1970);
      return age;
    }
  
    let response = await fetch("/submit", {
      method: "POST",
      body: JSON.stringify(json),
    });
    const text = await response.json();
    document.querySelector("#fade").style.display = "block";
    setTimeout(function () {
      document.querySelector("#fade").style.display = "none";
    }, 1500);
  };
  
  const display = function (event) {
    event.preventDefault();
  
    clear(event);
  
    let res = fetch("/display", {
      method: "GET",
    }).then(res => res.json())
      .then(function (res) {
        const list = document.getElementById("data");
        const header = document.createElement("tr");
        header.innerHTML = `<th>Email</th> <th>Name</th> <th>Birth</th> <th>Age</th> <th>Delete</th>`;
        list.appendChild(header);
        let i = 0;
        res.forEach((d) => {
          const item = document.createElement("tr");
          item.innerHTML = `
      <td>${d.Email}</td> 
      <td>${d.Name}</td>
      <td>${d.Birth}</td>
      <td>${d.Age} years old</td>
      <td>row:${i} <input type="checkbox" class="checkOnce" id="C${i}" 
      onclick="checkedOnClick(this)" value="${d._id}"/></td>
      `;
          i++;
          list.appendChild(item);
        });
  
        document.body.appendChild(list);
      });
  };
  
  const clear = function (event) {
    event.preventDefault();
    let table = document.getElementById("data");
    table.innerHTML = "";
  };
  
  function deleterec(event) {
    event.preventDefault();
  
    let data;
  
    const dis = document.querySelectorAll(".checkOnce");
  
    for (let j = 0; j < dis.length; j++) {
      if (dis[j].checked === true) {
        data = j;
      }
    }
    let json = {
      _id: dis[data].value,
    };
    let response = fetch("/delete", {
      method: "POST",
      body: JSON.stringify(json),
    })
      .then((text) => response.json())
      .then(function () {
        document.querySelector("#dell").style.display = "block";
        setTimeout(function () {
          document.querySelector("#dell").style.display = "none";
        }, 1500);
      });
  }
  
  window.onload = function () {
    const button1 = document.querySelector("#submit");
    const button4 = document.querySelector("#clear");
    const button2 = document.querySelector("#display");
    const button3 = document.querySelector("#delete");
    button1.onclick = submit;
    button2.onclick = display;
    button3.onclick = deleterec;
    button4.onclick = clear;
  };
  