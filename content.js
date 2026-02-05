console.log("[Flashback] content.js running");

const s = document.createElement("script");
s.src = chrome.runtime.getURL("replay.js");
s.onload = () => {
  console.log("[Flashback] replay.js injected");
};
(document.head || document.documentElement).appendChild(s);
