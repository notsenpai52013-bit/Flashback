console.log("[Flashback] content.js loaded");

const script = document.createElement("script");
script.src = chrome.runtime.getURL("replay.js");
script.type = "text/javascript";

script.onload = () => {
  console.log("[Flashback] replay.js injected");
};

(document.documentElement || document.head).appendChild(script);
