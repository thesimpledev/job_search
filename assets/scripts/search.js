(function() {
  function _setLocation(location) {
    const selectedLocation = document.querySelector('.selected-location');
    const locationForms = document.querySelectorAll('.location');

    locationForms.forEach(form => form.value = location);
    selectedLocation.textContent = location;
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

    // listen for reset and clear storage within closure
    document.addEventListener('reset', function() {
      if (index === 2) {
        storage = [];
      } else {
        storage = {};
      }
      render();
    });

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
          ${_prependParitySign(points)}
          <img src="${index === 0 ? 'emerald.png' : 'ruby.png'}" alt="Gem" />
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
      if (e.target.textContent === '+') _addKeyword(e);
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

  // dispatch 'reset' event and clear local storage
  function resetSearch() {
    const resetButton = document.querySelector('.reset');

    resetButton.addEventListener('click', function(e) {
      e.preventDefault();

      const resetEvent = new Event('reset');
      document.dispatchEvent(resetEvent);

      localStorage.clear();
    })
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
  clearQueryString();
  loadStorageFromCookies();
  resetSearch();
  saveSearch();
})();