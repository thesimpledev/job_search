(function() {
  // toggle classes on labels instead of using radios
  function locationButtonSelect() {
    const buttons = document.querySelectorAll("input[type='radio']");

    function toggleButton(e) {
      const container = e.target.parentElement;

      if (!container.classList.contains('selected')) {
        document.querySelector(".selected").classList.remove('selected');
        container.classList.add('selected');
      }
    }

    buttons.forEach(button => button.addEventListener('click', toggleButton));
  }

  // show required points to pass when value changes
  function showPassingPoints() {
    const slider = document.querySelector('#passing_points');
    const placeholder = document.querySelector("[data-id='pointsToPass']");

    function valueChanged(event) {
      return placeholder.innerText != event.target.value;
    }

    slider.addEventListener('mousemove', function (e) {
      if (valueChanged(e)) {
        placeholder.textContent = e.target.value;
      }
    });
  }

  // disable button after submitting and append '.'s while waiting for search
  function disableSubmitAfterClicking() {
    const form = document.querySelector('form');
    const submitButton = document.querySelector('button');

    form.addEventListener('submit', function() {
      submitButton.setAttribute('disabled', 'true');
      submitButton.textContent = 'Searching, one moment...';

      // append '.'s while waiting on search
      setInterval(function() {
        submitButton.textContent += '.';
      }, 500);
    });
  }

  locationButtonSelect();
  showPassingPoints();
  disableSubmitAfterClicking();
})();