import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../../components/common/colors";
import { AntDesign } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
// fonst
import { useFonts, Prompt_500Medium } from "@expo-google-fonts/prompt";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const FormChangeNumber = (props) => {
  const [currentNumber, onChangeCurrentNumber] = React.useState("0XX-XXX-XXXX");
  const [newNumber, onChangeNewNumber] = React.useState("");
  const [profile, setProfile] = useState({});
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
  });

  useEffect(() => {
    initialData();
  }, []);

  async function initialData() {
    setLoading(true);
    const accessToken = await AsyncStorage.getItem("access_token");
    fetch(`https://api.marulaundry-kangyong.com/v2/user/profile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setTimeout(() => {
          setLoading(false);
          setProfile(responseJson?.result);
          onChangeCurrentNumber(responseJson?.result?.phone_number || "");
        }, 1000);
      })
      .catch((error) => console.log(error));
  }

  const handleChange = (event) => {
    onChangeNewNumber(event);
    if (newNumber.length === 9) {
      setDisable(false);
    }
  };

  const handleRequestOTP = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    setLoading(true);
    if (newNumber === currentNumber) {
      Alert.alert("กรุณาใส่เบอร์โทรใหม่.");
      setLoading(false);

      return;
    }

    if (newNumber.length < 10) {
      setLoading(false);
      Alert.alert("ใส่เบอร์โทรศัพท์ไม่ถุกต้อง กรุณาลองใหม่อีกครั้ง.");
      return;
    }

    const formData = new FormData();
    // mock data
    formData.append("new_phone_number", newNumber);
    fetch(`https://api.marulaundry-kangyong.com/v2/user/otp/request`, {
      body: formData,
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          if (responseJson?.status === "success") {
            setLoading(false);
            props.navigation.navigate("ChangePhoneComfirm", {
              phone: newNumber,
              token: responseJson.token,
            });
            return;
          }

          // valid code
          if (responseJson?.detail?.message) {
            Alert.alert(responseJson?.detail?.message);
            setLoading(false);
            return;
          }

          // valid code
          if (responseJson?.detail?.errors[0]) {
            setLoading(false);
            Alert.alert(responseJson?.detail?.errors[0]?.message);
            return;
          }
        }
      })
      .catch((error) => console.log(error));
  };

  console.log(newNumber.length);
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
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.formLabel}>หมายเลขโทรศัพท์ปัจจุบัน</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <AntDesign name="mobile1" size={24} color={COLORS.body} />
              </View>
              <TextInput
                style={[styles.formControl, styles.formControlIcon]}
                // onChangeText={onChangeCurrentNumber}
                value={currentNumber}
                keyboardType={Platform.OS === "ios" ? "phone-pad" : "phone-pad"}
                maxLength={10}
              />
            </View>
            <Text style={styles.formLabel}>หมายเลขโทรศัพท์ใหม่</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <AntDesign name="mobile1" size={24} color={COLORS.body} />
              </View>
              <TextInput
                style={[styles.formControl, styles.formControlIcon]}
                onChangeText={handleChange}
                value={newNumber}
                keyboardType={Platform.OS === "ios" ? "phone-pad" : "phone-pad"}
                placeholder="0XX-XXX-XXXX"
                maxLength={10}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.fixedBottom}>
          <View style={styles.container}>
            <TouchableHighlight
              style={
                newNumber.length === 10
                  ? styles.borderRadius
                  : styles.borderRadiusDis
              }
              underlayColor={COLORS.white}
              onPress={handleRequestOTP}
              disabled={newNumber.length < 10 ? true : false}
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
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
    width: "33.33%",
  },
  py3: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 8,
    fontFamily: "Prompt_500Medium",
  },
  inputIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroupIcon: {
    width: 24,
    height: 24,
  },
  formControl: {
    fontSize: 16,
    fontWeight: "600",
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  inputGroup: {
    position: "relative",
    marginBottom: 16,
  },
  formControlIcon: {
    paddingLeft: 48,
  },
  buttonSave: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS.body,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
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
  borderRadiusDis: {
    opacity: 0.8,
  },
});

export default FormChangeNumber;
