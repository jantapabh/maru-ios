import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../components/common/colors";
import { CommonActions } from "@react-navigation/native";

// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
} from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";

const RegisterForm = (props) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [isErrors, setIsError] = useState(false);
  const { phone, token, pin } = props.route.params || "";
  const [loading, setLoading] = React.useState(false);

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
  });

  const [gender, setGender] = useState([
    { label: "ชาย", value: "male" },
    { label: "หญิง", value: "female" },
    { label: "อื่น ๆ", value: "neutral" },
  ]);

  const {
    // register,
    handleSubmit,
    control,
    formState: { dirtyFields, errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    setIsError(false);
    const currentYear = new Date().getFullYear() + 543;
    if (+data.day === 0 || data.day === "0") {
      setIsError(true);
      setLoading(false);

      return;
    }

    if (
      (data.year.length > 4 && data.year > currentYear) ||
      data.year === "0"
    ) {
      setIsError(true);
      setLoading(false);

      return;
    }

    if (data.month > 12 || data.month === "0") {
      setIsError(true);
      setLoading(false);

      return;
    }

    const formData = new FormData();
    // mock data
    let birthdate = `${data.year}-${data.month}-${data.day}`;
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("birthdate", birthdate);
    formData.append("phone_number", phone);
    formData.append("sex", data.gender);
    formData.append("pdpa_version", "1.0.0");
    formData.append("is_accept_pdpa", false);

    fetch(`https://api.marulaundry-kangyong.com/v2/user/auth/register`, {
      body: formData,
      method: "POST",
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson) {
          setLoading(false);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: "RegisterStatus",
                  params: {
                    isMember: responseJson.is_member,
                    access_token: responseJson.access_token,
                  },
                },
              ],
            })
          );
        }
      })
      .catch((error) => console.log("err: ", error));
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
        <Text
          style={{
            marginLeft: 10,
            fontFamily: "Prompt_400Regular",
            fontSize: 14,
            color: "#A8A8A8",
            marginBottom: 5,
            marginTop: 10,
          }}
        >
          ข้อมูลส่วนตัว
        </Text>
        <View style={styles.container3}>
          <Controller
            name="firstname"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Feather name="user" size={24} color={COLORS.body} />
                </View>
                <TextInput
                  style={[styles.formControl, styles.formControlIcon]}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    if (
                      /^[A-Za-z\s]*$/.test(value) ||
                      (/^[\u0E00-\u0E7F]*$/.test(value) &&
                        !/[!@#$%^&฿*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value))
                    ) {
                      onChange(value);
                    }
                  }}
                  value={value}
                  placeholder="ชื่อ"
                  returnKeyType="default"
                  placeholderTextColor="#393A3A"
                  keyboardType="default"
                />
              </View>
            )}
          />

          {errors.firstname && (
            <Text style={styles.errorTextRow}>*กรุณาใส่ข้อมูลชื่อ</Text>
          )}
        </View>
        <View style={styles.container3}>
          <Controller
            name="lastname"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <FontAwesome5
                    name="address-card"
                    size={24}
                    color={COLORS.body}
                  />
                </View>
                <TextInput
                  style={[styles.formControl, styles.formControlIcon]}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    if (
                      /^[A-Za-z\s]*$/.test(value) ||
                      (/^[\u0E00-\u0E7F]*$/.test(value) &&
                        !/[!@#$%^&฿*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value))
                    ) {
                      onChange(value);
                    }
                  }}
                  value={value}
                  placeholder="นามสกุล"
                  keyboardType="default"
                  placeholderTextColor="#393A3A"
                />
              </View>
            )}
            rules={{ required: true }}
          />

          {errors.lastname && (
            <Text style={styles.errorTextRow}>*กรุณาใส่ข้อมูลนามสกุล</Text>
          )}
        </View>
        <View style={styles.container3}>
          <Controller
            name="gender"
            rules={{ required: true }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <View style={styles.inputIconDropdown}>
                  <FontAwesome name="intersex" size={24} color={COLORS.body} />
                </View>
                <View style={styles.dropdownGender}>
                  <DropDownPicker
                    style={[
                      styles.dropdown,
                      styles.formControl,
                      styles.formControlIcon,
                    ]}
                    open={genderOpen}
                    value={genderValue} //genderValue
                    items={gender}
                    setOpen={setGenderOpen}
                    setValue={setGenderValue}
                    setItems={setGender}
                    zIndex={9999}
                    closeAfterSelecting={true}
                    dropDownContainerStyle={{
                      borderColor: "#D0D5DD",
                      marginTop: 10,
                      borderRadius: 10
                    }}
                    disableBorderRadius={false}
                    placeholder="เพศ"
                    placeholderStyle={styles.placeholderStyles}
                    onChangeValue={onChange}
                  />
                </View>
              </View>
            )}
          />
          {errors.gender && (
            <Text style={styles.errorTextRow}>*กรุณาใส่ข้อมูลเพศ</Text>
          )}
        </View>
        <View style={[styles.row]}>
          <View style={[styles.birthDay, styles.front]}>
            <Text
              style={{
                marginLeft: 25,
                fontFamily: "Prompt_500Medium",
                fontSize: 14,
                color: "#A8A8A8",
              }}
            >
              วันเกิด
            </Text>
            <Controller
              name="day"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input2]}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    if (value !== "00" && +value <= 31) {
                      onChange(value);
                    }
                  }}
                  value={value}
                  placeholder="วว"
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholderTextColor="#393A3A"
                />
              )}
              rules={{ required: true }}
            />

            {isErrors && (
              <Text style={styles.errorTextRow}>
                *กรุณาใส่ข้อมูลวันเกิดให้ถูกต้อง
              </Text>
            )}
          </View>

          <View style={styles.birthDay}>
            <Text
              style={{
                marginLeft: 25,
                fontFamily: "Prompt_500Medium",
                fontSize: 14,
                color: "#A8A8A8",
              }}
            >
              เดือน
            </Text>
            <Controller
              name="month"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input2]}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    if (value !== "00" && +value <= 12) {
                      onChange(value);
                    }
                  }}
                  value={value}
                  placeholder="ดด"
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholderTextColor="#393A3A"
                />
              )}
              rules={{ required: true }}
            />

            {isErrors && (
              <Text style={styles.errorTextRow}>
                *กรุณาใส่ข้อมูลเดือนให้ถูกต้อง
              </Text>
            )}
          </View>

          <View style={styles.birthDay}>
            <Text
              style={{
                marginLeft: 25,
                fontFamily: "Prompt_500Medium",
                fontSize: 14,
                color: "#A8A8A8",
              }}
            >
              ปี(พ.ศ.)
            </Text>

            <Controller
              name="year"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input2]}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    const currentYear = new Date().getFullYear() + 543;
                    if (
                      // value !== "0" &&
                      value !== "0000" &&
                      +value <= currentYear
                      // +value > 0
                    ) {
                      onChange(value);
                    }
                  }}
                  value={value}
                  placeholder="ปปปป"
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholderTextColor="#393A3A"
                />
              )}
              rules={{ required: true }}
            />
            {isErrors && (
              <Text style={styles.errorTextRow}>
                *กรุณาใส่ข้อมูลปีให้ถูกต้อง
              </Text>
            )}
          </View>
        </View>

        {isErrors && (
          <Text style={styles.errorText}>*กรุณากรอกข้อมูลให้ครบถ้วน</Text>
        )}

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={
              dirtyFields
                ? styles.buttonGPlusStyleActive
                : styles.buttonGPlusStyle
            }
            onPress={handleSubmit(onSubmit, onError)}
          >
            <Text style={styles.buttonTextStyle}>
              {loading ? (
                <ActivityIndicator size="large" color="#AB4740" />
              ) : (
                "ลงทะเบียน"
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
  errorText: {
    color: "#AB4740",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Prompt_500Medium",
    marginBottom: 20,
    marginTop: 20,
  },
  errorTextRow: {
    color: "#AB4740",
    fontSize: 12,
    textAlign: "left",
    marginLeft: 15,
    fontFamily: "Prompt_500Medium",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  formLabel: {
    fontSize: 16,
    color: COLORS.muted,
    margin: 10,
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
  inputIconDropdown: {
    position: "absolute",
    top: 14,
    left: 0,
    width: 48,
    zIndex: 9999,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    borderRadius: 10
  },
  container3: {
    margin: 10,
  },
  inputGroupIcon: {
    width: 24,
    height: 24,
    margin: 20,
  },
  birthDay: {
    width: "33%",
    zIndex: 0,
    height: 130,
  },
  dropdownGender: {
    width: "100%",
    marginTop: 15,
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
    // margin: 26,
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
    paddingVertical: 16,
    zIndex: -1,
    backgroundColor: "#fff",
  },
  input2: {
    backgroundColor: "#fff",
    borderColor: "#D0D5DD",
    height: 50,
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 4,
    borderRadius: 8,
    margin: 20,
  },
  inputGroupIcon: {
    width: 24,
    height: 24,
  },
  formControl: {
    fontSize: 16,
    // fontWeight: "600",
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    // zIndex: 0
  },
  inputGroup: {
    position: "relative",
    marginBottom: 16,
  },
  formControlIcon: {
    paddingLeft: 48,
  },
});

export default RegisterForm;
