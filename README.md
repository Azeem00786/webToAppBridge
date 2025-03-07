import rnBridge from "your-npm-package-name";

// Get current location
rnBridge.sendMessage("GetNativeCurrentLocation").then((location) => {
console.log("Device Location:", location);
});

// Get app version
rnBridge.sendMessage("getAppVersion").then((version) => {
console.log("App Version:", version);
});

// Get user info
rnBridge.sendMessage("getUserInfo").then((user) => {
console.log("User Info:", user);
});
