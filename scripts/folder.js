const createFolderForm = document.querySelector("#createFolderForm");

createFolderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(createFolderForm);
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  fetch("http://127.0.0.1:5000/folder/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error in adding URL:", error));
});
