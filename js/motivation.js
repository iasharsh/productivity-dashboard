const quoteText = document.querySelector(".quote-text");
const quoteAuthor = document.querySelector(".quote-author");

async function fetchQuote() {
    const today = new Date().toDateString();
    const storedData = JSON.parse(localStorage.getItem("quoteOfTheDay"));

    if (storedData && storedData.date === today) {
        displayQuote(storedData.quote, storedData.author);
        return;
    }

    try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();

        localStorage.setItem("quoteOfTheDay", JSON.stringify({
            date: today,
            quote: data.content,
            author: data.author
        }));
        
        displayQuote(data.content, data.author);

    } catch (error) {
        console.error("Error fetching quote: ", error);
        displayQuote("Stay motivated, keep going!", "Harsh Pandey");

    }
}

function displayQuote(text, author) {
    quoteText.textContent = `“${text}”`;
    quoteAuthor.textContent = `— ${author}`;
}


fetchQuote();
