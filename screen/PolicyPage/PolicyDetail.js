import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Platform,
} from "react-native";
import React, { useRef } from "react";
import AppLoading from "expo-app-loading";
// fonst
import { useFonts, Prompt_500Medium } from "@expo-google-fonts/prompt";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const PolicyDetail = (props) => {
  const [disabled, setDisable] = React.useState(true);
  const scrollViewRef = useRef(null);
  const { phone, token, pin } = props.route?.params || "";
  const [loading, setLoading] = React.useState(true);
  const [textContent, setTextContent] = React.useState("");

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
  });

  React.useEffect(() => {
    initialData();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const initialData = async () => {
    console.log("initialData");
    try {
      await fetch(`https://api.marulaundry-kangyong.com/v2/admin/s/pdpa`)
      .then((response) => response.json())
      .then((responseJson) => {
        setTextContent(responseJson.pdpa_content)
      })
      .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    } 
  }; 

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setDisable(false);
          }
        }}
        scrollEventThrottle={400}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#AB4740" />
          </View>
        ) : (
          <View>
            <Text style={styles.text}>
             {textContent}
            </Text>
          </View>
        )}
      </ScrollView>

      <View>
        <TouchableOpacity
          style={
            disabled ? styles.buttonGPlusStyleDis : styles.buttonGPlusStyle
          }
          disabled={disabled}
          onPress={() =>
            props.navigation.navigate("ลงทะเบียน", {
              token: token,
              phone: phone,
              pin: pin,
            })
          }
        >
          <Text style={styles.buttonTextStyle}>ยืนยัน</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Later on in your styles..
const styles = StyleSheet.create({
  container2: {
    backgroundColor: "#0fff00",
  },
  scrollView: {
    backgroundColor: "#fff",
    padding: 30,
    marginTop: Platform.OS === "ios" ? 30 : 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    backgroundColor: "transparent",
    fontFamily: "Prompt_500Medium",
  },
  img: {
    width: 90,
    height: 100,
  },
  text: {
    fontFamily: "Prompt_500Medium",
    fontSize: 16,
  },
  buttonGPlusStyleDis: {
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#393A3A",
    height: 40,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8
  },
  buttonGPlusStyle: {
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#393A3A",
    height: 40,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextStyle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Prompt_500Medium",
  },
});

export default PolicyDetail;
