const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  
};

window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;
};