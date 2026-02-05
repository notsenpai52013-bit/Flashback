console.log("[Flashback] content.js running");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "INJECT_REPLAY") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      world: "MAIN",
      files: ["replay.js"]
    });
  }
});
