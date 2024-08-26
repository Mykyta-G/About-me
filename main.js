const btn = document.getElementById("btn");

btn.addEventListener("click", myFunction)

function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
