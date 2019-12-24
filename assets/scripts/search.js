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
    jumbo.style.backgroundImage = `url('${locationToBackground[location]}')`;
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
    // form elements based upon index
    const formAddedKeywords = document.querySelectorAll('.form-added-keywords')[index];
    const formAddButton = document.querySelectorAll('.form-add-button')[index];
    const keywordInput = document.querySelectorAll('.form-add-keyword')[index];
    const pointsInput = document.querySelectorAll('.form-add-points')[index];

    // hidden form input elements
    const indexToHiddenFieldSelector = [
      '#goodKeywords',
      '#badKeywords',
      '#positionExclusions'
    ];
    const hiddenFormField = document.querySelector(indexToHiddenFieldSelector[index]);
    console.log(hiddenFormField);

    // clear inputs
    function _clearInputs() {
      keywordInput.value = '';
      if (index !== 2) pointsInput.value = '';
      keywordInput.focus();
    }

    // add keyword to storage render & clear inputs
    function _addKeyword(e) {
      e.preventDefault();

      if (index === 2) {
        storage.push(keywordInput.value);
      } else {
        let points = parseInt(pointsInput.value);
        points = _parseNumber(points, (index === 1 ? 'negative' : 'positive'));
        storage[keywordInput.value] = points;
      }

      render();
      _clearInputs();
    }

    // handle NaN and select correct parity for number
    function _parseNumber(number, parity) {
      if (isNaN(number)) return 0;

      if (parity === 'negative') {
        return (number > 0 ? -number : number)
      } else {
        return (number < 0 ? -number : number)
      }
    }

    // handle logic for keywordWithPoints nodes
    function _keywordWithPointsNode(keyword, points) {
      return `
        <p>
          <button data-key="${keyword}">X</button>
          ${keyword}
        </p>

        <p class="${index === 0 ? 'good' : 'bad'}">
          <img src="${index === 0 ? 'emerald.png' : 'ruby.png'}" alt="Gem" />
          ${_prependParitySign(points)}
        </p>
      `;
    }

    // 0 => '0'
    // -5 => '- 5'
    // 5 => '+ 5'
    function _prependParitySign(number) {
      if (number === 0) return '0';
      return (number < 0 ? `- ${-number}` : `+ ${number}`);
    }

    // based upon what type of input field (based upon index: 2 being no points)
    // clears the keyword container and re-rendered all nodes based upon storage
    function _renderNodes() {
      formAddedKeywords.innerHTML = '';

      let i = 0;
      (index === 2 ? storage : Object.keys(storage)).forEach(function(key) {
        const container = document.createElement('li');
        container.classList.add('form-added-keyword');

        if (index === 2) {
          container.innerHTML = `
            <p>
              <button data-index="${i}">X</button>
              ${key}
            </p>
          `;
        } else {
          container.innerHTML = _keywordWithPointsNode(key, storage[key]);
        }

        formAddedKeywords.appendChild(container);
        i += 1;
      });
    }

    // find and fill hidden form fields with storage
    function _fillHiddenFormField() {
      hiddenFormField.value = (index === 2 ? storage.toString() : JSON.stringify(storage));
    }

    function render() {
      _fillHiddenFormField();
      _renderNodes();
    }

    [keywordInput, pointsInput].filter(e => e !== undefined).forEach(node => {
      node.addEventListener('keydown', function(e) {
        if (e.code === "Enter") _addKeyword(e);
      });
    });

    formAddButton.addEventListener('click', function(e) {
      if (e.target.textContent === 'Add') _addKeyword(e);
    });

    formAddedKeywords.addEventListener('click', function(e) {
      if (e.target && e.target.nodeName === 'BUTTON') {
        e.preventDefault();

        if (index === 2) {
          storage.splice(e.target.dataset.index, 1);
        } else {
          delete storage[e.target.dataset.key];
        }

        render();
      }
    });

    render();
  }

  function loadStorageFromCookies() {
    goodKeywordStorage = JSON.parse(localStorage.getItem(GOOD_KEYWORD_STORAGE)) || {};
    badKeywordStorage = JSON.parse(localStorage.getItem(BAD_KEYWORD_STORAGE)) || {};
    const positionExclusionsFound = localStorage.getItem(POSITION_EXCLUSIONS_STORAGE);
    positionExclusionsStorage = positionExclusionsFound ? positionExclusionsFound.split(',') : [];

    handleKeywords(goodKeywordStorage, 0);
    handleKeywords(badKeywordStorage, 1);
    handleKeywords(positionExclusionsStorage, 2);
  }

  function saveSearch() {
    const form = document.querySelector('form.search');

    form.addEventListener('submit', function() {
      localStorage.setItem(GOOD_KEYWORD_STORAGE, JSON.stringify(goodKeywordStorage));
      localStorage.setItem(BAD_KEYWORD_STORAGE, JSON.stringify(badKeywordStorage));
      localStorage.setItem(POSITION_EXCLUSIONS_STORAGE, positionExclusionsStorage.toString());
    });
  }

  let goodKeywordStorage = {};
  let badKeywordStorage = {};
  let positionExclusionsStorage = [];
  const GOOD_KEYWORD_STORAGE = 'GOOD_KEYWORD_STORAGE';
  const BAD_KEYWORD_STORAGE = 'BAD_KEYWORD_STORAGE';
  const POSITION_EXCLUSIONS_STORAGE = 'POSITION_EXCLUSIONS_STORAGE';

  locationSelect();
  disableSubmitAfterClicking();
  pointsSlider();
  clearQueryString();
  loadStorageFromCookies();
  saveSearch();
})();