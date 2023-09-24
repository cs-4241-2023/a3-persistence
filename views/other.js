function navigateTo(string){
    window.location.replace(string);
}

function showPassword() {
    let x = document.getElementById("pw");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }