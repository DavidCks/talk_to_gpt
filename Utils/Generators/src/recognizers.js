function getMicbuttonWithRetry() {
    const micButton$INDEX = document.getElementById('mic-button');

    if (micButton) {
        // element found, do something with it
        console.log('Mic button found:', micButton$INDEX );
        return micButton$INDEX ;
    } else {
        // element not found, retry after 500ms
        console.log('Mic button not found, retrying in 500ms...');
        setTimeout(getElementWithRetry, 500);
    }
}

function addMicrofoneCallbackOnClick() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream$INDEX) {
        // Create audio context and source node
        var audioCtx$INDEX  = new (window.AudioContext || window.webkitAudioContext)();
        var sourceNode$INDEX  = audioCtx$INDEX.createMediaStreamSource(stream$INDEX);
        var isRecognizing$INDEX  = false;
        micButton$INDEX = getMicbuttonWithRetry();
        micButton$INDEX.addEventListener("click", function() {
            if (!isRecognizing$INDEX ) {
                micButton$INDEX.children[0].setAttribute("fill", "red");
                // Start recognition and connect source node
                recognition$INDEX.start();
                console.log("Started recognizer for $LOCALE");
                sourceNode$INDEX.connect(audioCtx$INDEX.destination);
            } else {
                micButton$INDEX.children[0].setAttribute("fill", "black");
                // Stop recognition and disconnect source node
                recognition$INDEX.stop();
                sourceNode$INDEX.disconnect();
            }
            isRecognizing$INDEX  = !isRecognizing$INDEX ;
        });
    })
    .catch(function(err) {
        console.log("Error accessing microphone:", err);
    });
}

const recognizerOut$INDEX = document.createElement('div');
recognizerOut$INDEX.id = '$LOCALE Recognition';
document.body.appendChild(recognizerOut$INDEX);

let SpeechRecognizer$INDEX = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition$INDEX = new SpeechRecognizer$INDEX();

// Set recognition options
recognition$INDEX.lang = "$LOCALE";
recognition$INDEX.continuous = true;
recognition$INDEX.interimResults = true;
recognition$INDEX.maxAlternatives = 1;

// Log recognized text to console
recognition$INDEX.onresult = (event$INDEX) => {
    recognizedText$INDEX = "";
    recognizedTextConfidence$INDEX = 0;
    console.log("First Recognized results:", event$INDEX.results[0]);
    for(let i = 0; i < event$INDEX.results.length; i++) {
        recognizedText$INDEX += event$INDEX.results[i][0].transcript;
        recognizedTextConfidence$INDEX += event$INDEX.results[i][0].confidence;
    }
    recognizedTextConfidence$INDEX = recognizedTextConfidence$INDEX / event$INDEX.results.length;
    recognitionResult$INDEX = {
        'text': recognizedText$INDEX,
        'lang': recognition$INDEX.lang,
        'confidence': recognizedTextConfidence$INDEX
    }
    recognizerOut$INDEX.innerHTML = JSON.stringify(recognitionResult$INDEX);
}

addMicrofoneCallbackOnClick();