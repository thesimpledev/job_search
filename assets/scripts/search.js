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
    const submitButton = document.querySelector('button.submit');

    form.addEventListener('submit', function() {
      submitButton.classList.add('disabled');
      submitButton.textContent = 'Searching, one moment...';

      // append '.'s while waiting on search
      setInterval(function() {
        submitButton.textContent += '.';
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

  function saveAndReloadSearch() {
    const form = document.querySelector('form.search');
    const goodKeywords = document.querySelector('#good-keywords');
    const badKeywords = document.querySelector('#bad-keywords');
    const positionExclusions = document.querySelector('#position-exclusions');

    form.addEventListener('submit', function() {
      localStorage.setItem('goodKeywords', goodKeywords.value);
      localStorage.setItem('badKeywords', badKeywords.value);
      localStorage.setItem('positionExclusions', positionExclusions.value);
    });

    document.addEventListener('DOMContentLoaded', function() {
      const storedGoodKeywords = localStorage.getItem('goodKeywords');
      const storedBadKeywords = localStorage.getItem('badKeywords');
      const storedPositionExclusions = localStorage.getItem('positionExclusions');

      [
        {
          storage: storedGoodKeywords,
          field: goodKeywords
        },
        {
          storage: storedBadKeywords,
          field: badKeywords
        },
        {
          storage: storedPositionExclusions,
          field: positionExclusions
        },
      ].forEach(function(element) {
        if (element.storage) {
          element.field.value = element.storage;
        }
      });
    });
  }

  locationButtonSelect();
  disableSubmitAfterClicking();
  toggleLocations();
  pointsSlider();
  saveAndReloadSearch();
})();