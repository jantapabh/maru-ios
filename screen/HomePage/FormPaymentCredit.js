import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { COLORS } from "../../components/common/colors";

// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
} from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";
import { ScrollView } from "react-native-gesture-handler";

const FormPaymentCredit = (props) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [isErrors, setIsError] = useState(false);
  const [loading, setLoading] = React.useState(false);

  // state
  const [cardNum, setCardNum] = useState("");
  const [type, setType] = useState("");

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
  });

  const [gender, setGender] = useState([
    { label: "Visa", value: "visa" },
    { label: "Master Card", value: "master_card" },
  ]);

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(false);
    setIsError(false);
    setCardNum(data.cardNumber);
    setType(data.type);
    // too add card
    setTimeout(() => {
      props.navigation.navigate("SelectPaymentCredit", {
        params: data,
      });
    },1000)
  };

  const onError = (errors, e) => {
    setIsError(true);
    return console.log(errors);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <TouchableWithoutFeedback
      style={{ backgroundColor: "#fff" }}
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
        <ScrollView>
          <Text
            style={{
              marginLeft: 10,
              fontFamily: "Prompt_400Regular",
              fontSize: 14,
              color: "#A8A8A8",
              marginTop: Platform.OS === "ios" ? 20: 0
            }}
          >
            ประเภท
          </Text>

          <View style={styles.container3}>
            <Controller
              name="type"
              rules={{ required: true }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputGroup}>
                  <View style={styles.dropdownGender}>
                    <DropDownPicker
                      style={[styles.dropdown, styles.formControl]}
                      open={genderOpen}
                      value={genderValue}
                      items={gender}
                      setOpen={setGenderOpen}
                 
                      closeAfterSelecting={true}
                      dropDownContainerStyle={{
                        borderColor: "#D0D5DD",
                        marginTop: 10,
                        borderRadius: 10,
                        zIndex: 99999,

                      }}
                      disableBorderRadius={false}
                      setValue={setGenderValue}
                      setItems={setGender}
                      zIndex={9999}
                      placeholder="เลือก"
                      placeholderStyle={styles.fplaceholderStyles}
                      onChangeValue={onChange}
                    />
                  </View>
                </View>
              )}
            />
            {errors.type && (
              <Text style={styles.errorTextRow}>*ใส่ข้อมูลประเภท</Text>
            )}
          </View>

          <View style={[styles.container3, styles.test]}>
            <Text
              style={{
                fontFamily: "Prompt_400Regular",
                fontSize: 14,
                color: "#A8A8A8",
                marginBottom: 10,
              }}
            >
              หมายเลขบัตร
            </Text>

            <Controller
              name="cardNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputGroup, styles.test]}>
                  <TextInput
                    style={[styles.formControl, styles.test]}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      const reg = new RegExp("^[0-9]+$");
                      if (
                        reg.test(value) &&
                        !/[!@#$%^&฿*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
                      ) {
                        onChange(value);
                      }
                    }}
                    value={value}
                    placeholder="XXXX XXXX XXXX XXXX"
                    returnKeyType="default"
                    maxLength={16}
                    placeholderTextColor="#C9C9C9"
                    keyboardType={
                      Platform.OS === "ios" ? "numeric" : "number-pad"
                    }
                  />
                </View>
              )}
            />

            {errors.cardNumber && (
              <Text style={styles.errorTextRow}>*ใส่ข้อมูลบัตร</Text>
            )}
          </View>

          <View style={[styles.row]}>
            <View style={[styles.birthDay, styles.front]}>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: "Prompt_400Regular",
                  fontSize: 14,
                  color: "#A8A8A8",
                }}
              >
                วันหมดอายุ
              </Text>

              <Controller
                name="day"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input2]}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      if (
                        value !== "0000" &&
                        /^\d+$/.test(+value) &&
                        !/[!@#$%^&฿*()_+\-=\[\]{};':"\\rrrr,.<>\/?]+/.test(value)
                      ) {
                        onChange(value);
                      }
                    }}
                    value={value}
                    placeholder="XX / XX"
                    keyboardType={
                      Platform.OS === "ios" ? "numeric" : "number-pad"
                    }
                    maxLength={4}
                    placeholderTextColor="#C9C9C9"
                  />
                )}
                rules={{ required: true }}
              />

              {isErrors && (
                <Text style={[styles.errorTextRow, styles.mg3]}>
                  *ใส่ข้อมูลวันให้ถูกต้อง
                </Text>
              )}
            </View>

            <View style={styles.birthDay}>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: "Prompt_400Regular",
                  fontSize: 14,
                  color: "#A8A8A8",
                }}
              >
                CVV
              </Text>
              <Controller
                name="cvv"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input2]}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      if (
                        value !== "000" &&
                        /^\d+$/.test(+value) &&
                        !/[!@#$%^&฿*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
                      ) {
                        onChange(value);
                      }
                    }}
                    value={value}
                    placeholder="XXX"
                    keyboardType={
                      Platform.OS === "ios" ? "numeric" : "number-pad"
                    }
                    maxLength={3}
                    placeholderTextColor="#C9C9C9"
                  />
                )}
                rules={{ required: true }}
              />

              {isErrors && (
                <Text style={[styles.errorTextRow, styles.mg3]}>
                  *ใส่ข้อมูล cvv ให้ถูกต้อง
                </Text>
              )}
            </View>
          </View>

          <View style={styles.container3}>
            <Text
              style={{
                fontFamily: "Prompt_400Regular",
                fontSize: 14,
                color: "#A8A8A8",
                marginBottom: 10,
              }}
            >
              ชื่อบนบัตร
            </Text>
            <Controller
              name="cardName"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <TextInput
                    style={[styles.formControl]}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      if (
                        /^[A-Za-z\s]*$/.test(value) ||
                        (/^[\u0E00-\u0E7F]*$/.test(value) &&
                          !/[!@#$%^&฿*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
                            value
                          ))
                      ) {
                        onChange(value);
                      }
                    }}
                    value={value}
                    placeholder="กรอกชื่อ"
                    returnKeyType="default"
                    placeholderTextColor="#C9C9C9"
                    keyboardType="default"
                  />
                </View>
              )}
            />

            {errors.cardName && (
              <Text style={styles.errorTextRow}>*ใส่ข้อมูลชื่อ</Text>
            )}
          </View>

          {isErrors && (
            <Text style={styles.errorText}>*กรอกข้อมูลให้ครบถ้วน</Text>
          )}
        </ScrollView>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={
              isDirty ? styles.buttonGPlusStyleActive : styles.buttonGPlusStyle
            }
            onPress={handleSubmit(onSubmit, onError)}
          >
            <Text style={styles.buttonTextStyle}>
              {loading ? (
                <ActivityIndicator size="large" color="#AB4740" />
              ) : (
                "เพิ่ม"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

// Later on in your styles..
const styles = StyleSheet.create({
  mg3: {
    marginLeft: 15,
  },
  errorText: {
    color: "#AB4740",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Prompt_500Medium",
    marginBottom: 20,
    marginTop: 20,
    zIndex: -1,
  },
  errorTextRow: {
    color: "#AB4740",
    fontSize: 12,
    textAlign: "left",
    // marginLeft: 15,
    zIndex: -1,
    marginTop: 10,
    fontFamily: "Prompt_500Medium",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    zIndex: -1,
  },
  inputGroup: {
    zIndex: 0,
  },
  formLabel: {
    fontSize: 16,
    color: COLORS.muted,
    margin: 10,
  },
  container3: {
    margin: 10,
    // zIndex: -1
  },
  birthDay: {
    width: "50%",
    zIndex: 0,
  },
  dropdownGender: {
    width: "100%",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
  buttonGPlusStyle: {
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#B1B0B0",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 55,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGPlusStyleActive: {
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#393A3A",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 55,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    flex: 4,
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Prompt_500Medium",
  },
  label: {
    color: "#A8A8A8",
    backgroundColor: "#000",
  },
  button: {
    color: "white",
    height: 40,
    margin: 20,
    backgroundColor: "#B1B0B0",
  },
  container: {
    flex: 1,
    margin: 20,
    display: "flex",
    justifyContent: "start",
    marginBottom: "5%",
    height: "100%",
  },
  container4: {
    flex: 0.1,
    margin: 20,
    display: "flex",
    justifyContent: "end",
    marginBottom: 5,
    height: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#D0D5DD",
    height: 50,
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 4,
    // border: '1px solid #D0D5DD',
    // boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    borderRadius: 10,
    margin: 10,
  },
  formField: {
    width: 130,
    marginEnd: 8,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    fontFamily: "Prompt_500Medium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -1,
    backgroundColor: "#fff",
  },
  input2: {
    backgroundColor: "#fff",
    borderColor: "#D0D5DD",
    height: 48,
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 4,
    borderRadius: 8,
    margin: 10,
  },
  formControl: {
    fontSize: 16,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  fplaceholderStyles: {
    color: "#C9C9C9",
    fontFamily: "Prompt_400Regular",
    fontSize: 18,
    lineHeight: 24,
  },
  test: {
    zIndex: -1,
  },
});

export default FormPaymentCredit;

// FormPaymentCredit
