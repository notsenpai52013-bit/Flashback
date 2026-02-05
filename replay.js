(() => {
  console.log("[Flashback] replay.js injected");

  // =====================
  // STATE
  // =====================
  const frames = [];
  let recording = false;
  let playing = false;
  let recordInterval = null;

  // =====================
  // CAMERA ACCESS (fallback-safe)
  // =====================
  function getCamera() {
    // Try common patterns
    if (window.camera) return window.camera;
    if (window.game?.camera) return window.game.camera;
    if (window.renderer?.camera) return window.renderer.camera;

    // Try Three.js camera
    if (window.THREE) {
      for (const k in window) {
        const v = window[k];
        if (v && v.isPerspectiveCamera) return v;
      }
    }
    return null;
  }

  // =====================
  // RECORDING
  // =====================
  function recordFrame() {
    if (!recording) return;

    const cam = getCamera();
    if (!cam) return;

    frames.push({
      time: performance.now(),
      rot: {
        x: cam.rotation?.x ?? 0,
        y: cam.rotation?.y ?? 0,
        z: cam.rotation?.z ?? 0
      },
      pos: cam.position
        ? { x: cam.position.x, y: cam.position.y, z: cam.position.z }
        : null
    });
  }

  function startRecording() {
    frames.length = 0;
    recording = true;

    if (recordInterval) clearInterval(recordInterval);
    recordInterval = setInterval(recordFrame, 50);

    console.log("[Flashback] Recording started");
  }

  function stopRecording() {
    recording = false;
    if (recordInterval) clearInterval(recordInterval);
    console.log("[Flashback] Recording stopped | Frames:", frames.length);
  }

  // =====================
  // PLAYBACK
  // =====================
  function playReplay() {
    if (frames.length === 0) {
      console.warn("[Flashback] No frames to play");
      return;
    }

    const cam = getCamera();
    if (!cam) {
      console.error("[Flashback] Camera not found");
      return;
    }

    playing = true;
    let i = 0;

    console.log("[Flashback] Playback started");

    const interval = setInterval(() => {
      if (!playing || i >= frames.length) {
        clearInterval(interval);
        playing = false;
        console.log("[Flashback] Playback finished");
        return;
      }

      const f = frames[i];

      if (cam.rotation) {
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

  // =====================
  // PUBLIC API
  // =====================
  window.flashback = {
    start: startRecording,
    stop: stopRecording,
    play: playReplay,
    frames
  };

  // =====================
  // POPUP → PAGE COMMUNICATION
  // =====================
  window.addEventListener("FLASHBACK_CMD", e => {
    const cmd = e.detail;
    console.log("[Flashback] Command:", cmd);

    if (cmd === "start") startRecording();
    if (cmd === "stop") stopRecording();
    if (cmd === "play") playReplay();
  });

  console.log("[Flashback] Ready");
})();
    }
  };
})();
