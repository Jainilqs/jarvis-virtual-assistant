const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else if (message.includes('news')) {
        speak("Fetching the latest news...");
        window.open('https://news.google.com', "_blank");
    } else if (message.includes('weather')) {
        const location = message.replace('weather', '').trim();
        if (location) {
            speak(`Checking the weather in ${location}`);
            window.open(`https://www.google.com/search?q=weather+in+${location.replace(" ", "+")}`, "_blank");
        } else {
            speak("Please specify a location.");
        }
    } else if (message.includes('joke')) {
        tellJoke();
    } else if (message.includes('quote')) {
        tellQuote();
    } else if (message.includes('note')) {
        const note = message.replace('note', '').trim();
        if (note) {
            localStorage.setItem('note', note);
            speak("Note saved.");
        } else {
            speak("Please specify the note.");
        }
    } else if (message.includes('show note')) {
        const note = localStorage.getItem('note');
        if (note) {
            speak(`Your note is: ${note}`);
        } else {
            speak("You have no notes saved.");
        }
    } else if (message.includes('clear note')) {
        localStorage.removeItem('note');
        speak("Note cleared.");
    } else if (message.includes('reminder')) {
        const reminder = message.replace('reminder', '').trim();
        if (reminder) {
            setReminder(reminder);
        } else {
            speak("Please specify the reminder.");
        }
    } else if (message.includes('translate')) {
        const translateText = message.replace('translate', '').trim();
        if (translateText) {
            speak("Translating text...");
            window.open(`https://translate.google.com/?sl=auto&tl=en&text=${translateText.replace(" ", "+")}&op=translate`, "_blank");
        } else {
            speak("Please specify the text to translate.");
        }
    } else if (message.includes('directions to')) {
        const location = message.replace('directions to', '').trim();
        if (location) {
            speak(`Getting directions to ${location}`);
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.replace(" ", "+")}`, "_blank");
        } else {
            speak("Please specify the destination.");
        }
    } else {
        speak("I didn't understand that. Can you please repeat?");
    }
}

function tellJoke() {
    const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "What do you get when you cross a snowman and a vampire? Frostbite.",
        "Why did the bicycle fall over? Because it was two-tired!",
        "What did the ocean say to the shore? Nothing, it just waved.",
        // Add more jokes here
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    speak(joke);
}

function tellQuote() {
    const quotes = [
        "The best way to predict the future is to invent it. - Alan Kay",
        "Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll",
        "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
        // Add more quotes here
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    speak(quote);
}

function setReminder(reminder) {
    const time = parseReminderTime(reminder);
    if (time) {
        setTimeout(() => {
            speak(`Reminder: ${reminder}`);
        }, time);
        speak(`Reminder set for ${time / 1000 / 60} minutes from now.`);
    } else {
        speak("I couldn't parse the time for the reminder. Please specify a valid time.");
    }
}

function parseReminderTime(reminder) {
    const timePattern = /(\d+)\s*(minute|min|hour|hr|second|sec)s?/;
    const match = reminder.match(timePattern);
    if (match) {
        const amount = parseInt(match[1]);
        const unit = match[2];
        let time = 0;
        if (unit.startsWith('min')) {
            time = amount * 60 * 1000;
        } else if (unit.startsWith('hour') || unit.startsWith('hr')) {
            time = amount * 60 * 60 * 1000;
        } else if (unit.startsWith('sec')) {
            time = amount * 1000;
        }
        return time;
    }
    return null;
}
