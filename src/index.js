/**
 * WebToRNBridge SDK
 * A lightweight JavaScript SDK for web applications to communicate with React Native
 * through an established WebView postMessage bridge.
 *
 * @version 1.0.0
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.WebToRNBridge = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Store for pending promises
  const _callbacks = {};
  // Check if initialization has been done
  let _initialized = false;
  // Default timeout value in milliseconds
  const DEFAULT_TIMEOUT = 10000;

  /**
   * WebToRNBridge SDK
   */
  class WebToRNBridge {
    /**
     * Create a new instance of the SDK
     * @param {Object} options - Configuration options
     * @param {number} [options.timeout=10000] - Timeout for requests in milliseconds
     */
    constructor(options = {}) {
      this.options = {
        timeout: DEFAULT_TIMEOUT,
        ...options,
      };

      // Initialize the message listener if not already done
      if (!_initialized) {
        this._initMessageListener();
        _initialized = true;
      }
    }

    /**
     * Initialize the message listener for responses from React Native
     * @private
     */
    _initMessageListener() {
      window.addEventListener("message", (event) => {
        let response;

        try {
          // Parse the response if it's a string
          response =
            typeof event.data === "string"
              ? JSON.parse(event.data)
              : event.data;

          // Check if this is a response with an ID that we're tracking
          if (response && response.id && _callbacks[response.id]) {
            const callback = _callbacks[response.id];

            // Clear the timeout
            if (callback.timeoutId) {
              clearTimeout(callback.timeoutId);
            }

            // Resolve or reject the promise
            if (response.error) {
              callback.reject(new Error(response.error));
            } else {
              callback.resolve(response.data);
            }

            // Remove the callback from our tracking
            delete _callbacks[response.id];
          }
        } catch (err) {
          // Ignore messages that aren't JSON or don't match our format
          console.debug(
            "WebToRNBridge: Received non-JSON message or unrecognized format"
          );
        }
      });
    }

    /**
     * Send a message to the React Native app
     * @private
     * @param {string} action - The action to perform
     * @param {Object} data - Additional data to send
     * @returns {Promise<any>} - Promise resolving with the response
     */
    _sendMessage(action, data = {}) {
      return new Promise((resolve, reject) => {
        // Generate a unique ID for this request
        const messageId =
          Date.now().toString(36) + Math.random().toString(36).substr(2);

        // Create the message
        const message = {
          id: messageId,
          action,
          data,
        };

        // Set up timeout
        const timeoutId = setTimeout(() => {
          if (_callbacks[messageId]) {
            reject(
              new Error(
                `WebToRNBridge: Request timed out after ${this.options.timeout}ms`
              )
            );
            delete _callbacks[messageId];
          }
        }, this.options.timeout);

        // Store the promise callbacks
        _callbacks[messageId] = {
          resolve,
          reject,
          timeoutId,
        };

        // Send the message to React Native
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        } else {
          // Try regular postMessage if ReactNativeWebView is not available
          window.parent.postMessage(JSON.stringify(message), "*");
        }
      });
    }

    /**
     * Get the device's current location (latitude and longitude)
     * @returns {Promise<{latitude: number, longitude: number}>} - Promise resolving with location data
     */
    getNativeLocation() {
      return this._sendMessage("getNativeLocation");
    }

    /**
     * Get the Firebase Cloud Messaging (FCM) token for the device
     * @returns {Promise<string>} - Promise resolving with the FCM token
     */
    getFcmToken() {
      return this._sendMessage("getFcmToken");
    }

    /**
     * Check if the SDK is running in a React Native WebView environment
     * @returns {boolean} - True if ReactNativeWebView is detected
     */
    isInReactNative() {
      return typeof window !== "undefined" && !!window.ReactNativeWebView;
    }
  }

  // Return the class as the module export
  return WebToRNBridge;
});
