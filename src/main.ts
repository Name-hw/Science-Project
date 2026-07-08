const firstBtn = document.getElementById('first-btn') as HTMLButtonElement;
const secondBtn = document.getElementById('second-btn') as HTMLButtonElement;

firstBtn.addEventListener('click', () => {
  window.location.href = 'src/first/';
});

secondBtn.addEventListener('click', () => {
  window.location.href = 'src/second/';
});