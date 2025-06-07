// Form to create a new Session
const createSessionForm = document.querySelector("#createSessionForm");
createSessionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(createSessionForm);
  const data = Object.fromEntries(formData.entries());

  fetchPost("http://127.0.0.1:5000/session/add", data, "Error in adding URL:");
});
