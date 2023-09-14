import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Modal,
  // Linking,
  ActivityIndicator,
  Pressable,
  Platform,
  // NativeModules
} from "react-native";
import { COLORS } from "../../components/common/colors";
import { FONTWEIGHT, FONTSIZE } from "../../components/common/variable";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_800ExtraBold,
  Prompt_300Light,
  Prompt_700Bold,
  Prompt_400Regular,
  Prompt_600SemiBold,
} from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";
import moment from "moment";
//import Card
import { Card } from "react-native-paper";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePageMain = (props) => {
  const [promotionList, setPromotionList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [locationData, setLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [imgProfile, setImgProfile] = useState("");
  const [myDevice, setMyDevice] = useState([]);
  const [loading, setLoading] = useState(false);
  // props
  let { transaction_success, unit_no, deviceId, remaining_time } = props.route.params || "";
  const [isModalVisible, setModalVisible] = useState(false);
  const [minuteTimeSuccess, setMinuteTime] = useState(0);
  const [minuteTimeTOCal, setMinuteTimeTOCal] = useState(0);
  const [isModalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [deviceSuccess, setDeviceSuccess] = useState([]);
  const [deviceIDdaya, setDeviceIDdata] = useState("");

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_800ExtraBold,
    Prompt_300Light,
    Prompt_700Bold,
    Prompt_400Regular,
    Prompt_600SemiBold,
  });

  let today = new Date();
  let curHr = today.getHours();

  const MINUTE_MS = 10000;
  useEffect(() => {
    const interval = setInterval(() => {
      getMyDeviceDataInProcess();
    }, MINUTE_MS);

    return () => clearInterval(interval); 
  }, []);

  // get my device
  useEffect(() => {
    getMyDeviceDataInProcess();
  }, [])

   // get my device
   useEffect(() => {
    console.log('DEVICE ID ====> ',unit_no, deviceId);
  }, [unit_no, deviceId])

  // check my device when success
  useEffect(() => {
    handleToggleModalSuccess()
  }, [myDevice])

  // get access to camera
  useEffect(() => {
    (async () => {
      // const { status } = await Camera.requestCameraPermissionsAsync();
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasCameraPermission(status === 'granted');
    })();
  }, []);
  
  // get location
  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync({});
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location =
        Platform.OS === "android"
          ? await Location.getLastKnownPositionAsync()
          : await Location.getLastKnownPositionAsync({});
      if (location) {
        setLocation(location.coords);
      }
    })();
  }, []);

  // set modal when pay success
  useEffect(() => {
    (async () => {
      setTimeout(() => {
        if (transaction_success) {
          toggleModal();
          getMyDeviceDataInProcess();
        }
      }, 500);
    })();
  }, [transaction_success]);

  useEffect(() => {
    if (locationData) {
      initialStoreList().then(async (response) => {
        let newData = [];
        for (let i =0; i  < response?.count; i++) {
          const results = await getStoreDetail(response?.data[i]?.id);
          newData.push({
            id: response?.data[i]?.id,
            name: response?.data[i]?.name,
            lat: response?.data[i]?.lat,
            lng: response?.data[i]?.lng,
            distance: response?.data[i]?.distance,
            device: results,
          });
        }
        setStoreList(newData);
        setLoading(false);   
      })
    }
  }, [locationData]);

  useEffect(() => {
      initialDataPromotion();
      getUserData();
  }, []);

  async function handleToggleModalSuccess() {
    const myDeviceLocal = await AsyncStorage.getItem("my_device");
    const parseMyDevice = JSON.parse(myDeviceLocal);
    if(parseMyDevice.length !== 0 && myDevice.length !== parseMyDevice.length) {
      setModalSuccessVisible(true)
      const results = myDevice?.length > 0 && myDevice?.filter((item) => item?.id !== parseMyDevice?.id);
     if(results?.length===0) {
      setDeviceSuccess(parseMyDevice)
     }
    }
  }

  // data promotion
  async function initialDataPromotion() {
    fetch(
      `https://api.marulaundry-kangyong.com/v2/remote/promotion/news/news-activated`
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        let newArr = [];
        if (responseJson) {
          responseJson?.result &&
            responseJson?.result?.map(async (item, index) => {
              if (item?.image_url_title) {
                newArr.push({
                  img: item.image_url_title,
                  id: item.id,
                  index: index,
                });
                setPromotionList(newArr);
              }
            });
        }
      })
      .catch((error) => console.log(error));
  }

  async function initialStoreList() {
    let isNearby = true;
     return await fetch(
      `https://api.marulaundry-kangyong.com/v2/store?page=1&nearby=${isNearby}&current_lat=${locationData?.latitude}&current_lng=${locationData?.longitude}`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;        
      })
      .catch((error) => console.log(error));
  }

  async function getStoreDetail(id) {
    // initial data
    return await fetch(
      `https://api.marulaundry-kangyong.com/v2/store/${id}/more-detail`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson?.result && responseJson?.result?.device;
      })
      .catch((error) => console.log(error));
  }

  // get my user 
  async function getUserData() {
    // initial data
    const accessToken = await AsyncStorage.getItem("access_token");
    return await fetch(`https://api.marulaundry-kangyong.com/v2/user/profile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson?.result) {
          let image = await getImage(responseJson?.result?.image_profile);
          setImgProfile(image);
          setUserData(responseJson.result);
        }
      })
      .catch((error) => console.log(error));
  }

  const getImage = async (path) => {
    const accessToken = await AsyncStorage.getItem("access_token");
    return fetch(`https://api.marulaundry-kangyong.com/v2/file/download/profile/${path}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'image/jpeg'
        }
    })
        .then((response) => {
            return response.blob().then((data) => {
                let reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.onload = (event) => {
                        return resolve(event.target.result)
                    }
                    reader.onerror = (event) => {
                        return reject(event)
                    }
                    reader.readAsDataURL(data)
                })
            }).catch((err) => {
                console.log(err);
            })
        });
};

  const handleGoToStore = (id) => {
    props.navigation.navigate("Store", {
      storeId: id,
    });
    props.navigation.setParams({ param: id });
  };

  const toggleModal = async () => {
    setModalVisible(true);
  };

  // get device in process 
  async function getMyDeviceDataInProcess() {
    const accessToken = await AsyncStorage.getItem("access_token");
    return await fetch(
      `https://api.marulaundry-kangyong.com/v2/equipment/all/my-equipments`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        const responseData = responseJson?.result;
        if (responseData) {
          let newArr = responseJson?.result;
          let newData = [];

          if(responseData?.length === 0) {
            setMyDevice([]);
            return ;
          }
          
          newArr?.length &&
            newArr?.map((item) => {
              const minute = moment(+item.timestamp_remaining_time).minute()
              setMinuteTimeTOCal(minute)
              setMinuteTime(moment(+item.timestamp_remaining_time).format(
                "mm:ss"
              ))
              newData.push({
                ...item,
                time_remain: moment(+item.timestamp_remaining_time).format(
                  "mm:ss"
                ),
              });
              setMyDevice(newData);
              // set local storege
              AsyncStorage.setItem("my_device", JSON.stringify(newData));
            });
        }
      })
      .catch((error) => console.log(error));
  }

  const findSuccessTime  = (minutesTime) => {
    const currentDate = new Date();
    // Define the number of minutes to add
    const minutesToAdd = +minutesTime;
    const futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000); // 60000 milliseconds in a minute
    const futureHours = futureDate.getHours();
    const futureMinutes = futureDate.getMinutes();
    return `${futureHours}:${futureMinutes}`
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView>
      <ScrollView style={[styles.holder]} showsScrollIndicator={false}>
        {/* scan qr */}
        <LinearGradient colors={["#A94640", "#A94640"]} style={styles.bgImage2}>
          <View style={styles.profile}>
            {imgProfile !== "" && (
            <View style={styles.profileInner}>
              <Image
                style={styles.profileAvatar}
                source={{ uri: imgProfile}}

              />
            </View>
            )} 

            <View style={styles.textHello}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 24,
                  fontFamily: "Prompt_700Bold",
                }}
              >
                {curHr < 12
                  ? "สวัสดีตอนเช้า"
                  : curHr < 18
                  ? "สวัสดีตอนบ่าย"
                  : "สวัสดีตอนค่ำ"}
              </Text>
              {/* {userData && ( */}
              <Text style={styles.nameText}>
                {userData?.firstname && userData?.lastname
                  ? `คุณ ${userData.firstname}` + " " + `${userData.lastname}`
                  : ""}
              </Text>
              {/* )} */}
            </View>

            {transaction_success && (
              <TouchableHighlight
                style={styles.boxAdd}
                underlayColor={COLORS.primary}
                onPress={() => props.navigation.navigate("สแกนเครื่อง")}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="md-add" size={27} color="black" />
                  <Text
                    style={{ fontSize: 16, fontFamily: "Prompt_500Medium" }}
                  >
                    ซักเพิ่ม
                  </Text>
                </View>
              </TouchableHighlight>
            )}
            
          </View>

          {!transaction_success && ( 
            <Card style={styles.scan}>
              <TouchableHighlight
                onPress={() => props.navigation.navigate("สแกนเครื่อง")}
                underlayColor={COLORS.black}
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("assets/scanqr_code.png")}
                    resizeMode={Platform.OS === "ios" ? "contain" : "center"}
                    style={{
                      width: 68,
                      height: 79,
                    }}
                  />

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: 13,
                      marginLeft: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Prompt_800ExtraBold",
                        color: COLORS.white,
                      }}
                    >
                      {" "}
                      สแกน QR
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Prompt_800ExtraBold",
                        color: COLORS.white,
                      }}
                    >
                      {" "}
                      เริ่มการซัก
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </Card>
          )} 

          {myDevice?.length > 0 &&
            myDevice?.map((item) => {
              return (
                <Card style={styles.scanAdd}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ marginLeft: 20 }}>
                    <Image
                      style={{ width: 72 , height: 135, marginTop: 10 }}
                      source={require("assets/15.png")}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={{ marginTop: 10, marginLeft: 20 }}>
                    <View style={styles.time}>
                      <MaterialCommunityIcons
                        style={{
                          color: "#ffffff",
                        }}
                        name="clock-check-outline"
                        size={33}
                        color="black"
                      />
                      <Text
                        style={{
                          fontSize: 24,
                          backgroundColor: "#AB4740",
                          marginLeft: 5,
                          color: "#ffffff",
                          fontFamily: "Prompt_500Medium",
                        }}
                      >
                    {item?.time_remain} 
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 20,
                        fontFamily: "Prompt_500Medium",
                      }}
                    >
                      เครื่องหมายเลข {deviceId || "44"}
                    </Text>
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontFamily: "Prompt_500Medium",
                      }}
                    >
                      Size S
                    </Text>
                  </View>
                </View>
              </Card>
               )
            })}
        </LinearGradient>

        <View style={styles.containerText}>
          <Text
            style={{
              fontSize: FONTSIZE.md,
              marginTop: 14,
              fontFamily: "Prompt_600SemiBold",
            }}
          >
            โปรโมชั่น/ข่าวสาร
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginTop: 14,
              color: "#393A3A",
              fontFamily: "Prompt_400Regular",
            }}
            onPress={() => {
              props.navigation.navigate("โปรโมชั่น");
            }}
          >
            เพิ่มเติม
          </Text>
        </View>

        {/* promotion */}
        {promotionList?.length > 0 && (
          <ScrollView
            horizontal
            showsScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            // style={{ marginBottom: 16 }}
          >
            {promotionList?.length &&
              promotionList?.map((item, index) => {
                return (
                  <TouchableHighlight
                    key={`promotionList-${index}`}
                    underlayColor="#FFFFFF"
                    style={[styles.containerPromotion]}
                    onPress={() =>
                      props.navigation.navigate(`PromotionDetail`, {
                        id: item.id,
                      })
                    }
                  >
                    <Image
                      key={`promotionImageRow-${index}`}
                      source={{ uri: item.img }}
                      resizeMode="cover"
                      style={[
                        styles.imgPromotion,
                        `${item?.index === 0 ? styles.p10 : ""}`,
                      ]}
                    />
                  </TouchableHighlight>
                );
              })}
          </ScrollView>
        )}

        {/* store list */}
        <View style={[styles.container, styles.flexColumn, styles.pb2]}>
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                fontFamily: "Prompt_500Medium",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: FONTSIZE.md,
                  marginTop: 14,
                  fontFamily: "Prompt_600SemiBold",
                }}
              >
                สาขาใกล้บ้าน
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 14,
                  color: "#393A3A",
                  fontFamily: "Prompt_400Regular",
                }}
                onPress={() => {
                  props.navigation.navigate("ร้าน");
                }}
              >
                เพิ่มเติม
              </Text>
            </View>

            {!loading ? (
              storeList?.map((item, index) => {
                return (
                  <TouchableHighlight
                    style={{ flex: 1 }}
                    key={`storeList-${index}`}
                    underlayColor={COLORS.white}
                    onPress={() => handleGoToStore(item.id)}
                  >
                    <View
                      style={[styles.machine, styles.bgPrimary]}
                      key={`storeListRow-${index}`}
                    >
                      <View
                        style={{ display: "flex", flexDirection: "row" }}
                        key={`storeListView-${index}`}
                      >
                        {/* image icon */}
                        <View
                          key={`storeListCol-${index}`}
                          style={[styles.col, styles.machineImage]}
                        >
                          <Image
                            key={`storeListImg-${index}`}
                            source={require("assets/iconMaru.png")}
                            resizeMode="contain"
                            style={styles.imgMachine}
                          />
                        </View>

                        <View
                          style={[styles.col, styles.machineInfo]}
                          key={`storeListView2-${index}`}
                        >
                          <View
                            key={`storeListCol2-${index}`}
                            style={{
                              flex: 1,
                              flexDirection: "column",
                              justifyContent: "space-between",
                              paddingLeft: 4,
                              alignItems: "center",
                            }}
                          >
                            <View
                              key={`storeListItem-${index}`}
                              style={{ width: "100%", flex: 1 }}
                            >
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%", flex: 1
                                }}
                              >
                                <Text
                                  key={`storeListItemName-${index}`}
                                  style={{
                                    fontSize: 16,
                                    lineHeight: 24,
                                    fontFamily: "Prompt_700Bold",
                                    color: COLORS.dark,
                                    textAlign: "left",
                                    width: "100%", flex: 1
                                  }}
                                >
                                  {item?.name}
                                </Text>

                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: COLORS.dark,
                                    lineHeight: 24,
                                    fontFamily: "Prompt_600SemiBold",
                                    textAlign: "right",
                                    width: "100%", flex: 1
                                  }}
                                >
                                  {item?.distance?.toLocaleString()} กม.
                                </Text>
                              </View>

                              {/* item list device */}
                              <View
                                key={`storeListItemDevice-${index}`}
                                style={[styles.col, styles.py2]}
                              >
                                {item?.device?.length > 0 &&
                                  item?.device?.map((deviceItem) => {
                                    return (
                                      <View style={[styles.rowBetween]}>
                                        <View
                                          key={`storeListItemDeviceCol-${index}`}
                                          style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            flexDirection: "row",
                                            flex: 1,
                                          }}
                                        >
                                          {deviceItem?.device_type_name ===
                                            "Wash & Dry" && (
                                            <Image
                                              source={require("assets/2.png")}
                                              resizeMode="contain"
                                            />
                                          )}

                                          {deviceItem?.device_type_name ===
                                            "Dry" && (
                                            <Image
                                              source={require("assets/3.png")}
                                              resizeMode="contain"
                                            />
                                          )}

                                          <Text
                                            style={{
                                              fontSize: 14,
                                              lineHeight: 24,
                                              color: COLORS.dark,
                                              marginLeft: 4,
                                              fontFamily: "Prompt_500Medium",
                                            }}
                                          >
                                            {deviceItem?.device_type_name}
                                          </Text>
                                        </View>

                                        <View
                                          key={`storeListItemDeviceStatusRow-${index}`}
                                          style={{
                                            flex: 1,
                                          }}
                                        >
                                          {deviceItem?.status?.door_lock?.includes("open") && +deviceItem?.status?.remaining_time === 0 ? (
                                            <Text
                                              key={`storeListItemDeviceStatusEmtpy-${index}`}
                                              style={{
                                                fontSize: 14,
                                                color: COLORS.success,
                                                fontFamily: "Prompt_700Bold",
                                                lineHeight: 24,
                                                textAlign: "right",
                                              }}
                                            >
                                              ว่าง
                                            </Text>
                                          ) : (
                                            <Text
                                              key={`storeListItemDeviceTime-${index}`}
                                              style={{
                                                fontSize: 14,
                                                color: COLORS.muted,
                                                fontFamily: "Prompt_400Regular",
                                                lineHeight: 24,
                                                textAlign: "right",
                                              }}
                                            >
                                              {
                                                !deviceItem?.status
                                                  && !deviceItem?.status?.remaining_time ?  "Na" : deviceItem?.status?.remaining_time 
                                              }{" "}
                                              นาที
                                            </Text>
                                          )}
                                        </View>
                                      </View>
                                    );
                                  })}
                              </View>
                            </View>

                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                paddingBottom: 12,
                                marginLeft: -10,
                              }}
                            ></View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>
                );
              })
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
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
            )}
          </View>
        </View>
      </ScrollView>

      {/* modal */}
      {isModalVisible === true && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  fontSize: 25,
                  color: "#393A3A",
                  marginTop: 10,
                  fontFamily: "Prompt_500Medium",
                }}
              >
                เริ่มการซักผ้า
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 10,
                  fontFamily: "Prompt_500Medium",
                }}
              >
                เครื่องหมายเลข {deviceId || "44"}
              </Text>
              <View style={styles.timeModal}>
                <MaterialCommunityIcons
                  style={{
                    color: "#393A3A",
                  }}
                  name="clock-check-outline"
                  size={33}
                  color="black"
                />
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    backgroundColor: "#ffffff",
                    marginLeft: 5,
                    color: "#393A3A",
                    fontFamily: "Prompt_500Medium",
                  }}
                >
                  {minuteTimeTOCal} นาที
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  marginTop: 10,
                  marginBottom: 20,
                  fontFamily: "Prompt_500Medium",
                }}
              >
                เสร็จเวลา {findSuccessTime(+minuteTimeTOCal)} น.
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!isModalVisible)}
              >
                <Text style={styles.textStyle}>ตกลง</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

        {/* modal success*/}
        {isModalSuccessVisible === true && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalSuccessVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Image
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
                source={require("assets/success.png")}
              />
              <Text
                style={{
                  fontSize: 25,
                  color: "#393A3A",
                  marginTop: 10,
                  fontFamily: "Prompt_500Medium",
                }}
              >
                ซักเสร็จแล้ว
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 10,
                  fontFamily: "Prompt_500Medium",
                }}
              >
                เครื่องหมายเลข {deviceSuccess[0]?.id || "44"}
              </Text>
          
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  marginTop: 10,
                  marginBottom: 20,
                  fontFamily: "Prompt_500Medium",
                }}
              >
                เสร็จเวลา {findSuccessTime(+minuteTimeTOCal)} น.
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose, styles.btnSuccess]}
                onPress={() => {
                  setModalSuccessVisible(!isModalSuccessVisible)
                  AsyncStorage.removeItem("my_device");
                }}
              >
                <Text style={styles.textStyle}>ตกลง</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
     )} 
    </SafeAreaView>
  );
};

// Later on in your styles..
var styles = StyleSheet.create({
  btnSuccess: {
backgroundColor: "#393A3A"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  button: {
    width: 200,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: "#AB4740",
  },
  timeModalSuccess: {
    fontSize: 20,
    fontWeight: 700,
    padding: 10,
    width: 160,
    backgroundColor: "#76B073",
    marginBottom: 10,
    borderRadius: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  time: {
    fontSize: 20,
    fontWeight: 700,
    backgroundColor: "#AB4740",
    padding: 10,
    width: 140,
    marginBottom: 15,
    borderRadius: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  timeModal: {
    fontSize: 20,
    fontWeight: 700,
    padding: 10,
    width: 140,
    marginTop: 15,
    borderRadius: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Prompt_500Medium",
  },
  imgPromotion: {
    width: 280,
    height: 120,
    borderRadius: 10,
  },
  text: {
    margin: 5,
    fontFamily: "Prompt_500Medium",
  },
  holder: {
    backgroundColor: "#ffffff",
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    paddingLeft: 16,
    flexDirection: "column",
    paddingRight: 16,
  },
  containerPromotion: {
    flex: 1,
    flexDirection: "column",
    padding: 0,
    marginLeft: 15,
  },
  containerText: {
    paddingLeft: 16,
    marginBottom: 8,
    paddingRight: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Prompt_500Medium",
  },
  rowBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginLeft: -4,
    marginRight: -4,
    fontFamily: "Prompt_500Medium",
  },
  col: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    paddingLeft: 4,
    paddingRight: 4,
    maxWidth: "100%",
    width: "100%",
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  serviceCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },

  bgImage2: {
    display: "flex",
    alignItems: "flex-start",
    paddingLeft: 15,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
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
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Prompt_700Bold",
    color: COLORS.dark,
    textAlign: "left",
  },
  machineSize: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.dark,
    marginLeft: 4,
    fontFamily: "Prompt_500Medium",
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
  },
  bgDark: {
    backgroundColor: COLORS.dark,
  },
  bgWhite: {
    backgroundColor: COLORS.dark,
  },
  machineImage: {
    width: "15%",
  },
  machineInfo: {
    width: "85%",
  },
  statusBox: {
    width: 100,
    paddingBottom: 8,
  },
  machine: {
    paddingTop: 16,
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
    width: 38,
    height: 42,
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
    fontFamily: "Prompt_500Medium",
  },
  nameText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Prompt_300Light",
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginLeft: -10,
    marginTop: 20,
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
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 120,
  },
  textHello: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
    fontFamily: "Prompt_500Medium",
  },
  scan: {
    backgroundColor: "#393A3A",
    width: "96%",
    height: 144,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: "Prompt_500Medium",
  },
  scanAdd: {
    backgroundColor: "#393A3A",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    width: "96%",
    height: 145,
  },
  boxAdd: {
    backgroundColor: "#FFFFFF",
    padding: 7,
    borderRadius: 10,
    // display: 'flex',
    // alignItems: 'center',
    marginLeft: 60,
  },
  p10: {
    marginLeft: 20,
  },
});

export default HomePageMain;
