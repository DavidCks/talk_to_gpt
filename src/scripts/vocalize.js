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
		  color: black;
		  float: left;
		  display: inline-block;
		  padding-left: 2px;
		  padding-right: 2px;
		  margin: 5px;
		  margin-right: 15px;
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
// Function to read out text in a specified language
function readText(text, detection, newPlayButton) {
	text = text.replaceAll(stopButtonText, "");
	text = text.replaceAll(playButtonText, "");
	console.log("reading aloud: " + text);
	// Create a SpeechSynthesisUtterance object
	var utterance = new SpeechSynthesisUtterance(text);
	// Set the language for the speech
	utterance.onend = () => {
		newPlayButton.isReading = false;
		newPlayButton.textContent = playButtonText;
		newPlayButton.style.backgroundColor = "white";
		newPlayButton.style.color = "black";
	}
	let lang = getLocale(detection.language);
	utterance.lang = lang;

	// Use the speech synthesis API to speak the text
	window.speechSynthesis.speak(utterance);
}

function recognizeAndReadText(paragraph, newPlayButton) {
	chrome.i18n.detectLanguage(
		paragraph.innerText,
		(res) => {
			readText(paragraph.innerText, res.languages[0], newPlayButton);
		},
	)
}

function addPlayButtonToParagraphs(paragraphs) {
	// Loop through each paragraph element in the array
	paragraphs.forEach(paragraph => {
		paragraph.focus();
		// Check if a "play" button is already present in the paragraph
		const playButton = paragraph.querySelector('.play-button');
		// Check if the parent element has a class of "paragraph-container"
		const parentHasContainerClass = paragraph.parentNode.classList.contains('paragraph-container');

		if (!playButton && !parentHasContainerClass) {
			// If not, create a new "play" button element
			const newPlayButton = document.createElement('button');
			let newButtonBaseText = "."
			newPlayButton.textContent = newButtonBaseText; // Set the text content of the button to "Play"
			newPlayButton.style.maxWidth = newPlayButton.style.width;
			newPlayButton.classList.add('play-button'); // Add a class to the button for styling
			newPlayButton.isReading = false
			let onClick = () => {
				if (!newPlayButton.isReading) {
					newPlayButton.textContent = stopButtonText;
					newPlayButton.style.backgroundColor = "black";
					newPlayButton.style.color = "white";
					recognizeAndReadText(paragraph, newPlayButton);
				} else {
					stopSpeech();
					newPlayButton.textContent = playButtonText;
					newPlayButton.style.backgroundColor = "white";
					newPlayButton.style.color = "black";
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
			let newPInterval = setInterval(() => {
				cleanParagraphtext = paragraph.innerText.replaceAll(".", "").replaceAll("Generating", "").replaceAll(" ", "");
				if(lastPtext != "" && lastPtext == cleanParagraphtext && cleanParagraphtext.length > 2) {
					newPlayButton.textContent = playButtonText;
					newPlayButton.style.backgroundColor = "white";
					newPlayButton.style.color = "black";
					newPlayButton.style.opacity = 1;
					clearInterval(newPInterval);
				}
				lastPtext = cleanParagraphtext;
				if(newPlayButton.style.opacity != 1) {
					newPlayButton.textContent = newPlayButton.textContent + ".";
				}
				if (newPlayButton.textContent.length > newButtonBaseText.length + 3) {
					newPlayButton.textContent = newButtonBaseText;
				}
			}, 1000);

			// Replace the original paragraph element with the container in the DOM
			let br = document.createElement("br");
			let br2 = document.createElement("br");
			paragraph.appendChild(container);
			paragraph.appendChild(br);
			paragraph.appendChild(br2);
		} else {
			//let p = paragraph.parentElement.querySelectorAll("p");
			//p.innerHTML = paragraph.innerText;
			//console.log(paragraph.innerText);
		}
	});
}

function feAdder() {
	let answers = document.querySelectorAll('p');
	addPlayButtonToParagraphs(answers);
}

let interval = setInterval(feAdder, 1000);
