const greetButton = document.querySelector('#greetButton');
const title = document.querySelector('#title');

if (greetButton && title) {
    greetButton.addEventListener('click', () => {
        title.textContent = '你好！很高興見到你！';
    });
}
