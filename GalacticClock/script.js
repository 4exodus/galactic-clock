const canvas = document.getElementById("galacticClock");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const orbitColors = ["#FFD700", "#1E90FF", "#ADFF2F"];
let trails = [];

// Variabile per gestire il tempo fluido
let lastFrameTime = 0;
let smoothSeconds = 0;
let smoothMinutes = 0;
let smoothHours = 0;

// Funzione per disegnare l'orologio
function drawClock(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = new Date();
    const rawSeconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const rawMinutes = now.getMinutes() + rawSeconds / 60;
    const rawHours = (now.getHours() % 12) + rawMinutes / 60;

    // Interpolazione per movimento fluido
    smoothSeconds += (rawSeconds - smoothSeconds) * deltaTime * 0.1;
    smoothMinutes += (rawMinutes - smoothMinutes) * deltaTime * 0.1;
    smoothHours += (rawHours - smoothHours) * deltaTime * 0.1;

    // Disegna il centro
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "white";
    ctx.fill();

    // Testo dinamico
   // ctx.shadowBlur = 0; // Rimuove ombre per il testo
   // ctx.font = "30px Arial";
   // ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
   // const timeText = `${String(Math.floor(rawHours)).padStart(2, "0")}:${String(Math.floor(rawMinutes) % 60).padStart(2, "0")}:${String(Math.floor(rawSeconds) % 60).padStart(2, "0")}`;
   // ctx.fillText(timeText, centerX - ctx.measureText(timeText).width / 2, centerY + 10);

    // Disegna le orbite
    drawOrbit(centerX, centerY, 100, smoothSeconds, orbitColors[0], 5);
    drawOrbit(centerX, centerY, 150, smoothMinutes, orbitColors[1], 8);
    drawOrbit(centerX, centerY, 200, smoothHours * 5, orbitColors[2], 12);
}

// Funzione per disegnare un'orbita con scie
function drawOrbit(x, y, radius, value, color, planetSize) {
    // Orbita
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Calcola posizione del pianeta
    const angle = (Math.PI * 2 * value) / 60;
    const planetX = x + radius * Math.cos(angle - Math.PI / 2);
    const planetY = y + radius * Math.sin(angle - Math.PI / 2);

    // Scia luminosa
    trails.push({ x: planetX, y: planetY, color });
    trails = trails.slice(-50); // Limita il numero di punti nella scia

    trails.forEach((trail, index) => {
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, planetSize / (index + 2), 0, Math.PI * 2);
        ctx.fillStyle = trail.color.replace("1)", `${1 - index * 0.02})`);
        ctx.fill();
    });

    // Pianeta
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetSize, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.fill();
}

// Funzione di animazione con delta time per interpolazione ultra-fluida
function animate(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const deltaTime = (timestamp - lastFrameTime) / 16.67; // Normalizza delta time
    lastFrameTime = timestamp;

    drawClock(deltaTime);
    requestAnimationFrame(animate);
}

// Resize dinamico
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    trails = [];
});

// Avvia animazione
requestAnimationFrame(animate);
