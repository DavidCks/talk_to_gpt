let playButtonText = "►";
let stopButtonText = "◼"

function getLocale(languageCode) {
	/*
	 * Converts a language code into a locale string.
	 *
	 * @param {string} languageCode - The language code, e.g. "en" or "de".
	 * @returns {string} - The corresponding locale string, e.g. "en-US" or "de-DE".
	 */
	languageCode = languageCode.toLowerCase();
	// Use Intl.DisplayNames to get the locale string from the language code
	const locale = new Intl.Locale([languageCode], { type: 'language', language: languageCode });
	const localeString = locale.toString() + "-US";
	return localeString;
}


function addPlaybuttonStyleToDocument() {
	// Create a style element
	var style = document.createElement('style');
	document.head.appendChild(style);

	// Define the CSS class
	var playButtonStyle = `
		.play-button {
		  min-width: 25px;
		  color: black;
		  float: left;
		  display: inline-block;
		  padding-left: 2px;
		  padding-right: 2px;
		  margin: 5px;
		  margin-right: 5px;
		  background-color: #fff;
		  border: none;
		  border-radius: 5px;
		  cursor: pointer;
		  /* Add additional button styles */
		  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
		  transition: background-color 0.3s ease;
		}`;
	let playButtonHoverStyle = `
		.play-button:hover {
		  background-color: #eee; /* Change color on hover */
		}`;

	// Add the CSS class to the style element
	style.sheet.insertRule(playButtonStyle, 0);
	style.sheet.insertRule(playButtonHoverStyle, 0);
}
addPlaybuttonStyleToDocument();

// Function to stop SpeechSynthesisUtterance
function stopSpeech() {
	if ('speechSynthesis' in window && speechSynthesis.speaking) {
		speechSynthesis.cancel();
	}
}

let isCurrentlyReading = false;
// Function to read out text in a specified language
function readText(text, detection, newPlayButton, addOnEnd = true) {
	if(text.length > 250) {
		const tsls = text.split(".");
		for (let i = 0; i < tsls.length; i++){
			readText(tsls[i], detection, newPlayButton, i == tsls.length - 1);
		}
	} else {
		text = text.replaceAll(stopButtonText, "");
		text = text.replaceAll(playButtonText, "");
		// Create a SpeechSynthesisUtterance object
		text = text.replaceAll("\n", "");
		let utterance = new SpeechSynthesisUtterance(text);
		// Set the language for the speech
		if(addOnEnd) {
			utterance.onend = () => {
				newPlayButton.isReading = false;
				newPlayButton.textContent = playButtonText;
				newPlayButton.style.backgroundColor = "white";
				newPlayButton.style.color = "black";
				isCurrentlyReading = false;
			}
		}
		utterance.onerror = (e) => console.log(e);
		utterance.onpause = (e) => console.log(e);
		utterance.onboundary = (e) => console.log(e);
		utterance.onmark = (e) => console.log(e);
		utterance.rate = 1.2;
		utterance.pitch = 1;
		let lang = getLocale(detection.language);
		isCurrentlyReading = true;
		if(!lang) {
			lang = "en-US";
		}
		utterance.lang = lang;

		// Use the speech synthesis API to speak the text
		console.log("reading aloud ("+ lang +"): " + text);
		window.speechSynthesis.speak(utterance);
		}
}

function recognizeAndReadText(paragraph, newPlayButton) {
	chrome.i18n.detectLanguage(
		paragraph.innerText,
		(res) => {
			readText(paragraph.innerText, res.languages[0], newPlayButton);
		},
	)
}

function hasAfterPseudoElement(element) {
	const computedStyle = window.getComputedStyle(element, '::after');
	const content = computedStyle.getPropertyValue('content');
	return !!content && content !== "none";
  }
function addPlayButtonToParagraphs(paragraphs) {
	// Loop through each paragraph element in the array
	paragraphs.forEach(paragraph => {
		paragraph.focus();
		paragraph.style.position = "relative";
		// Check if a "play" button is already present in the paragraph
		const playButton = paragraph.querySelector('.play-button');
		// Check if the parent element has a class of "paragraph-container"
		const parentHasContainerClass = paragraph.parentNode.classList.contains('paragraph-container');
		
		let newPInterval;
		if (!playButton && !parentHasContainerClass) {
			// If not, create a new "play" button element
			const newPlayButton = document.createElement('button');
			let newButtonBaseText = "."
			newPlayButton.textContent = newButtonBaseText; // Set the text content of the button to "Play"
			newPlayButton.style.maxWidth = newPlayButton.style.width;
			newPlayButton.classList.add('play-button'); // Add a class to the button for styling
			newPlayButton.isReading = false
			newPlayButton.hasBeenReadOnce = false;
			let onClick = () => {
				if (!newPlayButton.isReading) {
					newPlayButton.textContent = stopButtonText;
					newPlayButton.style.backgroundColor = "black";
					newPlayButton.style.color = "white";
					recognizeAndReadText(paragraph, newPlayButton);
				} else {
					stopSpeech();
					const btns = document.getElementsByClassName("play-button");
					for(let i = 0; i < btns.length; i++) {
						btns[i].textContent = playButtonText;
						btns[i].style.backgroundColor = "white";
						btns[i].style.color = "black";
					}
				}
				newPlayButton.isReading = !newPlayButton.isReading;
			}
			newPlayButton.addEventListener('click', onClick);
			newPlayButton.style.userSelect = 'none';
			newPlayButton.style.opacity = 0.5;

			// Create a container element to hold the paragraph and the play button
			const container = document.createElement('div');
			container.classList.add('paragraph-container'); // Add a class to the container for styling

			// Append the play button and the original paragraph element to the container
			container.appendChild(newPlayButton);
			let lastPtext = "";
			newPInterval = setInterval(() => {
				cleanParagraphtext = paragraph.innerText.replaceAll(".", "").replaceAll("Generating", "").replaceAll(" ", "").replaceAll("\n", "");
				hasAfter = hasAfterPseudoElement(paragraph);
				if(lastPtext != "" && lastPtext == cleanParagraphtext && cleanParagraphtext.length > 2 && !hasAfter) {
					if(!autoread) {
						newPlayButton.textContent = playButtonText;
						newPlayButton.style.backgroundColor = "white";
						newPlayButton.style.color = "black";
						newPlayButton.style.opacity = 1;
					} else if (!newPlayButton.isReading && !newPlayButton.hasBeenReadOnce) {
						newPlayButton.textContent = stopButtonText;
						newPlayButton.style.backgroundColor = "black";
						newPlayButton.style.color = "white";
						newPlayButton.style.opacity = 1;
						recognizeAndReadText(paragraph, newPlayButton);
						newPlayButton.isReading = true;
						newPlayButton.hasBeenReadOnce = true;
					}
					clear = true;
				}
				lastPtext = cleanParagraphtext;
				if(newPlayButton.style.opacity != 1) {
					newPlayButton.textContent = newPlayButton.textContent + ".";
				}
				if (newPlayButton.textContent.length > newButtonBaseText.length + 3) {
					newPlayButton.textContent = newButtonBaseText;
				}
			}, 500);

			// Replace the original paragraph element with the container in the DOM
			paragraph.appendChild(container);
		} else {
			//let p = paragraph.parentElement.querySelectorAll("p");
			//p.innerHTML = paragraph.innerText;
			//console.log(paragraph.innerText);
		}
	});
}

let autoread = false;
function addswitch2(element) {

	const switchLabel = document.createElement('span');
	switchLabel.innerHTML = "Autoread";

	const wrapper = document.createElement('div');
	wrapper.style.display = "flex";
	wrapper.style.flexDirection = "column";
	wrapper.appendChild(switchLabel);
	wrapper.id = "readOutSwitch";

	// Create switch2 element
	const switch2Elem = document.createElement('label');
	switch2Elem.className = 'switch2';
  
	// Create input element for switch2
	const inputElem = document.createElement('input');
	inputElem.type = 'checkbox';

	// Create span element to represent switch2 slider2
	const slider2Elem = document.createElement('span');
	slider2Elem.className = 'slider2 round';
  
	// Append input and slider2 to switch2
	switch2Elem.appendChild(inputElem);
	switch2Elem.appendChild(slider2Elem);
	
	wrapper.appendChild(switch2Elem);
	// Append switch2 to element
	element.parentNode.insertBefore(wrapper, element.nextSibling);
  
	// Toggle boolean variable when switch2 is clicked
	inputElem.addEventListener('click', function() {
	  autoread = !autoread;
	  console.log("Autoread:" + autoread); // Optional: log variable state to console
	});
  
	// Reflect state of boolean variable in switch2
	function updateswitch2() {
	  if (autoread) {
		inputElem.checked = true;
		slider2Elem.classList.add('slider2-on');
	  } else {
		inputElem.checked = false;
		slider2Elem.classList.remove('slider2-on');
	  }
	}
	updateswitch2();
  
	// Return update function for boolean variable
	return updateswitch2;
  }
  
  

function feAdder() {
	let answers = document.querySelectorAll('p');
	addPlayButtonToParagraphs(answers);
	if(!document.getElementById("readOutSwitch")) {
		const messageField = document.querySelector('form > div > div > textarea[placeholder]');
		addswitch2(messageField.parentElement.parentElement);
	}
}

let interval = setInterval(feAdder, 1000);

// Add CSS rules to document
const styleElem = document.createElement('style');
styleElem.textContent = `
  .switch2 {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
  }

  .switch2 input {
	display: none;
  }

  .slider2 {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: .4s;
	border-radius: 34px;
  }

  .slider2:before {
	position: absolute;
	content: "";
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	transition: .4s;
	border-radius: 50%;
  }

  input:checked + .slider2 {
	background-color: #2196F3;
  }

  input:focus + .slider2 {
	box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider2:before {
	transform: translateX(26px);
  }

  .slider2-on {
	background-color: #6FBF56;
  }

  .slider2-on:before {
	transform: translateX(30px);
  }

  .paragraph-container {
	position: absolute;
	top: -4px;
	left: -54px;
	border-radius: 5px;
	backdrop-filter: blur(12px);
  }
`;
document.head.appendChild(styleElem);