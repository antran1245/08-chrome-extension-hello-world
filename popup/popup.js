// Options for tabs query
let tabQueryOptions = {};

// Tabs Array
let tabsArray = [];
// Current Tab
let currentTab = {};

// Storage Local
let currentStorageLocal = {};
let sessionKeyName = "sessions";

/**
 * Retrieves an array of object with tabs and details.
 *
 * @returns {Promise<Object[]>} - A promise that resolves with an array of object.
 * @throws {Error} - If the query fails and 'chrome.runtime.lastError' is set.
 */
function getTabs() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(tabQueryOptions, function (tabs) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs);
      }
    });
  });
}

/**
 * Return the active tab the extension is running.
 * @returns {Promise<Object>} Tab Object
 */
function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tab[0]);
      }
    });
  });
}

/**
 * Set the current sessions
 */
function getStorageLocal() {
  chrome.storage.local.get([sessionKeyName]).then((result) => {
    console.log("Sessions were recieved.");
    currentStorageLocal = result[sessionKeyName];
  });
}

/**
 * Save/Update a session
 * @param {Object} session
 */
function setStorageLocal(session) {
  currentStorageLocal[session.name] = session;
  chrome.storage.local.set({ sessionKeyName: { currentStorageLocal } }, () => {
    console.log("Session was saved.");
  });
}

// Create Session Form
const createSessionForm = document.querySelector("#createSessionForm");

/**
 * Save a session on submit button click
 */
createSessionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(createSessionForm);
  const data = Object.fromEntries(formData.entries());
  let dataArray = [];
  for (let tab in tabsArray) {
    const title = tab["title"] != "" ? tab["title"] : tab["url"];
    const url = tab["url"];
    const description = tab["title"] != "" ? tab["title"] : tab["url"];
    const data = { title, url, description };
    dataArray.push(data);
  }
  console.log(data + "\n" + dataArray);
});

// Current Button Tabs
const currentTabButton = document.querySelector("#getCurrentTab");
/**
 * Connect a button test to run getCurrentTab.
 */
currentTabButton.addEventListener("click", async () => {
  await getCurrentTab();
  console.log(currentTab);
});

// Save Button
const saveTabButton = document.querySelector("#saveTabButton");
/**
 * Save current tab to database by API called.
 */
saveTabButton.addEventListener("click", () => {
  const title =
    currentTab["title"] != "" ? currentTab["title"] : currentTab["url"];
  const url = currentTab["url"];
  const description =
    currentTab["title"] != "" ? currentTab["title"] : currentTab["url"];
  const data = { title, url, description };
  console.log("Save button data:", data);
});

// Print Button
const printTabsButton = document.querySelector("#printTabsArray");
/**
 * Print the tabs array
 */
printTabsButton.addEventListener("click", () => {
  console.log("Current Tabs: ", tabsArray);
  getStorageLocal();
  console.log("Current Storage Local: ", currentStorageLocal);
});

const sessionsContainer = document.querySelector("#sessionsContainer");
function createSession(session) {
  const container = document.createElement("div");
  container.innerText = "Example 1";
  sessionsContainer.appendChild(container);
}
/**
 * Get the current tabs on startup of extension
 */
async function startup() {
  tabsArray = await getTabs();
  currentTab = await getCurrentTab();
  createSession({});
}
startup();
