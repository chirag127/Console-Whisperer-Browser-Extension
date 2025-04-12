/**
 * Console Whisperer - Background Script
 *
 * This is the main background script for the Console Whisperer extension.
 * It handles communication between content scripts and the backend API.
 */

import { processError } from "./errorHandler.js";
import { sendToBackend } from "./api.js";
import { getFromStorage, saveToStorage } from "../utils/storage.js";

// Initialize the extension
async function initialize() {
    console.log("Console Whisperer: Background script initialized");

    // Set default settings if not already set
    const settings = (await getFromStorage("settings")) || {};
    if (!settings.backendUrl) {
        // Use localhost for development
        settings.backendUrl = "http://localhost:3000";
        await saveToStorage("settings", settings);
    }

    console.log("Using backend URL:", settings.backendUrl);
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(
        "Console Whisperer: Background script received message",
        message
    );

    if (message.action === "processError") {
        console.log(
            "Console Whisperer: Processing error message from",
            sender.tab.url
        );

        handleErrorMessage(message, sender)
            .then((response) => {
                console.log(
                    "Console Whisperer: Sending response to content script",
                    response
                );
                sendResponse(response);
            })
            .catch((error) => {
                console.error("Error handling message:", error);
                sendResponse({ error: error.message });
            });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});

// Handle error messages from content scripts
async function handleErrorMessage(message, sender) {
    try {
        // Process the error
        const processedError = await processError(message.errorData);

        // Send to backend
        const response = await sendToBackend(processedError);

        // Store the response
        await saveToStorage(`error_${Date.now()}`, {
            error: processedError,
            response,
            timestamp: Date.now(),
        });

        // Send the response back to the content script
        chrome.tabs.sendMessage(sender.tab.id, {
            action: "errorResponse",
            data: response,
        });

        return { success: true };
    } catch (error) {
        console.error("Error processing error:", error);
        return { error: error.message };
    }
}

// Initialize the extension
initialize();
