(function() {
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

  locationButtonSelect();
  showPassingPoints();
})();