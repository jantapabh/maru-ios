import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { COLORS } from "../../../components/common/colors";
import { Feather } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import OTPTextView from "react-native-otp-textinput";

// fonst
import { useFonts, Prompt_500Medium } from "@expo-google-fonts/prompt";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";

const FormComfirm = (props) => {
  const [otopNumber, setOtpNumber] = React.useState("");
  const { phone, token } = props.route.params || "";
  const id = React.useRef(null);
  const [disableBtn, setDisableBtn] = React.useState(true);
  const [timer, setTimer] = React.useState(60);
  const [newToken, setNewToken] = React.useState(token);
  const [loading, setLoading] = useState(false);

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
  });

  const handleChangePhoneNumber = async () => {
    setLoading(true);
    const accessToken = await AsyncStorage.getItem("access_token");
    const formData = new FormData();

    // mock data
    formData.append("token", newToken);
    formData.append("pin", otopNumber);
    formData.append("new_phone_number", phone);

    fetch(`https://api.marulaundry-kangyong.com/v2/user/change-phone-number`, {
      body: formData,
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson?.message) {
          setLoading(false);
          setDisableBtn(true)
          Alert.alert(responseJson.message);
          setTimeout(() => {
            props.navigation.navigate("โปรไฟล์");
          }, 200);
        }

        if (responseJson.errors) {
          setLoading(false);
          setDisableBtn(true)
          Alert.alert(responseJson?.errors[0].message);
          return;
        }

        if (responseJson.detail.message) {
          setLoading(false);
          setDisableBtn(true)
          Alert.alert(responseJson?.detail.message);
          return;
        }
      })
      .catch((error) => console.log(error));
  };

  const clear = () => {
    window.clearInterval(id.current);
  };

  React.useEffect(() => {
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  }, [timer]);

  React.useEffect(() => {
    if (timer === 0) {
      clear();
    }
  }, [timer]);

  const handleChageUpdate = () => {
    handleChangePhoneNumber();
  };

  const requestOTP = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("new_phone_number", phone);
    fetch(`https://api.marulaundry-kangyong.com/v2/user/otp/request`, {
      body: formData,
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson["status"]?.includes("success")) {
          setNewToken(responseJson?.token);
          setTimer(60);
        } else {
          if (responseJson?.detail.message) {
            let textErr = responseJson?.detail.message;
            console.log(textErr);
            Alert.alert(textErr);
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const updateOtpText = (e) => {
    setOtpNumber(e);
    if (otopNumber.length < 5) {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={styles.holder}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View style={styles.container}>
            <View style={styles.row}>
              <OTPTextView
                handleTextChange={updateOtpText}
                containerStyle={styles.textInputContainer}
                tintColor={'#000000'}
                textInputStyle={styles.roundedTextInput}
                inputCount={6}
                keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
              />
            </View>

            <View style={styles.py5}>
              <Text style={styles.infoText}>
                <Feather name="mail" size={20} color={COLORS.body} /> กรุณากรอก
                OTP ที่ส่งไป
              </Text>
              <Text style={styles.infoText}>หมายเลข {phone}</Text>
            </View>

            {timer !== 0 && (
              <TouchableOpacity disabled={true} style={styles.container4}>
                <Text style={styles.textOtp}>ส่งอีกครั้ง ({timer})</Text>
              </TouchableOpacity>
            )}

            {timer === 0 && (
              <TouchableOpacity onPress={requestOTP}>
                <View style={styles.container4}>
                  <Text style={styles.textOtp}>ส่งอีกครั้ง</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        <View style={styles.fixedBottom}>
          <View style={styles.container}>
            <TouchableHighlight
              style={disableBtn ? styles.borderRadiusDis: styles.borderRadius}
              underlayColor="rgba(0,0,0,0.2)"
              onPress={handleChageUpdate}
              disabled={disableBtn}
            >
              <View style={styles.buttonSave}>
                {loading ? (
                  <ActivityIndicator size="large" color="#AB4740" />
                ) : (
                  <Text style={styles.textButton}>บันทึก</Text>
                )}
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  holder: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    height: "100%",
  },
  container: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  formOtp: {
    display: "flex",
    flexDirection: "row",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: -4,
    marginRight: -4,
  },
  col: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    paddingLeft: 4,
    paddingRight: 4,
    maxWidth: "100%",
    width: "auto",
  },
  py5: {
    paddingTop: 48,
    paddingBottom: 48,
  },
  formControl: {
    fontSize: 16,
    height: 48,
    width: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  buttonSave: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS.body,
    borderRadius: 8,
  },
  textButton: {
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Prompt_500Medium",
  },
  fixedBottom: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  borderRadius: {
    borderRadius: 8,
  },
  textCenter: {
    textAlign: "center",
    fontFamily: "Prompt_500Medium",
  },
  infoText: {
    fontSize: 16,
    color: COLORS.body,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "Prompt_500Medium",
  },
  textOtp: {
    // color: "#fff",
    fontSize: 16,
    marginLeft: 6,
    fontFamily: "Prompt_500Medium",
    textAlign: "center",
  },
  textInputContainer: {
    marginBottom: 20,
    marginTop: 30,
  },
  container4: {
    display: "flex",
    justifyContent: "center",
  },
  roundedTextInput: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: "#969696",
    borderWidth: 1,
    borderBottomWidth: 1,
  },
  borderRadiusDis: {
    opacity: 0.8,
  }
});

export default FormComfirm;
