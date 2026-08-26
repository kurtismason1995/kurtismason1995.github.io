const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  score: document.getElementById("score"),
  lives: document.getElementById("lives"),
  level: document.getElementById("level"),
};

const STATE = {
  running: "running",
  paused: "paused",
  gameOver: "gameOver",
};

const CONFIG = {
  turnSpeed: Math.PI * 1.8,
  thrustPower: 280,
  friction: 0.992,
  maxSpeed: 420,
  bulletSpeed: 540,
  bulletLife: 1.1,
  fireCooldown: 0.14,
  asteroidMinSpeed: 35,
  asteroidMaxSpeed: 95,
  shipRadius: 16,
  weaponDropChance: 0.16,
};

const WEAPONS = {
  classic: {
    name: "Classic",
    cooldown: 0.14,
    duration: Infinity,
  },
  spread: {
    name: "Spread Shot",
    cooldown: 0.18,
    duration: 11,
  },
  rapid: {
    name: "Rapid Fire",
    cooldown: 0.07,
    duration: 8,
  },
  heavy: {
    name: "Heavy Rounds",
    cooldown: 0.2,
    duration: 10,
  },
};

let keys = {
  left: false,
  right: false,
  thrust: false,
  shoot: false,
};

let gameState = STATE.running;
let score = 0;
let level = 1;
let lives = 3;
let invulnerableTimer = 1.5;
let fireTimer = 0;
let weaponType = "classic";
let weaponTimer = Infinity;

const stars = [];
const bullets = [];
const asteroids = [];
const weaponDrops = [];

const ship = {
  x: canvas.width * 0.5,
  y: canvas.height * 0.5,
  vx: 0,
  vy: 0,
  angle: -Math.PI * 0.5,
  radius: CONFIG.shipRadius,
};

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function wrapPosition(entity) {
  if (entity.x < -entity.radius) {
    entity.x = canvas.width + entity.radius;
  } else if (entity.x > canvas.width + entity.radius) {
    entity.x = -entity.radius;
  }

  if (entity.y < -entity.radius) {
    entity.y = canvas.height + entity.radius;
  } else if (entity.y > canvas.height + entity.radius) {
    entity.y = -entity.radius;
  }
}

function distanceSquared(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function createStars() {
  stars.length = 0;
  for (let i = 0; i < 120; i += 1) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.8 + 0.15,
      drift: Math.random() * 9 + 3,
    });
  }
}

function updateStars(dt) {
  for (const star of stars) {
    star.y += star.drift * dt;
    if (star.y > canvas.height + 1) {
      star.y = -1;
      star.x = Math.random() * canvas.width;
    }
  }
}

function drawStars() {
  for (const star of stars) {
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = "#d9e6ff";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function createAsteroid(size, x = null, y = null) {
  const radiusMap = {
    large: randomRange(42, 58),
    medium: randomRange(26, 34),
    small: randomRange(14, 22),
  };

  const radius = radiusMap[size];
  const speed = randomRange(CONFIG.asteroidMinSpeed, CONFIG.asteroidMaxSpeed);
  const angle = Math.random() * Math.PI * 2;

  let spawnX = x;
  let spawnY = y;

  if (spawnX === null || spawnY === null) {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      spawnX = Math.random() * canvas.width;
      spawnY = -radius;
    } else if (edge === 1) {
      spawnX = canvas.width + radius;
      spawnY = Math.random() * canvas.height;
    } else if (edge === 2) {
      spawnX = Math.random() * canvas.width;
      spawnY = canvas.height + radius;
    } else {
      spawnX = -radius;
      spawnY = Math.random() * canvas.height;
    }
  }

  const segments = Math.floor(randomRange(9, 15));
  const jaggedness = randomRange(0.14, 0.32);
  const points = [];

  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const offset = randomRange(1 - jaggedness, 1 + jaggedness);
    points.push({
      x: Math.cos(t) * radius * offset,
      y: Math.sin(t) * radius * offset,
    });
  }

  return {
    x: spawnX,
    y: spawnY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    size,
    points,
    rot: randomRange(-0.7, 0.7),
    angle: Math.random() * Math.PI * 2,
  };
}

function splitAsteroid(asteroid) {
  if (asteroid.size === "large") {
    asteroids.push(createAsteroid("medium", asteroid.x, asteroid.y));
    asteroids.push(createAsteroid("medium", asteroid.x, asteroid.y));
    score += 50;
  } else if (asteroid.size === "medium") {
    asteroids.push(createAsteroid("small", asteroid.x, asteroid.y));
    asteroids.push(createAsteroid("small", asteroid.x, asteroid.y));
    score += 100;
  } else {
    score += 150;
  }
}

function createWeaponDrop(x, y) {
  const types = ["spread", "rapid", "heavy"];
  const type = types[Math.floor(Math.random() * types.length)];
  const angle = Math.random() * Math.PI * 2;
  const speed = randomRange(20, 46);

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 11,
    life: 12,
    type,
    spin: randomRange(-1.2, 1.2),
    angle: Math.random() * Math.PI * 2,
  };
}

function maybeSpawnWeaponDrop(x, y) {
  if (Math.random() <= CONFIG.weaponDropChance) {
    weaponDrops.push(createWeaponDrop(x, y));
  }
}

function spawnLevel() {
  asteroids.length = 0;
  bullets.length = 0;
  const count = Math.min(4 + level, 12);

  for (let i = 0; i < count; i += 1) {
    let asteroid = createAsteroid("large");
    let tries = 0;

    while (
      distanceSquared(asteroid, ship) < (asteroid.radius + 130) * (asteroid.radius + 130) &&
      tries < 14
    ) {
      asteroid = createAsteroid("large");
      tries += 1;
    }

    asteroids.push(asteroid);
  }

  invulnerableTimer = 1.25;
  updateHud();
}

function resetShip() {
  ship.x = canvas.width * 0.5;
  ship.y = canvas.height * 0.5;
  ship.vx = 0;
  ship.vy = 0;
  ship.angle = -Math.PI * 0.5;
  invulnerableTimer = 1.7;
}

function updateHud() {
  ui.score.textContent = String(score);
  ui.lives.textContent = String(lives);
  ui.level.textContent = String(level);
}

function createProjectile({ x, y, vx, vy, radius, life, color }) {
  bullets.push({
    x,
    y,
    vx,
    vy,
    radius,
    life,
    color,
  });
}

function fireBullet() {
  const noseX = ship.x + Math.cos(ship.angle) * (ship.radius + 2);
  const noseY = ship.y + Math.sin(ship.angle) * (ship.radius + 2);

  if (weaponType === "spread") {
    const spreadAngles = [-0.24, 0, 0.24];
    for (const offset of spreadAngles) {
      const angle = ship.angle + offset;
      createProjectile({
        x: noseX,
        y: noseY,
        vx: Math.cos(angle) * CONFIG.bulletSpeed + ship.vx * 0.25,
        vy: Math.sin(angle) * CONFIG.bulletSpeed + ship.vy * 0.25,
        radius: 2,
        life: CONFIG.bulletLife,
        color: "#5ee4ff",
      });
    }
    return;
  }

  if (weaponType === "heavy") {
    createProjectile({
      x: noseX,
      y: noseY,
      vx: Math.cos(ship.angle) * (CONFIG.bulletSpeed * 0.8) + ship.vx * 0.2,
      vy: Math.sin(ship.angle) * (CONFIG.bulletSpeed * 0.8) + ship.vy * 0.2,
      radius: 3.8,
      life: CONFIG.bulletLife * 1.25,
      color: "#ffd36f",
    });
    return;
  }

  createProjectile({
    x: noseX,
    y: noseY,
    vx: Math.cos(ship.angle) * CONFIG.bulletSpeed + ship.vx * 0.2,
    vy: Math.sin(ship.angle) * CONFIG.bulletSpeed + ship.vy * 0.2,
    radius: 2,
    life: CONFIG.bulletLife,
    color: "#3fd4ff",
  });
}

function activateWeapon(type) {
  weaponType = type;
  weaponTimer = WEAPONS[type].duration;
}

function updateShip(dt) {
  if (keys.left) {
    ship.angle -= CONFIG.turnSpeed * dt;
  }
  if (keys.right) {
    ship.angle += CONFIG.turnSpeed * dt;
  }

  if (keys.thrust) {
    ship.vx += Math.cos(ship.angle) * CONFIG.thrustPower * dt;
    ship.vy += Math.sin(ship.angle) * CONFIG.thrustPower * dt;
  }

  ship.vx *= CONFIG.friction;
  ship.vy *= CONFIG.friction;

  const speed = Math.hypot(ship.vx, ship.vy);
  if (speed > CONFIG.maxSpeed) {
    const ratio = CONFIG.maxSpeed / speed;
    ship.vx *= ratio;
    ship.vy *= ratio;
  }

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;

  wrapPosition(ship);
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const bullet = bullets[i];
    bullet.life -= dt;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;

    wrapPosition(bullet);

    if (bullet.life <= 0) {
      bullets.splice(i, 1);
    }
  }
}

function updateAsteroids(dt) {
  for (const asteroid of asteroids) {
    asteroid.x += asteroid.vx * dt;
    asteroid.y += asteroid.vy * dt;
    asteroid.angle += asteroid.rot * dt;
    wrapPosition(asteroid);
  }
}

function updateWeaponDrops(dt) {
  for (let i = weaponDrops.length - 1; i >= 0; i -= 1) {
    const drop = weaponDrops[i];
    drop.life -= dt;
    drop.x += drop.vx * dt;
    drop.y += drop.vy * dt;
    drop.angle += drop.spin * dt;
    wrapPosition(drop);

    const pickupRadius = drop.radius + ship.radius * 0.9;
    if (distanceSquared(drop, ship) <= pickupRadius * pickupRadius) {
      activateWeapon(drop.type);
      weaponDrops.splice(i, 1);
      continue;
    }

    if (drop.life <= 0) {
      weaponDrops.splice(i, 1);
    }
  }
}

function handleCollisions() {
  for (let ai = asteroids.length - 1; ai >= 0; ai -= 1) {
    const asteroid = asteroids[ai];

    for (let bi = bullets.length - 1; bi >= 0; bi -= 1) {
      const bullet = bullets[bi];
      const hitRadius = asteroid.radius + bullet.radius;

      if (distanceSquared(asteroid, bullet) <= hitRadius * hitRadius) {
        bullets.splice(bi, 1);
        asteroids.splice(ai, 1);
        splitAsteroid(asteroid);
        maybeSpawnWeaponDrop(asteroid.x, asteroid.y);
        updateHud();
        break;
      }
    }
  }

  if (invulnerableTimer > 0) {
    return;
  }

  for (const asteroid of asteroids) {
    const hitRadius = asteroid.radius + ship.radius * 0.75;
    if (distanceSquared(asteroid, ship) <= hitRadius * hitRadius) {
      lives -= 1;
      updateHud();
      if (lives <= 0) {
        gameState = STATE.gameOver;
      } else {
        resetShip();
      }
      break;
    }
  }
}

function drawShip() {
  const blink = invulnerableTimer > 0 && Math.floor(invulnerableTimer * 10) % 2 === 0;
  if (blink) {
    return;
  }

  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  ctx.strokeStyle = "#f5f7fb";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(-13, -12);
  ctx.lineTo(-8, 0);
  ctx.lineTo(-13, 12);
  ctx.closePath();
  ctx.stroke();

  if (keys.thrust && gameState === STATE.running) {
    ctx.strokeStyle = "#57ffad";
    ctx.beginPath();
    ctx.moveTo(-10, -6);
    ctx.lineTo(-19 - Math.random() * 8, 0);
    ctx.lineTo(-10, 6);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBullets() {
  for (const bullet of bullets) {
    ctx.fillStyle = bullet.color || "#3fd4ff";
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWeaponDrops() {
  for (const drop of weaponDrops) {
    const color =
      drop.type === "spread" ? "#63f6ff" : drop.type === "rapid" ? "#75ff98" : "#ffd36f";

    ctx.save();
    ctx.translate(drop.x, drop.y);
    ctx.rotate(drop.angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 10);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

function drawAsteroids() {
  ctx.strokeStyle = "#d7dcf4";
  ctx.lineWidth = 2;

  for (const asteroid of asteroids) {
    ctx.save();
    ctx.translate(asteroid.x, asteroid.y);
    ctx.rotate(asteroid.angle);
    ctx.beginPath();

    for (let i = 0; i < asteroid.points.length; i += 1) {
      const point = asteroid.points[i];
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

function drawOverlay() {
  if (gameState === STATE.paused) {
    drawCenterText("Paused", "Press P to resume");
  }

  if (gameState === STATE.gameOver) {
    drawCenterText("Game Over", "Press R to restart");
  }
}

function drawCenterText(title, subtitle) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.fillStyle = "#f5f7fb";
  ctx.font = "700 56px Trebuchet MS";
  ctx.fillText(title, canvas.width * 0.5, canvas.height * 0.45);

  ctx.fillStyle = "#9eb0cd";
  ctx.font = "600 24px Trebuchet MS";
  ctx.fillText(subtitle, canvas.width * 0.5, canvas.height * 0.55);
}

function drawLevelBanner() {
  if (levelBannerTimer <= 0) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = Math.min(levelBannerTimer, 1);
  ctx.textAlign = "center";
  ctx.fillStyle = "#57ffad";
  ctx.font = "700 28px Trebuchet MS";
  ctx.fillText(`Level ${level}`, canvas.width * 0.5, 56);
  ctx.restore();
}

function drawWeaponStatus() {
  const weapon = WEAPONS[weaponType];
  const timerText = Number.isFinite(weaponTimer) ? ` ${weaponTimer.toFixed(1)}s` : "";

  ctx.textAlign = "left";
  ctx.fillStyle = "#9eb0cd";
  ctx.font = "600 18px Trebuchet MS";
  ctx.fillText(`Weapon: ${weapon.name}${timerText}`, 16, canvas.height - 18);
}

let levelBannerTimer = 2.2;

function restartGame() {
  score = 0;
  level = 1;
  lives = 3;
  gameState = STATE.running;
  fireTimer = 0;
  weaponType = "classic";
  weaponTimer = Infinity;
  weaponDrops.length = 0;
  resetShip();
  spawnLevel();
  levelBannerTimer = 2.2;
}

function update(dt) {
  updateStars(dt);

  if (gameState !== STATE.running) {
    return;
  }

  if (invulnerableTimer > 0) {
    invulnerableTimer -= dt;
  }

  if (levelBannerTimer > 0) {
    levelBannerTimer -= dt;
  }

  if (Number.isFinite(weaponTimer)) {
    weaponTimer -= dt;
    if (weaponTimer <= 0) {
      weaponType = "classic";
      weaponTimer = Infinity;
    }
  }

  fireTimer -= dt;

  if (keys.shoot && fireTimer <= 0) {
    fireBullet();
    fireTimer = WEAPONS[weaponType].cooldown;
  }

  updateShip(dt);
  updateBullets(dt);
  updateAsteroids(dt);
  updateWeaponDrops(dt);
  handleCollisions();

  if (asteroids.length === 0 && gameState === STATE.running) {
    level += 1;
    levelBannerTimer = 2;
    updateHud();
    spawnLevel();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  drawAsteroids();
  drawWeaponDrops();
  drawBullets();
  drawShip();
  drawLevelBanner();
  drawWeaponStatus();
  drawOverlay();
}

let previous = performance.now();

function tick(now) {
  const dt = Math.min((now - previous) / 1000, 0.032);
  previous = now;

  update(dt);
  render();

  requestAnimationFrame(tick);
}

function setKeyState(code, isDown) {
  if (code === "ArrowLeft" || code === "KeyA") {
    keys.left = isDown;
  } else if (code === "ArrowRight" || code === "KeyD") {
    keys.right = isDown;
  } else if (code === "ArrowUp" || code === "KeyW") {
    keys.thrust = isDown;
  } else if (code === "Space") {
    keys.shoot = isDown;
  }
}

document.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) {
    event.preventDefault();
  }

  if (event.code === "KeyP" && !event.repeat) {
    if (gameState === STATE.running) {
      gameState = STATE.paused;
    } else if (gameState === STATE.paused) {
      gameState = STATE.running;
    }
  }

  if (event.code === "KeyR" && !event.repeat) {
    restartGame();
  }

  setKeyState(event.code, true);
});

document.addEventListener("keyup", (event) => {
  setKeyState(event.code, false);
});

createStars();
restartGame();
requestAnimationFrame(tick);
