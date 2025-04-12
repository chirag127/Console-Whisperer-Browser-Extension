/**
 * Console Whisperer - Error Interceptor
 *
 * This module intercepts JavaScript errors on the page.
 */

// Initialize error interception
export function initErrorInterceptor() {
    // Intercept window.onerror
    interceptWindowOnError();

    // Intercept console.error
    interceptConsoleError();

    // Intercept unhandled rejections
    interceptUnhandledRejections();
}

// Intercept window.onerror
function interceptWindowOnError() {
    // Store the original onerror handler
    const originalOnError = window.onerror;

    // Override window.onerror
    window.onerror = function (message, source, lineno, colno, error) {
        // Process the error
        processError({
            type: "window.onerror",
            message,
            source,
            lineno,
            colno,
            stack: error?.stack,
            timestamp: Date.now(),
        });

        // Call the original handler if it exists
        if (typeof originalOnError === "function") {
            return originalOnError.apply(this, arguments);
        }

        // Return true to prevent the default browser error handling
        return true;
    };
}

// Intercept console.error
function interceptConsoleError() {
    // Store the original console.error
    const originalConsoleError = console.error;

    // Override console.error
    console.error = function () {
        // Get the arguments as an array
        const args = Array.from(arguments);

        // Process the error
        processError({
            type: "console.error",
            arguments: args,
            message: args.map((arg) => String(arg)).join(" "),
            stack: new Error().stack,
            timestamp: Date.now(),
        });

        // Call the original console.error
        return originalConsoleError.apply(this, arguments);
    };
}

// Intercept unhandled rejections
function interceptUnhandledRejections() {
    // Listen for unhandled rejections
    window.addEventListener("unhandledrejection", function (event) {
        // Process the error
        processError({
            type: "unhandledrejection",
            reason: event.reason?.toString(),
            message:
                event.reason?.message ||
                event.reason?.toString() ||
                "Unhandled Promise Rejection",
            stack: event.reason?.stack,
            timestamp: Date.now(),
        });
    });
}

// Process the error
function processError(errorData) {
    // Add page context
    errorData.url = window.location.href;
    errorData.userAgent = navigator.userAgent;

    // Debug log
    console.log("Console Whisperer: Intercepted error", errorData);

    // Send to background script
    chrome.runtime.sendMessage(
        {
            action: "processError",
            errorData,
        },
        (response) => {
            // Debug log
            console.log(
                "Console Whisperer: Background script response",
                response
            );
        }
    );
}
