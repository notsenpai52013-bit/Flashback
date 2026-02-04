function exec(cmd) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => window.flashback && window.flashback[cmd]()
    });
  });
}

document.getElementById("start").onclick = () => exec("start");
document.getElementById("stop").onclick = () => exec("stop");
document.getElementById("play").onclick = () => exec("play");
