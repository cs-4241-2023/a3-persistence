const create = async function (event) {
  event.preventDefault();
   const newUsername = document.querySelector("#Cusername").value,
          newPassword = document.querySelector("#Cpassword").value;

        const json = {
            newUsername: newUsername,
            newPassword: newPassword,
          },
          body = JSON.stringify(json);
  
        const addAcc = await fetch("/create", {
          method: "POST",
          headers:{ "Content-Type": "application/json" },
          body,
        });
}

window.onload = function () {
  const CreateButton = document.querySelector("#create");
  CreateButton.onclick = create;
}