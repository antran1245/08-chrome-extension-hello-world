// Options for tabs query
let tabQueryOptions = {};

// Tabs Array
let tabsArray = [];
// Current Tab
let currentTab = {};

/**
 * Retrieves an array of object with tabs and details.
 *
 * @returns {Promise<Object[]>} A promise that resolves with an array of object.
 * @throws {Error} If the query fails and 'chrome.runtime.lastError' is set.
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

// 'Get Tabs' button
const tabButton = document.querySelector("#getTabsButton");

/**
 * Print out an array of tabs.
 * Or
 * Print out an error message.
 */
tabButton.addEventListener("click", async () => {
  try {
    tabsArray = await getTabs();
    console.log(tabsArray);
  } catch (error) {
    console.log("Error fetching tabs: ", error);
  }
});

/**
 * Print the tabs array
 */
const printTabsButton = document.querySelector("#printTabsArray");
printTabsButton.addEventListener("click", () => {
  console.log(tabsArray);
});

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
 * Connect a button test to run getCurrentTab.
 */
const currentTabButton = document.querySelector("#getCurrentTab");
currentTabButton.addEventListener("click", async () => {
  let test = await getCurrentTab();
});

/**
 * Get the current tabs on startup of extension
 */
async function startup() {
  tabsArray = await getTabs();
  currentTab = await getCurrentTab();
}
startup();
