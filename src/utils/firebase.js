// firebase.js
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";

export { messaging, getToken, onMessage };

const requestNotificationPermission = async () => {
  const isAlreadyFirebaseSaved = localStorage.getItem("fireBaseToken");
  if (isAlreadyFirebaseSaved) {
    return isAlreadyFirebaseSaved;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BDXtW1Tu4PSTYDsLptOuEm027F8qQ7KAOQL7zxL7oEKMiWUM2PlI565lzGIKjG3veRGd4YHQI96MKn8ah6op3S8",
      });

      if (token) {
        localStorage.setItem("fireBaseToken", token);
        console.log("Device token:", token);
        return token;
      } else {
        console.error("No registration token available.");
      }
    } else {
      console.error("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error while requesting notification permission:", error);
  }
};

export default requestNotificationPermission;
