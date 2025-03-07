# Get Current Location

# Retrieve the device's current location.

import rnBridge from "your-npm-package-name";

rnBridge.sendMessage("GetNativeCurrentLocation").then((location) => {
console.log("Device Location:", location);
});

# Get App Version

# Fetch the app's current version.

rnBridge.sendMessage("getAppVersion").then((version) => {
console.log("App Version:", version);
});

# Get User Info

# Retrieve user information.

rnBridge.sendMessage("getUserInfo").then((user) => {
console.log("User Info:", user);
});
