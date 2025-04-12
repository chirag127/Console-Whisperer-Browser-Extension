/**
 * Console Whisperer - Error Interceptor Tests
 * 
 * This file contains tests for the error interceptor.
 * 
 * Note: These tests are designed to be run in a browser environment.
 * You can use a tool like Jest with jsdom or Karma to run them.
 */

describe('Error Interceptor', () => {
  // Mock chrome.runtime.sendMessage
  const originalSendMessage = chrome.runtime.sendMessage;
  let sendMessageMock;

  beforeEach(() => {
    // Create a mock function
    sendMessageMock = jest.fn();
    chrome.runtime.sendMessage = sendMessageMock;

    // Reset the window.onerror and console.error
    window.onerror = null;
    console.error = console.error;
  });

  afterEach(() => {
    // Restore the original function
    chrome.runtime.sendMessage = originalSendMessage;
  });

  describe('interceptWindowOnError', () => {
    it('should intercept window.onerror and send a message', () => {
      // Import the module
      const { initErrorInterceptor } = require('../content/errorInterceptor');

      // Initialize the interceptor
      initErrorInterceptor();

      // Trigger an error
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error message',
        filename: 'test.js',
        lineno: 10,
        colno: 20,
        error: new Error('Test error')
      });
      window.dispatchEvent(errorEvent);

      // Check that sendMessage was called with the correct arguments
      expect(sendMessageMock).toHaveBeenCalledTimes(1);
      expect(sendMessageMock.mock.calls[0][0].action).toBe('processError');
      expect(sendMessageMock.mock.calls[0][0].errorData.type).toBe('window.onerror');
      expect(sendMessageMock.mock.calls[0][0].errorData.message).toBe('Test error message');
    });
  });

  describe('interceptConsoleError', () => {
    it('should intercept console.error and send a message', () => {
      // Import the module
      const { initErrorInterceptor } = require('../content/errorInterceptor');

      // Initialize the interceptor
      initErrorInterceptor();

      // Trigger a console.error
      console.error('Test console error');

      // Check that sendMessage was called with the correct arguments
      expect(sendMessageMock).toHaveBeenCalledTimes(1);
      expect(sendMessageMock.mock.calls[0][0].action).toBe('processError');
      expect(sendMessageMock.mock.calls[0][0].errorData.type).toBe('console.error');
      expect(sendMessageMock.mock.calls[0][0].errorData.message).toBe('Test console error');
    });
  });

  describe('interceptUnhandledRejections', () => {
    it('should intercept unhandled rejections and send a message', () => {
      // Import the module
      const { initErrorInterceptor } = require('../content/errorInterceptor');

      // Initialize the interceptor
      initErrorInterceptor();

      // Trigger an unhandled rejection
      const promise = Promise.reject(new Error('Test rejection'));
      const event = new PromiseRejectionEvent('unhandledrejection', {
        promise,
        reason: new Error('Test rejection')
      });
      window.dispatchEvent(event);

      // Check that sendMessage was called with the correct arguments
      expect(sendMessageMock).toHaveBeenCalledTimes(1);
      expect(sendMessageMock.mock.calls[0][0].action).toBe('processError');
      expect(sendMessageMock.mock.calls[0][0].errorData.type).toBe('unhandledrejection');
      expect(sendMessageMock.mock.calls[0][0].errorData.message).toBe('Test rejection');
    });
  });
});
