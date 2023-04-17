function getLocale(languageCode) {
	/*
	 * Converts a language code into a locale string.
	 *
	 * @param {string} languageCode - The language code, e.g. "en" or "de".
	 * @returns {string} - The corresponding locale string, e.g. "en-US" or "de-DE".
	 */
	languageCode = languageCode.toLowerCase();
	console.log("locale?: ");
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
		  padding: 5px;
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
	console.log(detection);
	// Create a SpeechSynthesisUtterance object
	var utterance = new SpeechSynthesisUtterance(text);
	console.log(utterance);
	// Set the language for the speech
	utterance.onend = () => {
		newPlayButton.isReading = false;
		newPlayButton.textContent = "Read Aloud";
		newPlayButton.style.backgroundColor = "white";
		newPlayButton.style.color = "black";
	}
	let lang = getLocale(detection.language);
	console.log(lang);
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
	console.log("reading aloud?????: " + paragraph.innerText);
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
			let newButtonBaseText = "Generating"
			newPlayButton.textContent = newButtonBaseText; // Set the text content of the button to "Play"
			newPlayButton.style.maxWidth = newPlayButton.style.width;
			newPlayButton.classList.add('play-button'); // Add a class to the button for styling
			newPlayButton.isReading = false
			let onClick = () => {
				if (!newPlayButton.isReading) {
					newPlayButton.textContent = "Stop Reading";
					newPlayButton.style.backgroundColor = "black";
					newPlayButton.style.color = "white";
					recognizeAndReadText(paragraph, newPlayButton);
				} else {
					stopSpeech();
					newPlayButton.textContent = "Read Aloud";
					newPlayButton.style.backgroundColor = "white";
					newPlayButton.style.color = "black";
				}
				newPlayButton.isReading = !newPlayButton.isReading;
			}
			newPlayButton.addEventListener('click', onClick);
			newPlayButton.style.opacity = 0.5;

			// Create a container element to hold the paragraph and the play button
			const container = document.createElement('div');
			container.classList.add('paragraph-container'); // Add a class to the container for styling

			// Append the play button and the original paragraph element to the container
			container.appendChild(newPlayButton);
			let clonedP = paragraph.cloneNode(true);
			clonedP.id = "newParagraph";
			sameContentCount = 0;
			intervalCount = 0;
			let newPInterval = setInterval(() => {
				intervalCount++
				if (clonedP.innerHTML != paragraph.innerHTML) {
					if (intervalCount > 10) {
						newPlayButton.textContent = newPlayButton.textContent + ".";
						intervalCount = 0;
					}
					if (newPlayButton.textContent.length > newButtonBaseText.length + 3) {
						newPlayButton.textContent = newButtonBaseText;
					}
					clonedP.innerHTML = paragraph.innerHTML;
				} else {
					sameContentCount++
					if (sameContentCount > 100) {
						clearInterval(newPInterval);
						newPlayButton.style.opacity = 1;
						newPlayButton.textContent = "Read Aloud";
						onClick();
					}
				}
			}, 30);
			container.appendChild(clonedP); // Use cloneNode to create a deep copy of the paragraph element

			// Replace the original paragraph element with the container in the DOM
			paragraph.parentNode.replaceChild(container, paragraph);
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
