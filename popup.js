function send(cmd) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (cmd) => {
        window.dispatchEvent(new CustomEvent("FLASHBACK_CMD", {
          detail: cmd
        }));
      },
      args: [cmd]
    });
  });
}

document.getElementById("start").onclick = () => send("start");
document.getElementById("stop").onclick = () => send("stop");
document.getElementById("play").onclick = () => send("play");
