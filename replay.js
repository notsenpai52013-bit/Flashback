(() => {
  console.log("[Flashback] replay.js running");

  const frames = [];
  let recording = false;
  let playing = false;
  let intervalId = null;

  function findCamera() {
    if (window.camera) return window.camera;
    if (window.game?.camera) return window.game.camera;
    if (window.renderer?.camera) return window.renderer.camera;

    for (const k in window) {
      const v = window[k];
      if (v && v.isPerspectiveCamera) return v;
    }
    return null;
  }

  function record() {
    if (!recording) return;

    const cam = findCamera();
    if (!cam) return;

    frames.push({
      rot: cam.rotation
        ? { x: cam.rotation.x, y: cam.rotation.y, z: cam.rotation.z }
        : null,
      pos: cam.position
        ? { x: cam.position.x, y: cam.position.y, z: cam.position.z }
        : null
    });
  }

  function start() {
    frames.length = 0;
    recording = true;

    clearInterval(intervalId);
    intervalId = setInterval(record, 50);

    console.log("[Flashback] Recording started");
  }

  function stop() {
    recording = false;
    clearInterval(intervalId);
    console.log("[Flashback] Recording stopped | Frames:", frames.length);
  }

  function play() {
    if (!frames.length) {
      console.warn("[Flashback] No frames");
      return;
    }

    const cam = findCamera();
    if (!cam) {
      console.error("[Flashback] Camera not found");
      return;
    }

    playing = true;
    let i = 0;

    console.log("[Flashback] Playback started");

    const playInterval = setInterval(() => {
      if (!playing || i >= frames.length) {
        clearInterval(playInterval);
        playing = false;
        console.log("[Flashback] Playback finished");
        return;
      }

      const f = frames[i];

      if (cam.rotation && f.rot) {
        cam.rotation.x = f.rot.x;
        cam.rotation.y = f.rot.y;
        cam.rotation.z = f.rot.z;
      }

      if (cam.position && f.pos) {
        cam.position.x = f.pos.x;
        cam.position.y = f.pos.y;
        cam.position.z = f.pos.z;
      }

      i++;
    }, 50);
  }

  // expose globally (IMPORTANT)
  window.flashback = { start, stop, play, frames };
  window.top.flashback = window.flashback;

  // listen for popup commands
  window.addEventListener("FLASHBACK_CMD", e => {
    const cmd = e.detail;
    if (cmd === "start") start();
    if (cmd === "stop") stop();
    if (cmd === "play") play();
  });

  console.log("[Flashback] Ready");
})();
})();
    }
  };
})();
