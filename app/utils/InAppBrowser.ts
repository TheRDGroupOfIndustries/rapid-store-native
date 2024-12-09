import * as WebBrowser from "expo-web-browser";

export const openInAppBrowser = async (url: string) => {
  try { 
    await WebBrowser.openBrowserAsync(url, {
        toolbarColor: "#00570a",
        secondaryToolbarColor: "#ffffff",
        enableBarCollapsing: true,
    });

  } catch (error) {
    console.error("Failed to open link:", error);
  }
};
