import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  // Linking,
  Alert,
  Platform,
  // Pressable
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../../components/common/colors";
import { FONTWEIGHT, FONTSIZE } from "../../components/common/variable";
import { Card } from "react-native-paper";
// import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import * as Linking from 'expo-linking';

// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
  Prompt_700Bold,
} from "@expo-google-fonts/prompt";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProgramDetail = (props) => {
  const [items, setItems] = useState({});
  const [courseItem, setCourseItem] = useState({});
  const [refID, setRefId] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainningTime, setRemainingTime] = useState(0);

  const {
    courseId,
    storeID,
    deviceId,
    course,
    item,
    equipmentId,
    dataItem,
    itemCourse,
  } = props?.route?.params || "";

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
    Prompt_700Bold,
  });

  // time use call check status
  const MINUTE_MS = 10000;

  useEffect(() => {
    initialData();
    getEquimentByStatus();
  }, [deviceId]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatusPayment();
    // }, remainningTime);
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  // get device id 
  async function initialData() {
    try {
      // get access token
      const accessToken = await AsyncStorage.getItem("access_token");
      console.log(accessToken);
      setLoading(true);
      fetch(`https://api.marulaundry-kangyong.com/v2/equipment/${deviceId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson?.result) {
            const results = responseJson?.result?.course?.filter(
              (item) => +item?.course_id === +courseId
            );
            setItems(responseJson?.result);
            setLoading(false);
            setCourseItem(results[0]);
          }
        })
        .catch((error) => console.log(error));
    } catch (err) {
      setLoading(false);
    }
  }

  // get status equiment
  async function getEquimentByStatus() {
    try {
      return await fetch(
        `https://api.marulaundry-kangyong.com/v2/equipment/${equipmentId}`
      )
        .then((response) => response.json())
        .then((responseJson) => responseJson)
        .catch((error) => console.log(error));
    } catch (err) {
      setLoading(false);
    }
  }

  // get Equiment by id
  // async function getEquimentById() {
  //   try {
  //     return await fetch(
  //       `https://api.marulaundry-kangyong.com/v2/equipment/${equipmentId}`
  //     )
  //       .then((response) => response.json())
  //       .then((responseJson) => responseJson)
  //       .catch((error) => console.log(error));
  //   } catch (err) {
  //     setLoading(false);
  //   }
  // }

  // debit card payment
  async function paymentDebitCard() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      props.navigation.navigate("PaymentCredit");
    }, 500);
  }

  // pay with scb app
  async function payWithScbApp() {
    const accessToken = await AsyncStorage.getItem("access_token");
    try {
      setLoading(true);
      let response = await getEquimentByStatus();
      let settlement = [];
      response?.result?.course &&
      response?.result?.course.map((coursesItem) => {
        if(+coursesItem?.course_id === +courseId) {
          settlement.push({
            type: coursesItem?.course_id+"",
            amount: coursesItem?.price,
          });
        }
        });

      if (response?.result) {
        let ref1 = new Date().getTime();
        console.log('payWithScbApp Ref id  => ',ref1);
        const payload = {
          run_device: {
            store_id: response.result.store_id,
            device_id: response.result.id,
            remote_control: {
              model_info: response.result.device_model_no,
              course_info: 0,
              start_process: response?.result?.status?.process?.code,
              operation: +response.result.status.operation.code,
            },
          },
          settlement: settlement,
          ref1: ref1,
        };

        setRefId(payload?.ref1);
        AsyncStorage.setItem("refID", JSON.stringify(payload?.ref1))
        // call api
        await fetch(
          `https://api.marulaundry-kangyong.com/v2/payment/2cedab4a48713cfcf632/_scb/easy-app`,
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then(async (responseJson) => {
            if (responseJson?.detail?.code === "ERR_400009") {
              Alert.alert(responseJson?.detail?.content);
              return;
            }

            if (responseJson?.detail?.status?.code) {
              Alert.alert(responseJson?.detail?.status?.description);
              return;
            }

            // props.navigation.navigate("หน้าแรก", {
            //   transaction_success: true,
            //   unit_no: itemCourse?.unit_no,
            // });

            if (responseJson?.data) {
              const appUrl = `${Linking.createURL()}`;
              const url = `${responseJson?.data?.deeplinkUrl}?callback_url=${appUrl}`;
                await Linking.openURL(url).then((data) => {
                  console.log('Success openURL !');
                }).catch((err) => {
                  console.error('Cannot open URL:', url);
                })

                // mock
            // props.navigation.navigate("หน้าแรก", {
            //   transaction_success: true,
            //   unit_no: itemCourse?.unit_no,
            // });
             
            setLoading(false);
            let responsePayment = await getEquimentByStatus();
            console.log("RESPONSE PAYMENT => ",responsePayment);
            const refIDPayment = await AsyncStorage.getItem("refID");
                if(refIDPayment && responsePayment?.result?.status?.remaining_time) {
                  await checkStatusPayment()
                    const milliseconds =  +responsePayment?.result?.status?.remaining_time === 0 ? 10000 : +responsePayment?.result?.status?.remaining_time * 60000;
                    setRemainingTime(milliseconds);   
                }
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      }
    } catch (err) {
      setLoading(false);
    }
  }

  // check status qr cocheckStatusPaymentde payment
  const checkStatusPayment = async () => {
    try {
      const refIDPayment = await AsyncStorage.getItem("refID");
      const accessToken = await AsyncStorage.getItem("access_token");
      // call api
      fetch(`https://api.marulaundry-kangyong.com/v2/payment/check-status/${refIDPayment}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          if (responseJson?.result?.payment_success === true) {
            const paylaod = {
              device_id: 44
            }

           await lockDevice(paylaod)
          // lock device when pay success
          setTimeout(() => {
            props.navigation.navigate("หน้าแรก", {
              transaction_success: true,
              unit_no: itemCourse?.unit_no,
            });
          }, 1500);
          }
        })
        .catch((error) => console.log(error));
    } catch (err) {
      console.log(err);
    }
  };

  // lock device id when paid success
  const lockDevice = async (data) => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const payload = {
        device_id: data?.device_id,
      };

      // call api
      fetch(`https://api.marulaundry-kangyong.com/v2/remote/control/device-lock`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('responseJsonresponseJsonresponseJson XXX ==> ',responseJson?.result);
          if (responseJson?.result) {
            // Alert.alert("เสร็จสิ้น");
            props.navigation.navigate("หน้าแรก", {
              transaction_success: true,
              unit_no: itemCourse?.unit_no,
            });
          }
        })
        .catch((error) => console.log(error));
    } catch (err) {
      console.log(err);
    }
  };

  // payment with qr code 
  async function paymentQrCode() {
    const accessToken = await AsyncStorage.getItem("access_token");
    try {
      setLoading(true);
      let response = await getEquimentByStatus();
      let settlement = [];
      response?.result?.course &&
      response?.result?.course.map((coursesItem) => {
        if(+coursesItem?.course_id === +courseId) {
          settlement.push({
            type: coursesItem?.course_id+"",
            amount: coursesItem?.price,
          });
        }
        });

      if (response?.result) {
        let ref1 = new Date().getTime();
        console.log('ref1 paymentQrCode => ',ref1);
        const payload = {
          run_device: {
            store_id: response?.result?.store_id,
            device_id: +response?.result?.id,
            remote_control: {
              model_info: response?.result?.device_model_no,
              course_info: 0,
              start_process: response?.result?.status?.process?.code,
              operation: +response?.result?.status?.operation?.code,
            },
          },
          settlement: settlement,
          ref1: ref1,
        };

        AsyncStorage.setItem("refID", JSON.stringify(payload?.ref1))

        // call api
        fetch(
          `https://api.marulaundry-kangyong.com/v2/payment/2cedab4a48713cfcf632/promtpay/qrcode`,
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
  
            if (responseJson?.detail?.status?.description?.includes("Invalid response from downstream service")) {
              setLoading(false);
              Alert.alert("Invalid response from downstream service");
              return;
            }

            if (responseJson?.detail) {
              setLoading(false);
              Alert.alert(responseJson?.detail?.message);
              return;
            }

            if (responseJson?.detail?.includes("Not enough segments")) {
              setLoading(false);
              Alert.alert(responseJson?.detail);
              return;
            }
            if (responseJson?.result) {
              setLoading(false);
              props.navigation.navigate("Payment", {
                storeID: storeID,
                deviceId: deviceId,
                model_code: response.result.device_type_code,
                courseId: course.course_id,
                result: responseJson.result,
                settlement: settlement,
                ref: ref1,
                unit_no: itemCourse?.unit_no,
                type: "qr_code",
                ref1: ref1
              });
            }
          })
          .catch((error) => console.log(error));
      }
    } catch (err) {
      setLoading(false);
    }
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.holder}>
      {/* store list */}
      {loading ? (
        <ActivityIndicator size="large" color="#AB4740" />
      ) : (
        <ScrollView showsScrollIndicator={false}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Card style={styles.scan}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <View style={{ width: 110 }}>
                  <Image
                    style={styles.profileAvatar}
                    resizeMode="contain"
                    source={require("assets/15.png")}
                  />
                </View>
                <View style={{ marginTop: 15, marginLeft: 20 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 20,
                      fontFamily: "Prompt_700Bold",
                      marginBottom: 15,
                      lineHeight: 28,
                    }}
                  >
                    เครื่องหมายเลข {itemCourse?.unit_no}
                  </Text>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: -10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontFamily: "Prompt_700Bold",
                      }}
                    >
                      Size {itemCourse?.device_size}
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 20,
                        marginLeft: 10,
                        borderColor: "#fff",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 12,
                          padding: 3,
                          paddingRight: 9,
                          paddingLeft: 9,
                          fontFamily: "Prompt_400Regular",
                        }}
                      >
                        {itemCourse?.device_weigth}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 16,
                      marginTop: 10,
                      fontFamily: "Prompt_400Regular",
                    }}
                  >
                    {itemCourse?.device_type_name}
                  </Text>
                </View>
              </View>
            </Card>

            <View
              style={{
                flex: 1,
                flexDirection: "column",
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              <View style={[styles.machine, styles.bgPrimary]}>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: 10,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Prompt_700Bold",
                        color: "#000000",
                      }}
                    >
                      {courseItem?.course_type_name} 
                    </Text>
                    <Text
                      style={{
                        fontSize: 32,
                        fontFamily: "Prompt_700Bold",
                        lineHeight: 40,
                        flex: 1,
                        width: 80,
                        textAlign: "right",
                      }}
                    >
                      {courseItem.price?.toLocaleString()} 
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Prompt_700Bold",
                        color: "#000000",
                      }}
                    >
                      {/* {courseItem.course_type_name}  */}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Prompt_700Bold",
                        lineHeight: 40,
                        flex: 1,
                        width: 80,
                        color: "#FF0000",
                        textAlign: "right",
                      }}
                    >
                      {courseItem?.discount?.toLocaleString()} 
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Prompt_400Regular",
                        textAlign: "left",
                      }}
                    >
                      {courseItem?.course_type_name} 
                      {" "}
                      {!items?.status && !items?.status?.remaining_time ? "Na" : items?.status?.remaining_time}{' '}นาที
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Prompt_400Regular",
                      }}
                    >
                      บาท
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        marginLeft: 5,
                        fontFamily: "Prompt_400Regular",
                        textAlign: "left",
                        lineHeight: 40,
                      }}
                    >
                      แนะนำ 15 กก.
                    </Text>
                  </View>
                </View>
              </View>

              <Text
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  marginTop: 15,
                  lineHeight: 24,
                  marginBottom: 15,
                  fontFamily: "Prompt_700Bold",
                }}
              >
                เลือกวิธีชำระเงิน
              </Text>

              <View style={{ flex: 1 }}>
                <TouchableHighlight
                  style={styles.box}
                  underlayColor={COLORS.white}
                  onPress={paymentQrCode}
                >
                  <View style={[styles.machine, styles.bgPrimary]}>
                    <View style={styles.row}>
                      <View style={[styles.col, styles.machineInfo]}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <View
                            style={{
                              width: Platform.OS === "ios" ? 325 : 300,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <Image
                              style={styles.qrcodeImage}
                              resizeMode="contain"
                              source={require("assets/qrcode.png")}
                            />
                            <Text
                              style={{
                                fontFamily: "Prompt_400Regular",
                                fontSize: 16,
                                lineHeight: 24,
                              }}
                            >
                              QR Code
                            </Text>
                          </View>
                          <View>
                            <MaterialIcons
                              name="navigate-next"
                              size={34}
                              color="black"
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.box}
                  underlayColor={COLORS.white}
                  onPress={paymentDebitCard}
                >
                  <View style={[styles.machine, styles.bgPrimary]}>
                    <View style={styles.row}>
                      <View style={[styles.col, styles.machineInfo]}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <View
                            style={{
                              width: Platform.OS === "ios" ? 325 : 300,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <FontAwesome5
                              name="credit-card"
                              size={20}
                              color="#AB4740"
                              style={{ marginRight: 10 }}
                            />
                            <Text
                              style={{
                                fontFamily: "Prompt_400Regular",
                                fontSize: 16,
                                lineHeight: 24,
                              }}
                            >
                              บัตรเครดิต/เดบิต
                            </Text>
                          </View>
                          <View>
                            <MaterialIcons
                              name="navigate-next"
                              size={34}
                              color="black"
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.box}
                  underlayColor={COLORS.white}
                  onPress={payWithScbApp}
                >
                  <View style={[styles.machine, styles.bgPrimary]}>
                    <View style={styles.row}>
                      <View style={[styles.col, styles.machineInfo]}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <View
                            style={{
                              width: Platform.OS === "ios" ? 325 : 300,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <Image
                              style={styles.qrcodeImage}
                              resizeMode="contain"
                              source={require("assets/scb.png")}
                            />
                            <Text
                              style={{
                                fontFamily: "Prompt_400Regular",
                                fontSize: 16,
                                lineHeight: 24,
                              }}
                            >
                              SCB Easy
                            </Text>
                          </View>
                          <View>
                            <MaterialIcons
                              name="navigate-next"
                              size={34}
                              color="black"
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// Later on in your styles..
var styles = StyleSheet.create({
  qrcodeImage: {
    width: 23,
    height: 23,
    marginRight: 10,
  },
  imgPromotion: {
    width: 130,
    height: 130,
    margin: 10,
  },
  text: {
    margin: 5,
  },
  holder: {
    backgroundColor: "#ffffff",
    height: "100%",
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
  },
  containerText: {
    paddingLeft: 16,
    paddingRight: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginLeft: -4,
    marginRight: -4,
  },
  rowEnd: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    textAlign: "right",
  },
  box: {
    marginBottom: 10,
    flex: 1,
  },
  col: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    paddingLeft: 4,
    paddingRight: 4,
  },
  col_2_3: {
    width: "66.6666666%",
  },
  col_1_3: {
    width: "33.3333333%",
  },

  serviceRow: {
    display: "flex",
    flexDirection: "row",
    marginRight: -40,
  },
  serviceCol2: {
    display: "flex",
    alignItems: "center",
  },
  serviceCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  bgImage: {
    position: "relative",
  },
  bgImage2: {
    display: "flex",
    paddingLeft: 40,
  },
  serviceIcon: {
    width: 28,
    height: 28,
  },
  serviceTitle: {
    fontSize: FONTSIZE.sm,
    fontWeight: FONTWEIGHT.regular,
    textAlign: "center",
    lineHeight: 24,
  },
  machineTitle: {
    fontSize: 14,
    color: COLORS.dark,
    fontFamily: "Prompt_400Regular",
  },
  machineSize: {
    fontSize: FONTSIZE.sm,
    fontWeight: FONTWEIGHT.semibold,
    lineHeight: 18,
    color: COLORS.dark,
    marginLeft: 4,
  },
  machineCapacity: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderStyle: "solid",
    borderRadius: 40,
  },
  bgPrimary: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "flex-start",
  },
  bgDark: {
    backgroundColor: COLORS.dark,
  },
  bgWhite: {
    backgroundColor: COLORS.dark,
  },
  machineInfo: {
    width: 100,
  },
  statusBox: {
    width: "30%",
  },
  machine: {
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  imgMachine: {
    width: "100%",
    paddingTop: "20%",
  },
  imgMachine2: {
    width: "100%",
    paddingTop: "250%",
  },
  imgMachine3: {
    width: "100%",
    paddingTop: "136%",
  },
  status: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  ready: {
    backgroundColor: COLORS.white,
  },
  unavailable: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderStyle: "solid",
    opacity: 0.5,
  },
  flexCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  py2: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  py3: {
    paddingTop: 2,
    paddingBottom: 16,
  },
  pb2: {
    paddingBottom: 8,
  },
  pb3: {
    paddingBottom: 16,
  },
  mb3: {
    marginBottom: 16,
  },
  ms1: {
    marginLeft: 4,
  },
  ms2: {
    marginLeft: 8,
  },
  titleText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: FONTWEIGHT.bold,
    lineHeight: 28,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.body,
    marginBottom: 8,
  },
  bgImage: {
    paddingTop: "54%",
    position: "relative",
  },
  locationTextWrap: {
    paddingBottom: 8,
    paddingLeft: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  locationText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    marginLeft: 8,
  },
  storeBackdrop: {
    display: "flex",
    width: "100%",
    paddingTop: "40%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  storeBackdrop: {
    display: "flex",
    width: "100%",
    paddingTop: "40%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  btnPrimary: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: FONTWEIGHT.bold,
    textAlign: "center",
  },
  btnOutlineDark: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderStyle: "solid",
    borderRadius: 8,
  },
  btnOutlineDarkText: {
    color: COLORS.dark,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FONTWEIGHT.bold,
    textAlign: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  profileInner: {
    position: "relative",
    backgroundColor: "#e9ecef",
    width: 60,
    height: 60,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: "#AB4740",
  },
  profileAvatar: {
    width: 80,
    height: 110,
    marginLeft: 30,
    marginTop: 15,
  },
  textHello: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scan: {
    backgroundColor: "#AB4740",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    height: 124,
  },
});

export default ProgramDetail;
