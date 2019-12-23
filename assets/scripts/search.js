(function() {
  function _setLocation(location) {
    const selectedLocation = document.querySelector('.selected-location');
    const locationForms = document.querySelectorAll('.location');
    const jumbo = document.querySelector('.search-jumbo');
    const locationToBackground = {
      'San Francisco, CA': 'sanfrancisco.jpg',
      'New York, NY': 'newyork.jpg',
      'Boston, MA': 'boston.jpg',
      'Austin, TX': 'austin.jpg',
      'Seattle, WA': 'seattle.jpg',
      'Denver, CO': 'denver.jpg',
      'Remote': 'remote.jpg',
    };

    locationForms.forEach(form => form.value = location);
    selectedLocation.textContent = location;
    jumbo.style.backgroundImage = `url('assets/${locationToBackground[location]}')`;
  }

  function locationSelect() {
    const locationElements = document.querySelectorAll('.location-selection');

    locationElements.forEach(element => {
      element.addEventListener('click', function(e) {
        const location = e.currentTarget.lastElementChild.textContent;
        _setLocation(location);
        changePageTitle(location)
      });
    });
  }

  function changePageTitle(location) {
    document.title = `Better Jobs - For Software Engineers in ${location}`
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

        sliderLabelDetail.textContent = _pluralizePoints(points);
        sliderFill.style.width = `${e.touches[0].clientX}px`;
        updateInputValue(points);
      }
    }

    function _pluralizePoints(points) {
      return `${points} point${points === 1 ? '' : 's'}`;
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

  function clearQueryString() {
    window.history.pushState({}, document.title, '/');
  }

  function handleKeywords(storage, index) {
    const formAddedKeywords = document.querySelectorAll('.form-added-keywords')[index];
    const formAddButton = document.querySelectorAll('.form-add-button')[index];
    const keywordInput = document.querySelectorAll('.form-add-keyword')[index];
    const pointsInput = document.querySelectorAll('.form-add-points')[index];

    const goodkeywordsInput = document.querySelector("#goodKeywords");
    const badkeywordsInput = document.querySelector("#badKeywords");

    [keywordInput, pointsInput].forEach(node => {
      node.addEventListener('keydown', function(e) {
        if (e.code === "Enter") _addKeyword(e);
      });
    });

    formAddButton.addEventListener('click', function(e) {
      if (e.target.textContent === 'Add') _addKeyword(e);
    });

    function _addKeyword(e) {
      e.preventDefault();
      storage[keywordInput.value] = parseInt(pointsInput.value);
      render();
      clearInputs();
    }

    formAddedKeywords.addEventListener('click', function(e) {
      if (e.target && e.target.nodeName === 'BUTTON') {
        e.preventDefault();
        delete storage[e.target.dataset.key];
        render();
      }
    });

    function render() {
      if (index === 0) {
        goodkeywordsInput.value = JSON.stringify(goodKeywordStorage);
      } else {
        badkeywordsInput.value = JSON.stringify(badKeywordStorage);
      }

      _renderNodes();
    }

    /*
      Element example:

      <li class="form-added-keyword">
        <p>css</p>
        <p>
          20 points
          <button>X</button>
        </p>
      </li>
    */
    function _renderNodes() {
      formAddedKeywords.innerHTML = '';

      Object.keys(storage).forEach(function(key) {
        const container = document.createElement('li');
        container.classList.add('form-added-keyword');
        container.innerHTML = `
          <p>${key}</p>
          <p>
            ${storage[key]} points
            <button data-key="${key}">X</button>
          </p>
        `;

        formAddedKeywords.appendChild(container);
      });
    }

    function clearInputs() {
      keywordInput.value = '';
      pointsInput.value = '';
      keywordInput.focus();
    }
  }

  let goodKeywordStorage = {};
  let badKeywordStorage = {};
  const GOOD_KEYWORD_STORAGE = 'GOOD_KEYWORD_STORAGE';
  const BAD_KEYWORD_STORAGE = 'BAD_KEYWORD_STORAGE';

  function loadStorageFromCookies() {
    goodKeywordStorage = JSON.parse(localStorage.getItem(GOOD_KEYWORD_STORAGE)) || {};
    badKeywordStorage = JSON.parse(localStorage.getItem(BAD_KEYWORD_STORAGE)) || {};

    handleKeywords(goodKeywordStorage, 0);
    handleKeywords(badKeywordStorage, 1);
  }

  function saveSearch() {
    const form = document.querySelector('form.search');

    form.addEventListener('submit', function() {
      localStorage.setItem(GOOD_KEYWORD_STORAGE, JSON.stringify(goodKeywordStorage));
      localStorage.setItem(BAD_KEYWORD_STORAGE, JSON.stringify(badKeywordStorage));
    });
  }

  locationSelect();
  disableSubmitAfterClicking();
  pointsSlider();
  clearQueryString();
  loadStorageFromCookies();
  saveSearch();
})();