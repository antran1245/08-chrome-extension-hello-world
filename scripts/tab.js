// Options for tabs query
let tabQueryOptions = {};

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
    let tabs = await getTabs();
    console.log(tabs);
  } catch (error) {
    console.log("Error fetching tabs: ", error);
  }
});
