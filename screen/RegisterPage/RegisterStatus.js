import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
// fonst
import { useFonts, Prompt_500Medium } from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterStatus = (props) => {
  const { access_token, isMember } = props.route.params || "";
  const [loading, setLoading] = React.useState(true);

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
  });

  useEffect(async () => {
    if (access_token !== "" && isMember) {
      await AsyncStorage.setItem("access_token", access_token);
    }
  }, [props.route.params]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {loading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <ActivityIndicator size="large" color="#AB4740" />
        </View>
      ) : (
        <View style={styles.container2}>
          <Ionicons name="md-checkmark-circle" size={182} color="green" />
          <View style={styles.inputContainer}>
            <Text style={styles.textSuccess}>
              ลงทะเบียน{"\n"}
              เสร็จแล้ว
            </Text>
          </View>

          <View style={styles.textDesc}>
            <Text style={styles.textDescSub}>
              Maru Laundry มอบประสบการณ์ซักที่สะดวก ยิ่งกว่าความสะดวก
              สบายมากกว่าความสบาย
            </Text>
          </View>
        </View>
      )}

      {/* <View style={styles.container}> */}
      <TouchableOpacity
        style={styles.buttonGPlusStyle}
        onPress={() => props.navigation.navigate("Home")}
      >
        <Text style={styles.buttonTextStyle}>เริ่มใช้งาน</Text>
      </TouchableOpacity>
      {/* </View> */}
    </SafeAreaView>
  );
};

// Later on in your styles..
const styles = StyleSheet.create({
  textDescSub: {
    padding: "10%",
    textAlign: "center",
    width: 300,
    fontFamily: "Prompt_500Medium",
  },
  textSuccess: {
    color: "#76B073",
    fontSize: 32,
    // fontWeight: 800,
    textAlign: "center",
    fontFamily: "Prompt_500Medium",
  },

  container: {
    flex: 1,
    margin: 10,
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "5%",
  },
  container2: {
    flex: 7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "53%",
    height: "33%",
    marginBottom: "6%",
  },
  buttonGPlusStyle: {
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#393A3A",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 50,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonFacebookStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#393A3A",
    borderWidth: 0.5,
    textAlign: "center",
    borderColor: "#393A3A",
    height: 50,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Prompt_500Medium",
  },
  buttonIconSeparatorStyle: {
    backgroundColor: "#fff",
    width: 1,
    height: 40,
    fontFamily: "Prompt_500Medium",
  },
  input: {
    backgroundColor: "#fff",
    boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
    borderRadius: 10,
    width: "80%",
    height: "100%",
    padding: "3%",
  },
});

export default RegisterStatus;
