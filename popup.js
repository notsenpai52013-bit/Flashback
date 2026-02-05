function injectAndSend(cmd) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs[0].id;

    // Inject replay.js into MAIN world
    chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      files: ["replay.js"]
    }, () => {
      // Send command after injection
      chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        func: c => {
          window.flashback && window.flashback[c] && window.flashback[c]();
        },
        args: [cmd]
      });
    });
  });
}

document.getElementById("start").onclick = () => injectAndSend("start");
document.getElementById("stop").onclick = () => injectAndSend("stop");
document.getElementById("play").onclick = () => injectAndSend("play");
