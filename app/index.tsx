

import { Text, View, BackHandler, Image, TouchableOpacity, SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import * as Network from "expo-network";
import { useEffect, useRef, useState } from "react";
import registerNNPushToken from 'native-notify';

export default function Index() {
  registerNNPushToken(25263, 'ID7qHXHFa3dZJEtRIvErJJ');

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [splash, setSplash] = useState<boolean>(true);
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      const networkStatus = await Network.getNetworkStateAsync();
      setIsConnected(networkStatus.isConnected ?? false);
    };

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

    return () => backHandler.remove(); // Cleanup on component unmount
  }, [canGoBack]);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimeout); // Cleanup timeout on component unmount
  }, []);

  const handleTryAgain = () => {
    console.log("reload");
  };

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
          source={{ uri: "https://www.therapidstore.online/" }}
          onNavigationStateChange={(navState: any) => setCanGoBack(navState.canGoBack)}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <View
            style={{
              maxWidth: 400,
              padding: 10,
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/assets/images/noi.png")}
              style={{
                width: 300,
                height: 200,
                resizeMode: "contain",
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#28a745",
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 20,
                borderRadius: 5,
              }}
              onPress={handleTryAgain}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}