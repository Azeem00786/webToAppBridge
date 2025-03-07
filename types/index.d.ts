declare module 'web-to-rn-bridge' {
    interface WebToRNBridgeOptions {
      timeout?: number;
    }
  
    interface LocationData {
      latitude: number;
      longitude: number;
    }
  
    class WebToRNBridge {
      constructor(options?: WebToRNBridgeOptions);
      getNativeLocation(): Promise<LocationData>;
      getFcmToken(): Promise<string>;
      isInReactNative(): boolean;
    }
  
    export default WebToRNBridge;
  }