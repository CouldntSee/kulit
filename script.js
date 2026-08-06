// ==================== CONFIG ====================
const SECRET_PASSWORD = "0707";
const MONTHSARY_DATE = new Date(2024, 0, 15); // Change to your real date: new Date(YYYY, MM-1, DD)

// ==================== DIAL PAD PASSWORD ====================
let enteredCode = "";
const maxDigits = 4;
const dialDots = document.getElementById('dial-dots');

function updateDisplay() {
    const filled = enteredCode.length;
    let display = "";
    for (let i = 0; i < maxDigits; i++) {
        display += (i < filled) ? "● " : "○ ";
    }
    dialDots.textContent = display.trim();
    
    if (filled === maxDigits) {
        dialDots.classList.add('filled');
    } else {
        dialDots.classList.remove('filled');
    }
}

function dialPress(num) {
    if (enteredCode.length < maxDigits) {
        enteredCode += num;
        updateDisplay();
        
        // Subtle click feedback
        dialDots.style.transform = "scale(1.1)";
        setTimeout(() => dialDots.style.transform = "scale(1)", 100);
    }
    
    // Auto-submit when 4 digits entered
    if (enteredCode.length === maxDigits) {
        setTimeout(dialSubmit, 300);
    }
}

function dialClear() {
    if (enteredCode.length > 0) {
        enteredCode = enteredCode.slice(0, -1);
        updateDisplay();
        dialDots.classList.remove('filled');
    }
}

function dialSubmit() {
    const errorMsg = document.getElementById('password-error');
    
    if (enteredCode === SECRET_PASSWORD) {
        // Success! Unlock the site
        dialDots.textContent = "✓ ✓ ✓ ✓";
        dialDots.style.color = "#90EE90";
        
        setTimeout(() => {
            document.getElementById('password-overlay').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('password-overlay').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
                document.getElementById('main-content').classList.add('fade-in');
                startMusic();
            }, 600);
        }, 400);
    } else {
        // Wrong code
        enteredCode = "";
        updateDisplay();
        dialDots.classList.add('shake');
        errorMsg.style.display = 'block';
        
        setTimeout(() => {
            dialDots.classList.remove('shake');
            errorMsg.style.display = 'none';
        }, 800);
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('password-overlay');
    if (!overlay || overlay.style.display === 'none') return;
    
    if (e.key >= '0' && e.key <= '9') {
        dialPress(e.key);
    } else if (e.key === 'Backspace') {
        dialClear();
    } else if (e.key === 'Enter') {
        dialSubmit();
    }
});

// ==================== COUNTDOWN ====================
function updateCountdown() {
    const now = new Date();
    const nextMonthsary = new Date(MONTHSARY_DATE);
    
    while (nextMonthsary <= now) {
        nextMonthsary.setMonth(nextMonthsary.getMonth() + 1);
    }
    
    const diff = nextMonthsary - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.innerHTML = `
            <div>Next Monthsary In:</div>
            <span>${days}</span>d <span>${hours}</span>h <span>${minutes}</span>m <span>${seconds}</span>s
        `;
    }
    
    const monthsDiff = (now.getFullYear() - MONTHSARY_DATE.getFullYear()) * 12 + 
                       (now.getMonth() - MONTHSARY_DATE.getMonth());
    const monthsEl = document.getElementById('months-count');
    if (monthsEl) {
        monthsEl.textContent = `${monthsDiff} Months Strong`;
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==================== MUSIC ====================
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
let isPlaying = false;

function startMusic() {
    if (!music) return;
    music.volume = 0.5;
    music.play().then(() => {
        isPlaying = true;
        if (musicBtn) musicBtn.textContent = '⏸️ Pause Music';
    }).catch(e => {
        console.log("Autoplay blocked - user must click");
    });
}

function toggleMusic() {
    if (!music) return;
    if (isPlaying) {
        music.pause();
        if (musicBtn) musicBtn.textContent = '🎵 Play Our Song';
    } else {
        music.play();
        if (musicBtn) musicBtn.textContent = '⏸️ Pause Music';
    }
    isPlaying = !isPlaying;
}

function setVolume(val) {
    if (music) music.volume = val;
}

// ==================== FLOATING TULIPS ====================
function createTulips() {
    const container = document.getElementById('tulip-container');
    if (!container) return;
    
    const tulipEmojis = ['🌷', '💚', '🌿', '🍃', '🌱'];
    
    for (let i = 0; i < 15; i++) {
        const tulip = document.createElement('div');
        tulip.className = 'tulip';
        tulip.textContent = tulipEmojis[Math.floor(Math.random() * tulipEmojis.length)];
        tulip.style.left = Math.random() * 100 + '%';
        tulip.style.animationDuration = (Math.random() * 10 + 10) + 's';
        tulip.style.animationDelay = Math.random() * 10 + 's';
        tulip.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        container.appendChild(tulip);
    }
}
createTulips();

// ==================== DRAWING CANVAS ====================
const canvas = document.getElementById('drawing-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function startDraw(e) {
        isDrawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
        e.preventDefault();
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const pos = getPos(e);
        const color = document.getElementById('brush-color').value;
        const size = document.getElementById('brush-size').value;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        lastX = pos.x;
        lastY = pos.y;
    }

    function stopDraw() {
        isDrawing = false;
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseout', stopDraw);

    // Touch events
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDraw);

    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Initialize white background
    clearCanvas();

    window.saveDrawing = function() {
        const link = document.createElement('a');
        link.download = 'kakulitan-masterpiece.png';
        link.href = canvas.toDataURL();
        link.click();
    };
    
    window.clearCanvas = clearCanvas;
}