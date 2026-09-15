const greetButton = document.querySelector('#greetButton');
const title = document.querySelector('#title');
const display = document.querySelector('#display');
const calculatorKeys = document.querySelector('.calculator-keys');

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
