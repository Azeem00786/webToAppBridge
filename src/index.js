class ReactNativeBridge {
  constructor() {
    this.responseCallbacks = {};
    this.messageId = 0;

    // Listen for messages from React Native
    window.addEventListener("message", (event) => {
      const { messageId, data } = event.data || {};
      if (messageId && this.responseCallbacks[messageId]) {
        this.responseCallbacks[messageId](data);
        delete this.responseCallbacks[messageId];
      }
    });
  }

  sendMessage(postMessageType, data = {}) {
    return new Promise((resolve) => {
      const messageId = ++this.messageId;
      this.responseCallbacks[messageId] = resolve;

      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ messageId, postMessageType, data })
      );
    });
  }
}

const rnBridge = new ReactNativeBridge();
export default rnBridge;
