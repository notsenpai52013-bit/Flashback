const script = document.createElement("script");
script.src = chrome.runtime.getURL("replay.js");
document.documentElement.appendChild(script);
