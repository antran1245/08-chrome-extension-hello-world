console.log("Server JavaScript Script");

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
 * Save current tab to database by API called.
 */
const saveTabButton = document.querySelector("#saveTabButton");
saveTabButton.addEventListener("click", () => {
  const title =
    currentTab["title"] != "" ? currentTab["title"] : currentTab["url"];
  const url = currentTab["url"];
  const description =
    currentTab["title"] != "" ? currentTab["title"] : currentTab["url"];
  const data = { title, url, description };
  fetch("http://127.0.0.1:5000/url/add", {
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
/**
 * {
    "active": true,
    "audible": true,
    "autoDiscardable": true,
    "discarded": false,
    "favIconUrl": "https://www.youtube.com/s/desktop/428d9196/img/logos/favicon_32x32.png",
    "frozen": false,
    "groupId": -1,
    "height": 911,
    "highlighted": true,
    "id": 2078446582,
    "incognito": false,
    "index": 5,
    "lastAccessed": 1748721631268.859,
    "mutedInfo": {
        "muted": false
    },
    "pinned": false,
    "selected": true,
    "status": "complete",
    "title": "TL vs DIG - PLAYOFFS 2025 LTA North Split 2 - W9D1 - YouTube",
    "url": "https://www.youtube.com/watch?v=GyliB_kDb0I&ab_channel=LTANorth",
    "width": 1920,
    "windowId": 2078446493
}
 */
