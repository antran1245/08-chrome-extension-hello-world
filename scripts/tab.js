// Options for tabs query
let tabQueryOptions = {};

// Tabs Array
let tabsArray = [];
// Current Tab
let currentTab = {};

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

// 'Get Tabs' button
const tabButton = document.querySelector("#getTabsButton");

/**
 * Send an array of URL
 */
tabButton.addEventListener("click", async () => {
  let dataArray = [];
  for (let tab in tabsArray) {
    const title = tab["title"] != "" ? tab["title"] : tab["url"];
    const url = tab["url"];
    const description = tab["title"] != "" ? tab["title"] : tab["url"];
    const data = { title, url, description };
    dataArray.push(data);
  }
  fetchPost(
    "http://127.0.0.1:5000/url/add/list",
    dataArray,
    "Error in adding URL:"
  );
});

// Print Button
const printTabsButton = document.querySelector("#printTabsArray");
/**
 * Print the tabs array
 */
printTabsButton.addEventListener("click", () => {
  console.log(tabsArray);
});

// Current Button Tabs
const currentTabButton = document.querySelector("#getCurrentTab");
/**
 * Connect a button test to run getCurrentTab.
 */
currentTabButton.addEventListener("click", async () => {
  await getCurrentTab();
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

  fetchPost("http://127.0.0.1:5000/url/add", data, "Error in adding URL:");
});

/**
 * Get the current tabs on startup of extension
 */
async function startup() {
  tabsArray = await getTabs();
  currentTab = await getCurrentTab();
}
startup();
