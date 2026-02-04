(() => {
  console.log("Miniblox Flashback loaded");

  const frames = [];
  let recording = false;
  let replaying = false;

  // YOU will replace these after inspecting Miniblox
  function getPlayer() {
    return window.player || window.game?.player;
  }

  function getCamera() {
    return window.camera || window.game?.camera;
  }

  function recordFrame() {
    if (!recording) return;

    const p = getPlayer();
    const c = getCamera();
    if (!p || !c) return;

    frames.push({
      time: performance.now(),
      pos: { x: p.x, y: p.y, z: p.z },
      rot: { yaw: c.yaw, pitch: c.pitch }
    });
  }

  setInterval(recordFrame, 50);

  window.flashback = {
    start() {
      frames.length = 0;
      recording = true;
      console.log("Recording started");
    },
    stop() {
      recording = false;
      console.log("Recording stopped:", frames.length, "frames");
    },
    play() {
      if (frames.length === 0) return;
      replaying = true;
      let i = 0;

      const interval = setInterval(() => {
        if (i >= frames.length || !replaying) {
          clearInterval(interval);
          replaying = false;
          return;
        }

        const f = frames[i];
        const c = getCamera();
        if (c) {
          c.yaw = f.rot.yaw;
          c.pitch = f.rot.pitch;
        }

        i++;
      }, 50);
    }
  };
})();
