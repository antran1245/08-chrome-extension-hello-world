// Global Variables

// Options for tabs query
let tabQueryOptions = {};

// Tabs Array
let tabsArray = [];
// Current Tab
let currentTab = {};

// Storage Local
let currentStorageLocal = {};
let sessionKeyName = "sessions";

// CHROME Extension functions

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
 * Get the storage sessions
 * @param {boolean} create - Determine if need to run the createSession function
 */
function getStorageLocal(create = false) {
  chrome.storage.local.get([sessionKeyName], (result) => {
    currentStorageLocal = result[sessionKeyName] ? result[sessionKeyName] : {};
    if (create) createSession(result[sessionKeyName]);
  });
}

/**
 * Save/Update a session
 * @param {Object} session
 */
function setStorageLocal(session) {
  let newSession = { [session["name"]]: session };
  currentStorageLocal = { ...currentStorageLocal, ...newSession };
  chrome.storage.local.set({ [sessionKeyName]: currentStorageLocal }, () => {
    console.log("Session was saved.");
    console.log(currentStorageLocal);
  });
  console.log(currentStorageLocal);
}

/**
 * Clear all Sessions
 */
function clearStorageLocal() {
  chrome.storage.local.clear(function () {
    if (chrome.runtime.lastError) {
      console.error("Error clearing local storage:", chrome.runtime.lastError);
    } else {
      console.log("Local storage cleared");
    }
  });
}

/**
 * Remove a session from the storage.
 * @param {string} key - Session name to remove
 */
function removeStorageLocal(key) {
  chrome.storage.local.remove(key, function () {
    if (chrome.runtime.lastError) {
      console.error("Error removing key:", chrome.runtime.lastError);
    } else {
      console.log("Key removed from local storage");
    }
  });
}

// Helper Functions

/**
 * Return the current date and time
 * @returns string
 */
function currentDate() {
  const now = new Date();
  const isoString = now.toLocaleString();
  const [date, time] = isoString.split(", ");
  return `${date} ${time}`;
}

// Elements and functions

// Create Session Form
const createSessionForm = document.querySelector("#createSessionForm");
/**
 * Save a session on submit button click
 */
createSessionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(createSessionForm);
  const data = Object.fromEntries(formData.entries());
  let dataObject = {};
  for (const tab of tabsArray) {
    const title = tab["title"] != "" ? tab["title"] : tab["url"];
    const url = tab["url"];
    const description = tab["title"] != "" ? tab["title"] : tab["url"];
    const data = { title, url, description };
    dataObject[tab["windowId"]] =
      tab["windowId"] in dataObject
        ? [...dataObject[tab["windowId"]], data]
        : [data];
  }
  let session = {
    name: data["name"],
    description: data["description"],
    browsers: dataObject,
  };
  setStorageLocal(session);
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
  // console.log("Current Tabs: ", tabsArray);
  getStorageLocal();
  console.log("Current Storage Local: ", currentStorageLocal);
});

// Clear All Button
const clearAllButton = document.querySelector("#clearSessions");
clearAllButton.addEventListener("click", () => {
  clearStorageLocal();
});

// Session Container to display sessions
const sessionsContainer = document.querySelector("#sessionsContainer");
/**
 * Create a list of sessions to display.
 * Elements: A container containing text and an open button.
 * @param {Object} session
 */
function createSession(session) {
  for (let key in session) {
    // Create a container div
    const container = document.createElement("div");
    container.innerText = `${key}`;

    // Create a button with a onclick function, then add to container div
    const openButton = document.createElement("button");
    openButton.innerText = "Open";
    openButton.addEventListener("click", () => {
      openSession(session[key]);
    });
    container.appendChild(openButton);

    // Add the container to the list of session to display
    sessionsContainer.appendChild(container);
  }
}

/**
 * Open the selected session
 * @param {object} session - session details
 */
function openSession(session) {
  // Loop the browsers object
  for (let browser in session["browsers"]) {
    let urls = [];

    // Loop the array of URLs to create an url array
    for (let tab of session["browsers"][browser]) {
      urls.push(tab["url"]);
    }
    // Create a window to add tabs
    chrome.windows.create(
      {
        state: "normal",
      },
      (newWindow) => {
        // Create tabs for the window
        urls.forEach((url, index) => {
          chrome.tabs.create({
            windowId: newWindow.id,
            url: url,
            active: index == urls.length - 1,
          });
        });
        // Close the first tab which is a blank tab
        chrome.tabs.query({ windowId: newWindow.id }, (tabs) => {
          if (tabs.length > 0) chrome.tabs.remove(tabs[0].id);
        });
      }
    );
  }
}

const createSessionFormTitle = document.querySelector("#createSessionName");
/**
 * Get the current tabs on startup of extension
 */
async function startup() {
  tabsArray = await getTabs();
  currentTab = await getCurrentTab();
  createSessionFormTitle.value = "Session " + currentDate();
  await getStorageLocal(true);
}
startup();
