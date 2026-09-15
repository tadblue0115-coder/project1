const greetButton = document.querySelector('#greetButton');
const title = document.querySelector('#title');
const display = document.querySelector('#display');
const calculatorKeys = document.querySelector('.calculator-keys');
const matrixCanvas = document.querySelector('#matrixCanvas');

function startMatrixRain() {
    if (!matrixCanvas) {
        return;
    }

    const context = matrixCanvas.getContext('2d');
    const characters = '01アイウエオカキクケコサシスセソ<>[]{}/\\#$%';
    const fontSize = 15;
    let columns = 0;
    let drops = [];

    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        matrixCanvas.width = window.innerWidth * ratio;
        matrixCanvas.height = window.innerHeight * ratio;
        matrixCanvas.style.width = `${window.innerWidth}px`;
        matrixCanvas.style.height = `${window.innerHeight}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        columns = Math.ceil(window.innerWidth / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -40);
    }

    function draw() {
        context.fillStyle = 'rgba(2, 8, 5, 0.09)';
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        context.font = `${fontSize}px monospace`;

        drops.forEach((drop, index) => {
            const character = characters[Math.floor(Math.random() * characters.length)];
            const x = index * fontSize;
            const y = drop * fontSize;
            context.fillStyle = Math.random() > 0.96 ? '#d7ffe5' : '#20d96b';
            context.fillText(character, x, y);

            if (y > window.innerHeight && Math.random() > 0.975) {
                drops[index] = 0;
            }

            drops[index] += 1;
        });
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        draw();
        return;
    }

    function animate() {
        draw();
        window.requestAnimationFrame(animate);
    }

    animate();
}

startMatrixRain();

let expression = '';

function updateDisplay(value = expression || '0') {
    display.textContent = value;
}

function calculate() {
    if (!expression || !/[0-9]$/.test(expression)) {
        return;
    }

    try {
        const result = Function(`"use strict"; return (${expression})`)();

        if (!Number.isFinite(result)) {
            throw new Error('Invalid result');
        }

        expression = String(Math.round(result * 1e10) / 1e10);
        updateDisplay();
    } catch {
        expression = '';
        updateDisplay('錯誤');
    }
}

if (display && calculatorKeys) {
    calculatorKeys.addEventListener('click', (event) => {
        const key = event.target.closest('button');

        if (!key) {
            return;
        }

        const value = key.dataset.value;
        const action = key.dataset.action;

        if (action === 'clear') {
            expression = '';
            updateDisplay();
            return;
        }

        if (action === 'delete') {
            expression = expression.slice(0, -1);
            updateDisplay();
            return;
        }

        if (action === 'calculate') {
            calculate();
            return;
        }

        if (value) {
            const lastCharacter = expression.at(-1);
            const isOperator = /[+\-*/]/.test(value);

            if (isOperator && /[+\-*/]$/.test(expression)) {
                expression = expression.slice(0, -1);
            }

            if (value === '.' && (lastCharacter === '.' || /\.[0-9]*$/.test(expression))) {
                return;
            }

            expression += value;
            updateDisplay();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (/[0-9+\-*/.]/.test(event.key)) {
        document.querySelector(`[data-value="${event.key}"]`)?.click();
    }

    if (event.key === 'Enter' || event.key === '=') {
        document.querySelector('[data-action="calculate"]')?.click();
    }

    if (event.key === 'Escape') {
        document.querySelector('[data-action="clear"]')?.click();
    }

    if (event.key === 'Backspace') {
        document.querySelector('[data-action="delete"]')?.click();
    }
});

if (greetButton && title) {
    greetButton.addEventListener('click', () => {
        title.textContent = '你好！很高興見到你！';
    });
}
