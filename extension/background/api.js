/**
 * Console Whisperer - API Communication
 *
 * This module handles communication with the backend API.
 */

import { getFromStorage } from "../utils/storage.js";

// Send error data to the backend
export async function sendToBackend(errorData) {
    try {
        // Get settings from storage
        const settings = (await getFromStorage("settings")) || {};
        const backendUrl = settings.backendUrl || "http://localhost:3000";

        console.log("Console Whisperer: Sending error to backend", {
            backendUrl,
            errorData,
        });

        // Send the request
        const response = await fetch(`${backendUrl}/api/errors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ errorData }),
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(
                `Backend request failed with status ${response.status}`
            );
        }

        // Parse the response
        const data = await response.json();

        console.log("Console Whisperer: Received response from backend", data);

        return data;
    } catch (error) {
        console.error("Error sending to backend:", error);

        // Return a fallback response
        const fallbackResponse = {
            originalError: errorData,
            explanation:
                "We couldn't connect to our AI service to explain this error. Please check your internet connection and try again.",
            suggestedFix: null,
            links: [],
            offline: true,
        };

        console.log(
            "Console Whisperer: Using fallback response",
            fallbackResponse
        );

        return fallbackResponse;
    }
}

// Get links related to an error
export async function getLinks(errorMessage) {
    try {
        // Get settings from storage
        const settings = (await getFromStorage("settings")) || {};
        const backendUrl =
            settings.backendUrl || "https://api.consolewhisperer.com";

        // Send the request
        const response = await fetch(
            `${backendUrl}/api/links?query=${encodeURIComponent(errorMessage)}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(
                `Backend request failed with status ${response.status}`
            );
        }

        // Parse the response
        const data = await response.json();

        return data.links || [];
    } catch (error) {
        console.error("Error getting links:", error);
        return [];
    }
}
