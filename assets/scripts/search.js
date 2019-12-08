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

  // disable button after submitting and append '.'s while waiting for search
  function disableSubmitAfterClicking() {
    const form = document.querySelector('form.search');
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

  // points slider
  function pointsSlider() {
    const slider = document.querySelector('.slider');
    const sliderFill = document.querySelector('.slider-fill');
    const sliderLabelDetail = document.querySelector('.slider-label-detail');
    const rangeInput = document.querySelector('#passing_points');
    let mouseHeld = false;

    function updateInputValue(points) {
      rangeInput.value = points;
    }

    function startSlide() {
      mouseHeld = true;
    }

    function endSlide() {
      mouseHeld = false;
    }

    function sliderSlide(e) {
      const sliderBoundingRect = slider.getBoundingClientRect();

      if (mouseHeld) {
        let points = parseInt(e.offsetX / sliderBoundingRect.width * 100);
        if (points < 0) {
          points = 0;
        } else if (points > 100) {
          points = 100;
        }

        sliderLabelDetail.textContent = `${points} point${points === 1 ? '' : 's'}`;
        sliderFill.style.width = `${e.offsetX}px`;
        updateInputValue(points);
      }
    }

    function sliderSlideMobile(e) {
      const sliderBoundingRect = slider.getBoundingClientRect();
      e.preventDefault();

      if (mouseHeld) {
        let points = parseInt(e.touches[0].clientX / sliderBoundingRect.width * 100);
        if (points < 0) {
          points = 0;
        } else if (points > 100) {
          points = 100;
        }

        sliderLabelDetail.textContent = `${points} point${points === 1 ? '' : 's'}`;
        sliderFill.style.width = `${e.touches[0].clientX}px`;
        updateInputValue(points);
      }
    }


    slider.addEventListener('mousedown', startSlide);
    slider.addEventListener('touchstart', startSlide);

    slider.addEventListener('mousemove', sliderSlide);
    slider.addEventListener('touchmove', sliderSlideMobile);

    slider.addEventListener('mouseup', endSlide);
    slider.addEventListener('touchend', endSlide);

    slider.addEventListener('mouseleave', endSlide);
    slider.addEventListener('touchleave', endSlide);
  }

  locationButtonSelect();
  disableSubmitAfterClicking();
  toggleLocations();
  pointsSlider();
})();