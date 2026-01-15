(() => {
  const CONFIG = {
    particles: 40,
    speed: [2.5, 7.5],
    size: [1.2, 2.8],
    gravity: 0.06,
    friction: 0.985,
    life: [35, 65],
    glow: true
  };

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.id = "click-fireworks-canvas";
  document.documentElement.appendChild(canvas);

  const style = document.createElement("style");
  style.textContent = `
    #click-fireworks-canvas{
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999999;
    }
  `;
  document.head.appendChild(style);

  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const particles = [];
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pickColor = () => {
    const hue = Math.floor(rand(0, 360));
    return `hsl(${hue} 95% 60%)`;
  };

  function spawnFirework(x, y) {
    const count = CONFIG.particles;
    const baseColor = pickColor();
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(CONFIG.speed[0], CONFIG.speed[1]);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(CONFIG.size[0], CONFIG.size[1]),
        color: baseColor,
        alpha: 1,
        life: Math.floor(rand(CONFIG.life[0], CONFIG.life[1])),
        age: 0
      });
    }
  }

  function onPointerDown(ev) {
    // 不想点击链接/按钮也放烟花，就取消注释下面这行
    // if (ev.target?.closest?.("a,button,input,textarea,select,label")) return;

    spawnFirework(ev.clientX, ev.clientY);
  }
  window.addEventListener("pointerdown", onPointerDown, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age++;

      p.vx *= CONFIG.friction;
      p.vy = p.vy * CONFIG.friction + CONFIG.gravity;
      p.x += p.vx;
      p.y += p.vy;

      p.alpha = Math.max(0, 1 - p.age / p.life);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (CONFIG.glow) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      }
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.age >= p.life || p.alpha <= 0.001) particles.splice(i, 1);
    }

    requestAnimationFrame(tick);
  }
  tick();
})();
