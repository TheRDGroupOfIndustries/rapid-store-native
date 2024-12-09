

import { Text, View, BackHandler, Image, SafeAreaView, Pressable, StyleSheet, Linking  } from "react-native";
import WebView from "react-native-webview";
import * as Network from "expo-network";
import { useEffect, useRef, useState } from "react";
import registerNNPushToken from 'native-notify';

import { openInAppBrowser } from "@/app/utils/InAppBrowser";

export default function Index() {
  registerNNPushToken(25263, 'ID7qHXHFa3dZJEtRIvErJJ');

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [splash, setSplash] = useState<boolean>(true);
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const checkNetwork = async () => {
    const networkStatus = await Network.getNetworkStateAsync();
    setIsConnected(networkStatus.isConnected ?? false);
  };


  useEffect(() => {
    checkNetwork();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
    const handleURL = (event: { url: string }) => {
      openInAppBrowser(event.url);
    };
    const listner = Linking.addListener("url", handleURL);
    return () => {
      listner.remove();
    };
  }, []);


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: splash ? "#228B08" : "white",
      }}
    >
      {splash ? (
        <View style={{ flex: 1 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
        </View>
      ) : isConnected ? (
        <WebView
          ref={webViewRef}
          source={{ uri: "https://www.therapidstore.online" }}
          onNavigationStateChange={(navState: any) => setCanGoBack(navState.canGoBack)}
        />
      ) : (
        <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          flexDirection: "column",
        }}
      >
       <Image source={require("@/assets/images/no_internet.png")} style={{width: '100%', height: "40%", objectFit: 'contain'}}/>
       <Pressable style={styles.button} onPress={() => checkNetwork()}>
         <Text style={styles.text}>Try Again</Text>
       </Pressable> 
      </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: 'green',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});


