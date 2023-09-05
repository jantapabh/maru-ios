import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ScrollView,
  Linking,
  ImageBackground,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import { FONTWEIGHT, FONTSIZE } from "../../components/common/variable";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
  Prompt_700Bold,
  Prompt_600SemiBold,
} from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";

// location
import * as Location from "expo-location";

const StoreMap = (props) => {
  const [storeDetail, setStoreDetail] = useState({});
  const [device, setDevice] = useState([]);
  const [imgList, setImgList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { storeId } = props?.route?.params || "";
  const [loading, setLoading] = useState(false);
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
    Prompt_700Bold,
    Prompt_600SemiBold,
  });

  // location
  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getLastKnownPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocation(location.coords);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (location) {
      getStoreDetail();
      getStoreDevide();
      setLoading(false);
    }
  }, [longitude, latitude, location, storeId]);

  // get store detail
  async function getStoreDetail() {
    setLoading(true);
    // initial data
    await fetch(
      `https://api.marulaundry-kangyong.com/v2/store/${storeId}?current_lat=${latitude}&current_lng=${longitude}`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson?.result) {
          props.navigation.setOptions({
            title: "ร้าน",
            headerTitle: responseJson?.result?.name,
          });
          setImgList(responseJson?.result?.image_url);
          setStoreDetail(responseJson?.result);
          setImageUrl(result);
          setLoading(false);
        }
        return responseJson;
      })
      .catch((error) => console.log(error));
  }

  // get device in store
  async function getStoreDevide() {
    // initial data
    setLoading(true);
    await fetch(
      `https://api.marulaundry-kangyong.com/v2/store/${storeId}/more-detail?current_lat=${latitude}&current_lng=${longitude}`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson?.result?.device) {
          setDevice(responseJson?.result?.device);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  }

  const openMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${storeDetail.lat},${storeDetail.lng}&dir_action=navigate`;
    Linking.openURL(url);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.holder}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#AB4740"
          style={{
            position: "absolute",
            zIndex: 9999,
            top: "50%",
            left: "50%",
          }}
        />
      )}

        <ScrollView
          // horizontal
          showsScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {storeDetail?.image_url?.length > 0 && (
            <ScrollView
              horizontal
              showsScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {storeDetail?.image_url?.length &&
                storeDetail?.image_url?.map((item, index) => {
                  return (
                    <TouchableHighlight
                      key={`promotionList-${index}`}
                      underlayColor="#FFFFFF"
                      style={[styles.containerPromotion]}
                    >
                      <Image
                        key={`promotionImageRow-${index}`}
                        source={{ uri: item }}
                        resizeMode="cover"
                        style={[styles.imgPromotion]}
                      />
                    </TouchableHighlight>
                  );
                })}
            </ScrollView>
          )}

          <View style={styles.py3}>
            <View style={styles.container}>
              <View style={styles.row}>
                <View style={[styles.col, styles.col_2_3]}>
                  <TouchableHighlight
                    underlayColor={COLORS.primary}
                    onPress={() => openMap()}
                    style={styles.btnPrimary}
                  >
                    <View style={[styles.flexRow, styles.flexCenter]}>
                      <FontAwesome5
                        name="compass"
                        size={22}
                        color={COLORS.white}
                      />
                      <Text style={[styles.btnPrimaryText, styles.ms2]}>
                        นำทาง {storeDetail.distance} กม.
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={[styles.col, styles.col_1_3]}>
                  <TouchableHighlight
                    underlayColor={COLORS.transparent}
                    onPress={() => {
                      if(storeDetail?.tel === "undefined" || !storeDetail?.tel) {
                        Alert.alert(storeDetail?.optional_contact);
                        return;
                      }

                      if(storeDetail?.tel) {
                        Linking.openURL(`tel:${storeDetail?.tel}`);
                      } 

                    }}
                    style={styles.btnOutlineDark}
                  >
                    <View style={[styles.flexRow, styles.flexCenter]}>
                      <Ionicons
                        name="call-sharp"
                        size={22}
                        color={COLORS.dark}
                      />
                      <Text style={[styles.btnOutlineDarkText, styles.ms1]}>
                        โทร
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <Text
              style={{
                fontSize: FONTSIZE.md,
                fontFamily: "Prompt_600SemiBold",
                marginBottom: 8,
              }}
            >
              บริการ
            </Text>
          </View>

          <ScrollView
            horizontal
            showsScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            <View style={styles.container}>
              <View style={styles.serviceRow}>
                {storeDetail?.additional_service?.includes("open24hr") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("assets/24hr.png")}
                        resizeMode="contain"
                        style={styles.serviceIcon}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>เปิดตลอด</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("wifi") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("assets/wifi.png")}
                        resizeMode="contain"
                        style={styles.serviceIcon}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>Wifi</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("cctv") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("assets/cctv.png")}
                        resizeMode="contain"
                        style={styles.serviceIcon}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>วงจรปิด</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("park") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("assets/parking.png")}
                        resizeMode="contain"
                        style={styles.serviceIcon}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>จอดรถ</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("iron") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("assets/iron.png")}
                        resizeMode="contain"
                        style={styles.serviceIcon}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>รีดผ้า</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes(
                  "folding_service"
                ) && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("assets/packing.png")}
                        resizeMode="contain"
                        style={styles.serviceIcon}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>พับผ้า</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("candy") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("assets/candy.png")}
                        resizeMode="contain"
                        style={styles.serviceIcon}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>ตู้กดขนม</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes(
                  "water_dispenser"
                ) && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("../../assets/images/icons/water-dispenser.png")}
                        resizeMode="center"
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>ตู้กดน้ำ</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("chair") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("../../assets/images/icons/chair.png")}
                        resizeMode="center"
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>ที่นั่งรอ</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes(
                  "fabric_softener"
                ) && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("../../assets/images/icons/fabric-softener.png")}
                        resizeMode="center"
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>ปรับผ้านุ่ม</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes(
                  "laundry_detergent"
                ) && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("../../assets/images/icons/laundry-detergent.png")}
                        resizeMode="center"
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>น้ำยาซักผ้า</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("toilet") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("../../assets/images/icons/toilet.png")}
                        resizeMode="center"
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>ห้องน้ำ</Text>
                  </View>
                )}

                {storeDetail?.additional_service?.includes("maid") && (
                  <View style={styles.serviceCol}>
                    <View style={styles.serviceIconBox}>
                      <Image
                        source={require("../../assets/images/icons/maid.png")}
                        resizeMode="center"
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </View>
                    <Text style={styles.serviceTitle}>แม่บ้าน</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {device?.length > 0 && (
            <View style={[styles.container, styles.flexColumn, styles.pb2]}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Prompt_600SemiBold",
                  marginBottom: 8,
                  lineHeight: 20,
                }}
              >
                เครื่องภายในร้าน
              </Text>
              {device?.length > 0 &&
                device?.map((item, index) => {
                  return (
                    <>
                      {item?.device_size === "S" && (
                        <View
                          style={[styles.machine, styles.bgPrimary]}
                          key={`storelist-item-${index}`}
                        >
                          <View style={styles.row} key={index}>
                            <View
                              style={[styles.col, styles.machineImage]}
                              key={index}
                            >
                              <Image
                                key={index}
                                source={require("assets/device2.png")}
                                resizeMode="contain"
                                style={styles.imgMachine}
                              />
                            </View>
                            <View
                              style={[styles.col, styles.machineInfo]}
                              key={index}
                            >
                              <View
                                key={index}
                                style={{
                                  flex: 1,
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  paddingLeft: 4,
                                }}
                              >
                                <View key={index}>
                                  <Text key={index} style={styles.machineTitle}>
                                    {item?.device_type_name}
                                  </Text>
                                  <Text key={index} style={styles.machineSize}>
                                    Size {item?.device_size}
                                  </Text>
                                </View>
                                <View
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    paddingBottom: 12,
                                  }}
                                >
                                  <View
                                    key={index}
                                    style={styles.machineCapacity}
                                  >
                                    <Text
                                      key={index}
                                      style={{
                                        fontSize: FONTSIZE.xs,
                                        color: COLORS.white,
                                      }}
                                    >
                                      {item?.device_weigth} KG
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View
                              key={index}
                              style={[styles.col, styles.statusBox]}
                            >
                              {item?.status?.door_lock?.includes("open") && +item?.status?.remaining_time === 0 && (
                                <View
                                  key={index}
                                  style={[styles.status, styles.ready]}
                                >
                                  <Text
                                    key={index}
                                    style={{
                                      fontSize: FONTSIZE.md,
                                      color: COLORS.success,
                                      textAlign: "center",
                                      fontFamily: "Prompt_700Bold",
                                    }}
                                  >
                                    ว่าง
                                  </Text>
                                </View>
                              )}
                              {item?.status?.door_lock?.includes("close") && +item?.status?.remaining_time !== 0 && (
                                <View
                                  key={index}
                                  style={[styles.status, styles.unavailable]}
                                >
                                  <Text
                                    key={index}
                                    style={{
                                      fontSize: FONTSIZE.md,
                                      color: COLORS.white,
                                      textAlign: "center",
                                      fontFamily: "Prompt_400Regular",
                                    }}
                                  >
                                    {!item?.status && !item?.status?.remaining_time ? "Na" : item?.status?.remaining_time} นาที
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      )}

                      {item?.device_size === "M" && (
                        <View
                          key={index}
                          style={[styles.machine, styles.bgPrimary]}
                        >
                          <View key={index} style={styles.row}>
                            <View
                              key={index}
                              style={[styles.col, styles.machineImage]}
                            >
                              <Image
                                key={index}
                                source={require("assets/device2.png")}
                                resizeMode="contain"
                                style={styles.imgMachine}
                              />
                            </View>
                            <View
                              key={index}
                              style={[styles.col, styles.machineInfo]}
                            >
                              <View
                                key={index}
                                style={{
                                  flex: 1,
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  paddingLeft: 4,
                                }}
                              >
                                <View key={index}>
                                  <Text key={index} style={styles.machineTitle}>
                                    {item.device_type_name}
                                  </Text>
                                  <Text key={index} style={styles.machineSize}>
                                    Size {item.device_size}
                                  </Text>
                                </View>
                                <View
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    paddingBottom: 12,
                                  }}
                                >
                                  <View
                                    key={index}
                                    style={styles.machineCapacity}
                                  >
                                    <Text
                                      key={index}
                                      style={{
                                        fontSize: FONTSIZE.xs,
                                        color: COLORS.white,
                                      }}
                                    >
                                      {item?.device_weigth} KG
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View
                              key={index}
                              style={[styles.col, styles.statusBox]}
                            >
                              {item?.status?.door_lock?.includes("open") && +item?.status?.remaining_time === 0 && (
                                <View
                                  key={index}
                                  style={[styles.status, styles.ready]}
                                >
                                  <Text
                                    key={index}
                                    style={{
                                      fontSize: FONTSIZE.md,
                                      color: COLORS.success,
                                      textAlign: "center",
                                      fontFamily: "Prompt_700Bold",
                                    }}
                                  >
                                    ว่าง
                                  </Text>
                                </View>
                              )}
                              {item?.status?.door_lock?.includes("close") && +item?.status?.remaining_time !== 0  && (
                                <View
                                  key={index}
                                  style={[styles.status, styles.unavailable]}
                                >
                                  <Text
                                    key={index}
                                    style={{
                                      fontSize: FONTSIZE.md,
                                      color: COLORS.white,
                                      textAlign: "center",
                                      fontFamily: "Prompt_400Regular",
                                    }}
                                  >
                                    {!item?.status && !item?.status?.remaining_time ? "Na" : item?.status?.remaining_time} นาที
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      )}

                      {item?.device_size === "L" && (
                        <View
                          key={index}
                          style={[styles.machine, styles.bgPrimary]}
                        >
                          <View key={index} style={styles.row}>
                            <View
                              key={index}
                              style={[styles.col, styles.machineImage]}
                            >
                              <Image
                                key={index}
                                source={require("assets/device2.png")}
                                resizeMode="contain"
                                style={styles.imgMachine}
                              />
                            </View>
                            <View
                              key={index}
                              style={[styles.col, styles.machineInfo]}
                            >
                              <View
                                key={index}
                                style={{
                                  flex: 1,
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  paddingLeft: 4,
                                }}
                              >
                                <View key={index}>
                                  <Text key={index} style={styles.machineTitle}>
                                    {item.device_type_name}
                                  </Text>
                                  <Text key={index} style={styles.machineSize}>
                                    Size {item.device_size}
                                  </Text>
                                </View>
                                <View
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    paddingBottom: 12,
                                  }}
                                >
                                  <View
                                    key={index}
                                    style={styles.machineCapacity}
                                  >
                                    <Text
                                      key={index}
                                      style={{
                                        fontSize: FONTSIZE.xs,
                                        color: COLORS.white,
                                      }}
                                    >
                                      {item?.device_weigth} KG
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View
                              key={index}
                              style={[styles.col, styles.statusBox]}
                            >
                              {item?.status?.door_lock?.includes("open") && +item?.status?.remaining_time === 0 && (
                                <View
                                  key={index}
                                  style={[styles.status, styles.ready]}
                                >
                                  <Text
                                    key={index}
                                    style={{
                                      fontSize: FONTSIZE.md,
                                      color: COLORS.success,
                                      textAlign: "center",
                                      fontFamily: "Prompt_700Bold",
                                    }}
                                  >
                                    ว่าง
                                  </Text>
                                </View>
                              )}
                              {item?.status?.door_lock?.includes("close") && +item?.status?.remaining_time !== 0 && (
                                <View
                                  key={index}
                                  style={[styles.status, styles.unavailable]}
                                >
                                  <Text
                                    key={index}
                                    style={{
                                      fontSize: FONTSIZE.md,
                                      color: COLORS.white,
                                      textAlign: "center",
                                      fontFamily: "Prompt_400Regular",
                                    }}
                                  >
                                    {!item?.status && !item?.status?.remaining_time ? "Na" : item?.status?.remaining_time} นาที
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      )}
                    </>
                  );
                })}
            </View>
          )}
        </ScrollView>

    </SafeAreaView>
  );
};

// Later on in your styles..
var styles = StyleSheet.create({
  holder: {
    backgroundColor: "#ffffff",
    height: "100%",
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
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
    marginLeft: -4,
    marginRight: -4,
  },
  serviceCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  serviceIconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderStyle: "solid",
    borderRadius: 8,
  },
  serviceIcon: {
    width: 28,
    height: 28,
  },
  serviceTitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 25,
    fontFamily: "Prompt_500Medium",
  },
  machineTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    fontFamily: "Prompt_700Bold",
  },
  machineSize: {
    fontSize: FONTSIZE.sm,
    lineHeight: 18,
    color: COLORS.white,
    fontFamily: "Prompt_600SemiBold",
  },
  machineCapacity: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderStyle: "solid",
    borderRadius: 40,
  },

  bgPrimary: {
    backgroundColor: COLORS.primary,
  },
  bgDark: {
    backgroundColor: COLORS.dark,
  },
  bgWhite: {
    backgroundColor: COLORS.white,
  },
  machineImage: {
    width: "25%",
  },
  machineInfo: {
    width: "45%",
  },
  statusBox: {
    width: "30%",
    paddingBottom: 8,
  },
  imgPromotion: {
    width: 454,
    height: 200,
    flex: 1,
  },
  containerPromotion: {
    flex: 1,
    width: 454,
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
    fontFamily: "Prompt_500Medium",
  },
  imgMachine: {
    width: "100%",
    height: 100,
    paddingTop: "140%",
  },
  imgMachine2: {
    width: "100%",
    height: 176,
    paddingTop: "250%",
  },
  imgMachine3: {
    width: "100%",
    height: 100,
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
    fontFamily: "Prompt_500Medium",
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
    paddingTop: 16,
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
    fontFamily: "Prompt_500Medium",
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.body,
    marginBottom: 8,
    fontFamily: "Prompt_500Medium",
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
    fontFamily: "Prompt_500Medium",
  },
  locationText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    marginLeft: 8,
    fontFamily: "Prompt_500Medium",
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
    textAlign: "center",
    fontFamily: "Prompt_700Bold",
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
    textAlign: "center",

    borderRadius: 8,
  },
  btnOutlineDarkText: {
    color: COLORS.dark,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Prompt_700Bold",
    textAlign: "center",
  },
});

export default StoreMap;
