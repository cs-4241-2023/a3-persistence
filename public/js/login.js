const submit = async function (event) {
  event.preventDefault();
  
  const form = document.querySelector("form")
  const body = parseForm(form)

  fetch("/login", {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: body,
  })
}

window.onload = async function () {
    const button = document.querySelector("#login")
    button.onclick = submit
    
};

function parseForm(formData) {
    let body = {};
    Object.keys(formData).forEach((key) => {
      let element = formData.elements[key];
      if (
        element.type !== "submit" &&
        element.type !== "button" &&
        element.type !== "select"
      ) {
        body[element.name] = element.value;
      } else if (element.type === "select") {
      }
    });
    return body;
  }