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

    function updatePlaceholder(e) {
      if (placeholder.innerText != e.target.value) {
        placeholder.textContent = e.target.value;
      }
    }

    slider.addEventListener('mousemove', updatePlaceholder); // desktop
    slider.addEventListener('touchmove', updatePlaceholder); // mobile
  }


  // disable button after submitting and append '.'s while waiting for search
  function disableSubmitAfterClicking() {
    const form = document.querySelector('form');
    const submitButton = document.querySelector("input[type='submit']");

    form.addEventListener('submit', function() {
      submitButton.setAttribute('disabled', 'true');
      submitButton.value = 'Searching, one moment...';

      // append '.'s while waiting on search
      setInterval(function() {
        submitButton.value += '.';
      }, 500);
    });
  }

  // hide most locations and allow toggling to show all
  function toggleLocations() {
    const toggleButton = document.querySelector('#toggleLocations');
    const locations = document.querySelectorAll('.search-location');
    const locationsToShow = 20;
    let locationsHidden = true;

    function hideExtraLocations() {
      locationsHidden = true;
      for (let i = locationsToShow; i < locations.length; i++) {
        locations[i].classList.add('hidden');
      }
      toggleButton.textContent = 'Show all locations';
    }

    function showAllLocations() {
      locationsHidden = false;
      for (let i = locationsToShow; i < locations.length; i++) {
        locations[i].classList.remove('hidden');
      }
      toggleButton.textContent = 'Hide most locations';
    }

    // toggle between showing some and all locations
    function toggle(e) {
      e.preventDefault(); // stop form from being submitted

      if (locationsHidden) {
        showAllLocations();
      } else {
        hideExtraLocations();
      }
    }

    hideExtraLocations();
    toggleButton.addEventListener('click', toggle);
  }

  locationButtonSelect();
  showPassingPoints();
  disableSubmitAfterClicking();
  toggleLocations();
})();