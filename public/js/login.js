const submit = async function (event) {
  event.preventDefault();
  console.log("this works");
}

window.onload = async function () {
    const button = document.querySelector("#login")
    button.onclick = submit
};
