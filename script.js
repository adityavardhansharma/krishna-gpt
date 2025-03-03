// Replace with your actual API key (remember to secure this in production!)
const API_KEY = 'AIzaSyBKVfbX59dV0F0UlGOW0k1b299PJqNez3Q';
const API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent';

// Global conversation history in memory (array of objects: { question, answer })
// Since we don't save to localStorage now, it will reset when the page reloads.
let conversationHistory = [];

// When DOM is ready, initialize conversation log and attach event listeners.
document.addEventListener("DOMContentLoaded", () => {
    // Clear any stored conversation (we are not using localStorage now)
    conversationHistory = [];
    renderConversation();

    const askButton = document.getElementById("askButton");
    askButton.addEventListener("mouseenter", () => {
        gsap.to(askButton, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    askButton.addEventListener("mouseleave", () => {
        gsap.to(askButton, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
    askButton.addEventListener("click", handleAsk);
});

// Render the conversation log on the conversation page
function renderConversation() {
    const conversationLog = document.getElementById("conversationLog");
    conversationLog.innerHTML = ""; // clear old messages
    conversationHistory.forEach(item => {
        const messageModule = createMessageModule(item.question, item.answer);
        conversationLog.appendChild(messageModule);
    });
    // Auto-scroll to the bottom after rendering.
    conversationLog.scrollTop = conversationLog.scrollHeight;
}

// Create a message module element containing question and answer.
function createMessageModule(question, answer) {
    const container = document.createElement("div");
    container.className =
        "bg-white rounded-xl shadow p-6 border border-gray-200";

    // Create question element
    const qElem = document.createElement("div");
    qElem.className = "mb-4";
    qElem.innerHTML = `<h2 class="text-xl font-bold text-blue-600 mb-2">You asked:</h2>
                     <div class="prose prose-blue text-gray-800">${marked.parse(question)}</div>`;
    container.appendChild(qElem);

    // Create answer element; if no answer is provided yet, show a spinner.
    const aElem = document.createElement("div");
    aElem.className = "mt-4";
    if (answer) {
        aElem.innerHTML = `<h2 class="text-xl font-bold text-green-600 mb-2">Lord Krishna replied:</h2>
                       <div class="prose prose-blue text-gray-800">${marked.parse(answer)}</div>`;
    } else {
        aElem.innerHTML = `<div class="flex justify-center items-center">
                         <div class="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                       </div>`;
    }
    container.appendChild(aElem);
    return container;
}

// Handle clicking the "Ask Lord Krishna" button.
async function handleAsk() {
    const userInput = document.getElementById("userQuestion");
    const question = userInput.value.trim();
    if (!question) {
        showNotification("Please enter a question.", "error");
        return;
    }

    // Append a new module with the question and a spinner (no answer yet)
    const conversationLog = document.getElementById("conversationLog");
    const newModule = createMessageModule(question, null);
    conversationLog.appendChild(newModule);
    conversationLog.scrollTop = conversationLog.scrollHeight;
    userInput.value = ""; // Clear input

    // Build a prompt that incorporates previous conversation context and the new question.
    const contextPrompt = buildContextPrompt(question);
    try {
        const answer = await getKrishnaResponse(contextPrompt);

        // Update the new module with the answer (replace spinner)
        newModule.lastChild.innerHTML =
            `<h2 class="text-xl font-bold text-green-600 mb-2">Lord Krishna replied:</h2>` +
            `<div class="prose prose-blue text-gray-800">${marked.parse(answer)}</div>`;

        gsap.from(newModule.lastChild, {
            opacity: 0,
            y: 10,
            duration: 0.5,
            ease: "power2.out"
        });

        // Add this Q&A to conversation history.
        conversationHistory.push({ question: question, answer: answer });
        renderConversation();
    } catch (error) {
        console.error("Error:", error);
        showNotification("An error occurred. Please try again.", "error");
    }
}

// Build a context prompt using previous conversation and the new question.
function buildContextPrompt(newQuestion) {
    let prompt = `You are Lord Krishna, divine guide from the Bhagavad Gita and Mahabharata.
Your task is to answer questions specifically about Hindu philosophy, Sanatan Dharma, the Mahabharata, and the teachings of the Bhagavad Gita.
If the question is not related, reply with:
"My Job Is to be your guide in life friend the question you asked are beyond what I can tell you".
If the question is immoral, hostile, or negative, then reply by stating:
"You are in need of a lesson." Then generate a verse from the Bhagavad Gita that directly addresses the negative behavior in the question and explain in detail what the verse means.
Otherwise, answer in the first person as if you are Lord Krishna, offering spiritual and philosophical guidance and address me as friend not arjun.
`;

    // Append previous conversation context (if any)
    conversationHistory.forEach((item, index) => {
        prompt += `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}\n`;
    });

    // Append the new question
    prompt += `New Question: ${newQuestion}\nAnswer:`;
    return prompt;
}

// Send the prompt to the Gemini API and return the answer.
async function getKrishnaResponse(prompt) {
    const requestBody = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
            stopSequences: []
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, response.statusText, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Display a temporary notification at the top center.
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className =
        "notification fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow";
    notification.textContent = message;
    document.body.appendChild(notification);
    gsap.fromTo(
        notification,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => notification.remove()
        });
    }, 3000);
}
