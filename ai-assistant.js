/* =========================================================
   CG-5 AI ASSISTANT
   REAL AI BACKEND CONNECTION
   READ-ONLY DUTY ROSTER ASSISTANT
   ========================================================= */

console.log("CG-5 AI ASSISTANT JS LOADED");


document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("ai-input");
    const button = document.getElementById("ai-send");
    const chat = document.getElementById("ai-chat");


    console.log("AI INPUT:", input);
    console.log("AI BUTTON:", button);
    console.log("AI CHAT:", chat);


    if (!input || !button || !chat) {

        console.error("CG-5 AI elements not found.");

        return;

    }


    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function addMessage(message, type = "assistant") {

        const messageDiv = document.createElement("div");

        messageDiv.className = `ai-message ${type}`;

        const paragraph = document.createElement("p");

        paragraph.textContent = message;

        messageDiv.appendChild(paragraph);

        chat.appendChild(messageDiv);

        chat.scrollTop = chat.scrollHeight;

    }


    function addLoadingMessage() {

        const messageDiv = document.createElement("div");

        messageDiv.className = "ai-message assistant";

        messageDiv.id = "ai-loading-message";


        const paragraph = document.createElement("p");

        paragraph.textContent = "Nag-check sa CG-5 duty roster...";

        messageDiv.appendChild(paragraph);

        chat.appendChild(messageDiv);

        chat.scrollTop = chat.scrollHeight;

    }


    function removeLoadingMessage() {

        const loadingMessage =
            document.getElementById("ai-loading-message");


        if (loadingMessage) {

            loadingMessage.remove();

        }

    }


    /* =====================================================
       GET CURRENT CG-5 ROSTER
       ===================================================== */

    function getRoster() {

        if (
            !window.cg5DutyAI ||
            typeof window.cg5DutyAI.getRoster !== "function"
        ) {

            console.error(
                "CG-5 Duty AI bridge is not available."
            );

            return null;

        }


        try {

            return window.cg5DutyAI.getRoster();

        } catch (error) {

            console.error(
                "Unable to read CG-5 duty roster:",
                error
            );

            return null;

        }

    }


    /* =====================================================
       SEND QUESTION TO BACKEND
       ===================================================== */

    async function askAI(question) {

        const roster = getRoster();


        if (!roster) {

            throw new Error(
                "CG-5 duty roster is not available."
            );

        }


        const response = await fetch(
            "http://localhost:3000/api/ai",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    question: question,

                    roster: roster

                })

            }
        );


        let data;


        try {

            data = await response.json();

        } catch (error) {

            throw new Error(
                "Invalid response from CG-5 AI backend."
            );

        }


        if (!response.ok) {

            console.error(
                "CG-5 AI backend error:",
                data
            );


            throw new Error(
                data.error ||
                "CG-5 AI backend returned an error."
            );

        }


        if (!data.answer) {

            throw new Error(
                "The AI did not return an answer."
            );

        }


        return data.answer;

    }


    /* =====================================================
       SEND QUESTION
       ===================================================== */

    async function sendQuestion() {

        const question = input.value.trim();


        if (!question) {

            return;

        }


        /* ---------------------------------------------
           SHOW USER MESSAGE
        --------------------------------------------- */

        addMessage(
            question,
            "user"
        );


        input.value = "";


        /* ---------------------------------------------
           DISABLE INPUT WHILE AI IS RESPONDING
        --------------------------------------------- */

        input.disabled = true;

        button.disabled = true;


        /* ---------------------------------------------
           SHOW LOADING
        --------------------------------------------- */

        addLoadingMessage();


        try {

            const answer = await askAI(question);


            removeLoadingMessage();


            addMessage(
                answer,
                "assistant"
            );


        } catch (error) {

            removeLoadingMessage();


            console.error(
                "CG-5 AI ERROR:",
                error
            );


            addMessage(

                "Offine pako ngayon animal ka " +
                "Ugma nalang ta, ANIMAL. ",

                "assistant"

            );

        }


        /* ---------------------------------------------
           ENABLE INPUT AGAIN
        --------------------------------------------- */

        input.disabled = false;

        button.disabled = false;

        input.focus();

    }


    /* =====================================================
       SEND BUTTON
       ===================================================== */

    button.addEventListener(
        "click",
        sendQuestion
    );


    /* =====================================================
       ENTER KEY
       ===================================================== */

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendQuestion();

            }

        }
    );


});