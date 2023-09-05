import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import { CommonActions } from '@react-navigation/native';
// local
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileDetail = (props) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});

  // error
  const [errorDay, setErrorDay] = useState(false);
  const [errorMonth, setErrorMonth] = useState(false);
  const [errorYear, setErrorYear] = useState(false);

  const [gender, setGender] = useState([
    { label: "ชาย", value: "male" },
    { label: "หญิง", value: "female" },
    { label: "อื่น ๆ", value: "neutral" },
  ]);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({});

  useEffect(() => {
    initialData();
  }, []);

  const alert =() =>{
    Alert.alert('', 'คุณแน่ใจว่าต้องการลบบัญชีนี้', [
      {
        text: 'ยกเลิก',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel', 
      },
      {
        text: 'ลบบัญชี',
        onPress: () => Delete(),
        style: 'destructive', 
      },
    ]);
  }
  const Delete = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const response = await fetch(
        `https://api.marulaundry-kangyong.com/v2/user`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();
      if (response?.status == 200) {
        await AsyncStorage.clear();
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "Login" }],
          })
        )  
      }
    } catch (err) {
      console.log(err);
    }
  };


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
      .then(async (responseJson) => {
        setProfile(responseJson?.result);
        setValue("firstname", responseJson?.result?.firstname);
        setValue("lastname", responseJson?.result?.lastname);
        setValue("day", responseJson?.result?.birthdate.split("-")[2]);
        setValue("month", responseJson?.result?.birthdate.split("-")[1]);
        setValue("year", responseJson?.result?.birthdate.split("-")[0]);
        setValue("sex", responseJson?.result?.sex);
        setGenderValue(responseJson?.result?.sex);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }

  async function submit(data) {
    setLoading(true);

    const currentYear = new Date().getFullYear() + 543;
    if (+data.day === 0 || data.day === "0") {
      setLoading(false);
      setErrorDay(true);
      return;
    }

    if (
      (data.year.length > 4 && data.year > currentYear) ||
      data.year === "0"
    ) {
      setErrorYear(true);
      setLoading(false);
      return;
    }

    if (data.month > 12 || data.month === "0") {
      setLoading(false);
      setErrorMonth(true);
      return;
    }

    let birthdate = `${data.year}-${data.month}-${data.day}`;
    const payload = {
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: birthdate,
      phone_number: profile.phone,
      sex: genderValue,
      pdpa_version: "9.0.0",
      is_accept_pdpa: false,
    };

    const accessToken = await AsyncStorage.getItem("access_token");
    fetch(`https://api.marulaundry-kangyong.com/v2/user`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson?.message === "The data has been saved successfully.") {
          setLoading(false);
          Alert.alert(responseJson?.message);
          setProfile(responseJson?.result);
          props.navigation.navigate("โปรไฟล์");
        }
        if (responseJson?.detail[0].msg !== "") {
          setLoading(false);
          if (responseJson?.detail[0]?.msg === "invalid date format") {
            Alert.alert("กรุณากรอกวันเดือนปีเกิดใหม่ค่ะ");
            return;
          } else {
            Alert.alert(responseJson?.detail[0]?.msg);
            return;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <SafeAreaView style={styles.holder}>
      <ScrollView>
        <View style={styles.container}>
          {loading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                marginTop: 30,
              }}
            >
              <ActivityIndicator
                size="large"
                color="#AB4740"
                style={{
                  zIndex: 9999,
                }}
              />
            </View>
          ) : (
            <View style={styles.py3}>
              <Text style={styles.formLabel}>ข้อมูลส่วนตัว</Text>

              <Controller
                control={control}
                name="firstname"
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
                            !/[!@#$%^&฿*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
                              value
                            ))
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
                              !/[!@#$%^&฿*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
                                value
                              ))
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
                  <Text style={styles.errorTextRow}>
                    *กรุณาใส่ข้อมูลนามสกุล
                  </Text>
                )}
              </View>

              <View style={styles.container3}>
                <Controller
                  name="sex"
                  rules={{ required: true }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputGroup}>
                      <View style={styles.inputIconDropdown}>
                        <FontAwesome
                          name="intersex"
                          size={24}
                          color={COLORS.body}
                        />
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
                          onChangeValue={(value) => {
                            setValue("sex", value);
                            onChange(value);
                          }}
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

                  {errors.day || errorDay ? (
                    <Text style={styles.errorTextRow}>
                      *กรุณาใส่ข้อมูลวันเกิดให้ถูกต้อง
                    </Text>
                  ) : null}
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

                  {errors.month || errorMonth ? (
                    <Text style={styles.errorTextRow}>
                      *กรุณาใส่ข้อมูลเดือนให้ถูกต้อง
                    </Text>
                  ) : null}
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
                  {errors.year || errorYear ? (
                    <Text style={styles.errorTextRow}>
                      *กรุณาใส่ข้อมูลปีให้ถูกต้อง
                    </Text>
                  ) : null}
                </View>

              </View>
              <View >
                <Pressable style={{ alignSelf: "flex-end",marginRight:"2%"}} onPress={alert}>
                  <Text style={{ color: "#AB4740",  }}>ลบบัญชี</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.fixedBottom}>
        <View style={styles.container}>
          <TouchableHighlight
            style={styles.borderRadius}
            underlayColor={COLORS.white}
            // onPress={submit}
            onPress={handleSubmit(submit)}
            disabled={loading ? true : false}
          >
            <View style={styles.buttonSave}>
              <Text style={styles.textButton}>บันทึก</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
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
  inputGroupIcon: {
    width: 24,
    height: 24,
    margin: 20,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginLeft: -4,
    marginRight: -4,
    zIndex: -1,
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
  errorTextRow: {
    color: "#AB4740",
    fontSize: 12,
    textAlign: "left",
    marginTop: 0,
    marginBottom: 15,
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
  inputIconDropdown: {
    position: "absolute",
    top: 5,
    left: 0,
    width: 48,
    zIndex: 9999,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  birthDay: {
    width: "33%",
    zIndex: 0,
  },
  dropdownGender: {
    width: "100%",
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
});

export default ProfileDetail;