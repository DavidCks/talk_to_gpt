function addPlaybuttonStyleToDocument() {
	// Create a style element
	var style = document.createElement('style');
	document.head.appendChild(style);

	// Define the CSS class
	var playButtonStyle = `
		.play-button {
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

// Function to read out text in a specified language
function readText(text, detection) {
	console.log(detection);
  // Create a SpeechSynthesisUtterance object
  //var utterance = new SpeechSynthesisUtterance(text);

  // Set the language for the speech
  //utterance.lang = lang;

  // Use the speech synthesis API to speak the text
  //window.speechSynthesis.speak(utterance);
}

function recognizeAndReadText(paragraph) {
	chrome.i18n.detectLanguage(
	  paragraph.innerText,
	  (res) => {
	 	readText(paragraph.innerTex, res.languages[0]);
	  },
	)
	console.log("reading aloud: " + paragraph.innerText);
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
      newPlayButton.textContent = 'Read Aloud'; // Set the text content of the button to "Play"
      newPlayButton.classList.add('play-button'); // Add a class to the button for styling
      newPlayButton.addEventListener('click', () => recognizeAndReadText(paragraph));

      // Create a container element to hold the paragraph and the play button
      const container = document.createElement('div');
      container.classList.add('paragraph-container'); // Add a class to the container for styling

      // Append the play button and the original paragraph element to the container
      container.appendChild(newPlayButton);
      let clonedP = paragraph.cloneNode(true);
      clonedP.id = "newParagraph";
	  let newPInterval = setInterval(() => {
	  	if(clonedP.innerHTML != paragraph.innerText) {
	  		console.log(paragraph.innerHTML);
	    	clonedP.innerHTML = paragraph.innerHTML;
		} else {
			//clearInterval(newPInterval);
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

function feAdder(){
	let answers = document.querySelectorAll('p');
	addPlayButtonToParagraphs(answers);
}

let interval = setInterval(feAdder, 1000);
