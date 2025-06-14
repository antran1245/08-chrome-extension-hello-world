const apiCallButton = document.querySelector("#apiCallButton");

/**
 * API called to server to get a 'Hello, World' message
 */
apiCallButton.addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/api/test", {
    method: "GET",
    mode: "no-cors", // CORS mode to allow cross-origin requests
    headers: {
      "Content-Type": "application/json",
      // Add any other custom headers if required
    },
  })
    .then((response) => {
      console.log("Response Status:", response.statusText); // Log the status code
      if (!response.ok) {
        throw new Error("Network response was not ok" + response.statusText);
      }
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
});

/**
 * A fetch POST request.
 *
 * @param {string} apiURL - API endpoint
 * @param {Object|Array} data - Input data to send
 * @param {string} errorString - Prefix for fail API called
 * @returns {Object} - Response from the fetch
 */
function fetchPost(apiURL, data, errorString) {
  let result = { message: "Loading..." };
  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(errorString, error));

  return result;
}
