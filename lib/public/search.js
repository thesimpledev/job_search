const buttons = document.querySelectorAll("input[type='radio']");

function toggleButton(e) {
  const container = e.target.parentElement;

  if (!container.classList.contains('selected')) {
    document.querySelector(".selected").classList.remove('selected');
    container.classList.add('selected');
  }
}

buttons.forEach(button => button.addEventListener('click', toggleButton));