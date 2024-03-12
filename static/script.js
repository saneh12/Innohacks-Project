document.addEventListener("DOMContentLoaded", function () {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchangeIcon = document.querySelector(".exchange");
    const selectTags = document.querySelectorAll("select");
    const icons = document.querySelectorAll(".row i");
    const translateBtn = document.querySelector("button.translate");

    // Populate dropdowns with language options
    selectTags.forEach((tag, id) => {
        for (let languages in countries) {
            let languageCode=countries[languages];
            let selected = id == 0 ? ( languageCode== "en-GB" ? "selected" : "") : (languageCode == "hi-IN" ? "selected" : "");
            let option = `option ${selected} value="${languageCode}">${languages}</option>`;
            tag.insertAdjacentHTML("beforeend", option);
        }
    });

    // Exchange languages
    exchangeIcon.addEventListener("click", () => {
        let tempText = fromText.value;
        let tempLang = selectTags[0].value;
        fromText.value = toText.value;
        toText.value = tempText;
        selectTags[0].value = selectTags[1].value;
        selectTags[1].value = tempLang;
    });

    // Clear output textarea if input textarea is empty
    fromText.addEventListener("keyup", () => {
        if (!fromText.value) {
            toText.value = "";
        }
    });

    // Translate text
    translateBtn.addEventListener("click", () => {
        let text = fromText.value.trim();
        let translateFrom = selectTags[0].value;
        let translateTo = selectTags[1].value;
        if (!text) return;
        toText.setAttribute("placeholder", "Translating...");
        let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                toText.value = data.responseData.translatedText;
                data.matches.forEach(data => {
                    if (data.id === 0) {
                        toText.value = data.translation;
                    }
                });
                toText.setAttribute("placeholder", "Translation");
            });
    });

    // Handle copying text and text-to-speech
    icons.forEach(icon => {
        icon.addEventListener("click", ({ target }) => {
            if (!fromText.value || !toText.value) return;
            if (target.classList.contains("fa-copy")) {
                if (target.id == "from") {
                    navigator.clipboard.writeText(fromText.value);
                } else {
                    navigator.clipboard.writeText(toText.value);
                }
            } else {
                let utterance;
                if (target.id == "from") {
                    utterance = new SpeechSynthesisUtterance(fromText.value);
                    utterance.lang = selectTags[0].value;
                } else {
                    utterance = new SpeechSynthesisUtterance(toText.value);
                    utterance.lang = selectTags[1].value;
                }
                speechSynthesis.speak(utterance);
            }
        });
    });

    // Function to copy text from input textarea
    function myFunction() {
        let copyText = document.querySelector(".from-text");
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(copyText.value);
        alert("Copied the text: " + copyText.value);
    }
});