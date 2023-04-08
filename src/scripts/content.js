const svgs = {};
svgs.microfone = `<svg fill="#000000" version="1.1" id="mic-button-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
viewBox="0 0 490.9 490.9" xml:space="preserve">
<g>
<g>
   <path d="M245.5,322.9c53,0,96.2-43.2,96.2-96.2V96.2c0-53-43.2-96.2-96.2-96.2s-96.2,43.2-96.2,96.2v130.5
       C149.3,279.8,192.5,322.9,245.5,322.9z M173.8,96.2c0-39.5,32.2-71.7,71.7-71.7s71.7,32.2,71.7,71.7v130.5
       c0,39.5-32.2,71.7-71.7,71.7s-71.7-32.2-71.7-71.7V96.2z"/>
   <path d="M94.4,214.5c-6.8,0-12.3,5.5-12.3,12.3c0,85.9,66.7,156.6,151.1,162.8v76.7h-63.9c-6.8,0-12.3,5.5-12.3,12.3
       s5.5,12.3,12.3,12.3h152.3c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-63.9v-76.7c84.4-6.3,151.1-76.9,151.1-162.8
       c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3c0,76.6-62.3,138.9-138.9,138.9s-138.9-62.3-138.9-138.9
       C106.6,220,101.2,214.5,94.4,214.5z"/>
</g>
</g>
</svg>`;

const languageTags = [
    'ar-SA',
    'bn-BD',
    'bn-IN',
    'cs-CZ',
    'da-DK',
    'de-AT',
    'de-CH',
    'de-DE',
    'el-GR',
    'en-AU',
    'en-CA',
    'en-GB',
    'en-IE',
    'en-IN',
    'en-NZ',
    'en-US',
    'en-ZA',
    'es-AR',
    'es-CL',
    'es-CO',
    'es-ES',
    'es-MX',
    'es-US',
    'fi-FI',
    'fr-BE',
    'fr-CA',
    'fr-CH',
    'fr-FR',
    'he-IL',
    'hi-IN',
    'hu-HU',
    'id-ID',
    'it-CH',
    'it-IT',
    'ja-JP',
    'ko-KR',
    'nl-BE',
    'nl-NL',
    'no-NO',
    'pl-PL',
    'pt-BR',
    'pt-PT',
    'ro-RO',
    'ru-RU',
    'sk-SK',
    'sv-SE',
    'ta-IN',
    'ta-LK',
    'th-TH',
    'tr-TR',
    'zh-CN',
    'zh-HK',
    'zh-TW'
];

const languageTagsString = [
    'Arabic (Saudi Arabia)',
    'Bangla (Bangladesh)',
    'Bangla (India)',
    'Czech (Czech Republic)',
    'Danish (Denmark)',
    'Austrian German',
    '"Swiss" German',
    'Standard German (as spoken in Germany)',
    'Modern Greek',
    'Australian English',
    'Canadian English',
    'British English',
    'Irish English',
    'Indian English',
    'New Zealand English', 
    'US English', 
    'English (South Africa)', 
    'Argentine Spanish', 
    'Chilean Spanish', 
    'Colombian Spanish', 
    'Castilian Spanish (as spoken in Central-Northern Spain)', 
    'Mexican Spanish', 
    'American Spanish', 
    'Finnish (Finland)', 
    'Belgian French', 
    'Canadian French', 
    '"Swiss" French', 
    'Standard French (especially in France)', 
    'Hebrew (Israel)', 
    'Hindi (India)', 
    'Hungarian (Hungary)', 
    'Indonesian (Indonesia)', 
    '"Swiss" Italian', 
    'Standard Italian (as spoken in Italy)', 
    'Japanese (Japan)', 
    'Korean (Republic of Korea)', 
    'Belgian Dutch', 
    'Standard Dutch (as spoken in The Netherlands)',
    'Norwegian (Norway)', 
    'Polish (Poland)', 
    'Brazilian Portuguese', 
    'European Portuguese (as written and spoken in Portugal)', 
    'Romanian (Romania)', 
    'Russian (Russian Federation)', 
    'Slovak (Slovakia)', 
    'Swedish (Sweden)', 
    'Indian Tamil', 
    'Sri Lankan Tamil', 
    'Thai (Thailand)', 
    'Turkish (Turkey)', 
    'Mainland China, simplified characters', 
    'Hong Kong, traditional characters', 
    'Taiwan, traditional characters'
];

function reduceAndGetSize(element) {
    const height = element.offsetHeight;
    const width = `calc(100% - ${height}px)`;
    element.style.width = width;
    return height;
}

function createLanguageSelect(parent) {
    // Create a select element
    const select = document.createElement("select");
    select.id = "language-select";
    select.onchange = function(event) {
        setting_lang = "Answer the following prompts in the corresponding language for the locale '"+ event.target.value +"' from here on out. ";
        const selectedValue = event.target.value;
        console.log('Selected value:', selectedValue);
        micButton = document.querySelector("#mic-button");
        addMicrofoneCallbackOnClick(micButton, [createRecognizers(selectedValue)]);
      }

    // Add options to the select element
    const browserLanguage = navigator.language || navigator.userLanguage;
    for (let i = 0; i < languageTags.length; i++) {
        const option = document.createElement("option");
        option.text = languageTagsString[i];
        option.value = languageTags[i];
        if(browserLanguage == languageTags[i]) {
            option.selected = true;
        }
        select.add(option);
    }

    // Add the select element to the document
    parent.appendChild(select);
    return select;
}
langLevels = [
    "Beginner",
    "Adept",
    "Intermediate",
    "Advanced",
    "Expert",
    "Native"
]

// create a new style element
const style = document.createElement('style');

// set the innerHTML of the style element to the CSS you want to inject
style.innerHTML = `
.switch {
    position: relative;
    width: 60px;
    height: 34px;
  }
  
  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    max-height: 19px;
    max-width: calc(4.2vw + 4px);
    top: 83%;
    left: 87%;
    right: 5.5%;
    bottom: 2px;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 17px;
    width: 17px;
    left: 1px;
    bottom: 1px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  input:checked + .slider {
    background-color: #2196F3;
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }
  
  input:checked + .slider:before {
    transform: translateX(calc(2.1vw + 4px));
  }
  
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
  #my-checkbox {
    display: none;
  }
  
`;

// append the style element to the head of the document
document.head.appendChild(style);

correct_mode_setting = "";
function createCorrectionModeSwitch(parent) {
    // Create a new checkbox element
    const wrapper = document.createElement('div');
    parent.appendChild(wrapper);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'my-checkbox';
    wrapper.appendChild(checkbox);

    // Add the checkbox to the DOM
    const span = document.createElement('span');
    span.classList.add("slider", "round")
    const label = document.createElement('label');
    label.classList.add("swich");
    label.appendChild(document.createTextNode('Correction Mode'));
    label.style.marginLeft = "8px";
    label.style.marginTop = "8px";
    label.appendChild(checkbox);
    label.appendChild(span);
    parent.appendChild(label);
    checkbox.onchange = function(event) {
        if(event.target.checked) {
            correct_mode_setting = "Correct every mistake in this prompt regarding grammar and vocabulary. ";
        } else {
            correct_mode_setting = "";
        }

        const selectedValue = event.target.checked;
        console.log('Selected Correction mode:', selectedValue);
    }
    return checkbox;
}

setting_lang_lvl = "";
function createLanguageLevelSelect(parent) {
    // Create a select element
    const select = document.createElement("select");
    select.id = "language-level-select";
    select.onchange = function(event) {
        setting_lang_lvl = "Pretend to be a language teacher teaching a student at the '"+ event.target.value +"' level. ";
        const selectedValue = event.target.value;
        console.log('Selected language level:', selectedValue);
        micButton = document.querySelector("#mic-button");
    }

    for (let i = 0; i < langLevels.length; i++) {
        const option = document.createElement("option");
        option.text = langLevels[i];
        option.value = langLevels[i];
        select.add(option);
    }
    // Add the select element to the document
    parent.appendChild(select);
    return select;
}

function createMicButtonAtSibling(element, size) {
    const micButton = document.createElement("button");
    micButton.style.width = size * 0.66 + "px";
    micButton.style.height = size + "px";
    micButton.innerHTML = svgs.microfone;
    micButton.id = "mic-button";
    micButton.classList.add("mic-button");
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.id = "mic-wrapper";
    element.appendChild(wrapper);
    wrapper.appendChild(micButton);
    return micButton;
}

function applyStyles(sourceElement, targetElement) {
    const styles = window.getComputedStyle(sourceElement);

    targetElement.style.alignItems = "center";
    targetElement.style.width = styles.width;
    targetElement.style.height = styles.height;
    targetElement.style.marginTop = "8px";
    targetElement.style.marginBottom = "0";
}

function applyClasses(element1, element2) {
    // Get an array of classes for element1
    var classes = element1.className.split(' ');

    // Loop through each class and add it to element2
    for (var i = 0; i < classes.length; i++) {
        var className = classes[i];
        element2.classList.add(className);
    }
}

function applyDebugCallbacks(recognition) {
    recognition.onaudiostart = (event) => {
        console.log("Audio recording started");
    };

    recognition.onsoundstart = (event) => {
        console.log("Sound detected");
    };

    recognition.onspeechstart = (event) => {
        console.log("Speech detected");
    };

    recognition.onaudioend = (event) => {
        console.log("Audio recording ended");
        element = document.querySelector("#mic-button");
        element.children[0].setAttribute("fill", "black");
        isRecognizing = false;
    };

    recognition.onsoundend = (event) => {
        console.log("Sound that was detected ended");
    };

    recognition.onspeechend = (event) => {
        console.log("Speech that was detected ended");
    };
}

let texts = {
'ar-SA': { 'text': "", 'confidence': 0 },
'bn-BD': { 'text': "", 'confidence': 0 },
'bn-IN': { 'text': "", 'confidence': 0 },
'cs-CZ': { 'text': "", 'confidence': 0 },
'da-DK': { 'text': "", 'confidence': 0 },
'de-AT': { 'text': "", 'confidence': 0 },
'de-CH': { 'text': "", 'confidence': 0 },
'de-DE': { 'text': "", 'confidence': 0 },
'el-GR': { 'text': "", 'confidence': 0 },
'en-AU': { 'text': "", 'confidence': 0 },
'en-CA': { 'text': "", 'confidence': 0 },
'en-GB': { 'text': "", 'confidence': 0 },
'en-IE': { 'text': "", 'confidence': 0 },
'en-IN': { 'text': "", 'confidence': 0 },
'en-NZ': { 'text': "", 'confidence': 0 },
'en-US': { 'text': "", 'confidence': 0 },
'en-ZA': { 'text': "", 'confidence': 0 },
'es-AR': { 'text': "", 'confidence': 0 },
'es-CL': { 'text': "", 'confidence': 0 },
'es-CO': { 'text': "", 'confidence': 0 },
'es-ES': { 'text': "", 'confidence': 0 },
'es-MX': { 'text': "", 'confidence': 0 },
'es-US': { 'text': "", 'confidence': 0 },
'fi-FI': { 'text': "", 'confidence': 0 },
'fr-BE': { 'text': "", 'confidence': 0 },
'fr-CA': { 'text': "", 'confidence': 0 },
'fr-CH': { 'text': "", 'confidence': 0 },
'fr-FR': { 'text': "", 'confidence': 0 },
'he-IL': { 'text': "", 'confidence': 0 },
'hi-IN': { 'text': "", 'confidence': 0 },
'hu-HU': { 'text': "", 'confidence': 0 },
'id-ID': { 'text': "", 'confidence': 0 },
'it-CH': { 'text': "", 'confidence': 0 },
'it-IT': { 'text': "", 'confidence': 0 },
'ja-JP': { 'text': "", 'confidence': 0 },
'ko-KR': { 'text': "", 'confidence': 0 },
'nl-BE': { 'text': "", 'confidence': 0 },
'nl-NL': { 'text': "", 'confidence': 0 },
'no-NO': { 'text': "", 'confidence': 0 },
'pl-PL': { 'text': "", 'confidence': 0 },
'pt-BR': { 'text': "", 'confidence': 0 },
'pt-PT': { 'text': "", 'confidence': 0 },
'ro-RO': { 'text': "", 'confidence': 0 },
'ru-RU': { 'text': "", 'confidence': 0 },
'sk-SK': { 'text': "", 'confidence': 0 },
'sv-SE': { 'text': "", 'confidence': 0 },
'ta-IN': { 'text': "", 'confidence': 0 },
'ta-LK': { 'text': "", 'confidence': 0 },
'th-TH': { 'text': "", 'confidence': 0 },
'tr-TR': { 'text': "", 'confidence': 0 },
'zh-CN': { 'text': "", 'confidence': 0 },
'zh-HK': { 'text': "", 'confidence': 0 },
'zh-TW': { 'text': "", 'confidence': 0 },
}

setting_lang = "";

function getSettingsString() {
    
    let settings = "";
    settings += setting_lang;
    settings += setting_lang_lvl;
    settings += "\n";
    return settings;
}

function setTextfiledInner(text) {
    const textfield = document.querySelector('form > div > div > textarea[placeholder]');
    console.log("setting message area. Text: " + text + "Field: " + textfield);
    textfield.innerHTML = text;
    textfield.addEventListener("focus", (e) => {
        e.target.value = text;
    })
    textfield.focus();
    textfield.blur();
    textfield.focus();
    const textfieldLength = textfield.value.length;
    textfield.selectionStart = textfieldLength;
    textfield.selectionEnd = textfieldLength;
    window.requestAnimationFrame(() => 0);
}

function createRecognizers(language) {
    let SpeechRecognizer = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognizer();

    console.log("setting language to "+ language);
    // Set recognition options
    const select = document.querySelector("#language-select");
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    applyDebugCallbacks(recognition);
    // Log recognized text to console
    recognition.onresult = (event) => {
        recognizedText = "";
        recognizedTextConfidence = 1;
        console.log("First Recognized results:", event.results[0]);
        for(let i = 0; i < event.results.length; i++) {
                recognizedText += event.results[i][0].transcript;
                recognizedTextConfidence += event.results[i][0].confidence;
        }
        recognizedTextConfidence = recognizedTextConfidence / event.results.length;
        recognition = {
            'text': recognizedText,
            'lang': recognition.lang,
            'confidence': recognizedTextConfidence
        }
        settings = getSettingsString();
        setTextfiledInner(settings + recognizedText);
    }
    return recognition;
}

var isRecognizing = false;

function addMicrofoneCallbackOnClick(element, recognizers) {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        // Create audio context and source node
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var sourceNode = audioCtx.createMediaStreamSource(stream);
        var recognition = recognizers;

        element.onclick = function() {
            if (!isRecognizing) {
                element.children[0].setAttribute("fill", "red");
                // Start recognition and connect source node
                for (let i = 0; i < recognition.length; i++) {
                    recognition[i].start();
                    console.log("Started recognizer for " + recognition[i].lang);
                }
                sourceNode.connect(audioCtx.destination);
                outputTarget = document.querySelector('form > div > div > textarea');
            } else {
                element.children[0].setAttribute("fill", "black");
                // Stop recognition and disconnect source node
                for (let i = 0; i < recognition.length; i++) {
                    recognition[i].stop();
                }
                sourceNode.disconnect();
            }
            isRecognizing = !isRecognizing;
        }
    })
    .catch(function(err) {
        console.log("Error accessing microphone:", err);
    });
}

function init() {
    const messageField = document.querySelector('form > div > div > textarea[placeholder]');
    if(messageField) {
        const size = messageField.parentElement.offsetHeight;
        micButton = createMicButtonAtSibling(messageField.parentElement.parentElement, size);
        languageSelect = createLanguageSelect(micButton.parentElement);
        langlvlSelect = createLanguageLevelSelect(micButton.parentElement);
        correctModeSwitch = createCorrectionModeSwitch(micButton.parentElement);
        correctModeSwitch.style.margin = "12px";
        applyStyles(messageField.parentElement, langlvlSelect);
        applyClasses(messageField.parentElement, langlvlSelect);4
        langlvlSelect.style.width = "22px";
        langlvlSelect.style.marginLeft = "4px";
        applyStyles(messageField.parentElement, micButton);
        applyClasses(messageField.parentElement, micButton);
        micButton.style.width = "22px";
        micButton.style.marginRight = "4px";
        applyStyles(messageField.parentElement, languageSelect);
        applyClasses(messageField.parentElement, languageSelect);
        languageSelect.style.width = "22px";
        languageSelect.style.marginLeft = "4px";
        languageSelect.style.marginRight = "4px";
        const browserLanguage = navigator.language || navigator.userLanguage;
        addMicrofoneCallbackOnClick(micButton, [createRecognizers(browserLanguage)]);
    }
}

function checkForMicButton() {
    const micButton = document.querySelector('#mic-button');
    if (micButton) {
        // The element exists, so execute your function here
        console.log('Mic button found!');
    } else {
        init();
    }
}
const intervalId = setInterval(checkForMicButton, 1000); // Check every 100ms

let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});

function onUrlChange() {
  init();
}