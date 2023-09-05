import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import { FONTSIZE } from "../../components/common/variable";
import React, { useState, useEffect } from "react";
import { Card } from "react-native-paper";
import AppLoading from "expo-app-loading";

// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
  Prompt_700Bold,
} from "@expo-google-fonts/prompt";

const ListProgram = (props) => {
  const [items, setItems] = useState({});
  const [course, setCouse] = useState([]);
  const [dataItem, setDataItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const { storeID, equipmentId, deviceId } = props?.route?.params || "";
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
    Prompt_700Bold,
  });

  useEffect(() => {
    initialData();
  }, []);

  async function initialData() {
    try {
      setLoading(true);
      await fetch(`https://api.marulaundry-kangyong.com/v2/equipment/${equipmentId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          const results = responseJson?.result;
          console.log(results);
          setItems(responseJson?.result);
          setDataItem(results);
          setCouse(results?.course);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    } catch (err) {
      setLoading(false);
    }
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.holder}>
      {loading ? (
        <ActivityIndicator size="large" color="#AB4740" />
      ) : (
        <ScrollView showsScrollIndicator={false}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Card style={styles.scan}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <View style={{ width: 110 }}>
                  <Image
                    resizeMode="contain"
                    style={styles.profileAvatar}
                    source={require("assets/15.png")}
                  />
                </View>
                <View style={{ marginTop: 15, marginLeft: 20 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 20,
                      marginBottom: 15,
                      fontFamily: "Prompt_700Bold",
                      lineHeight: 28,
                    }}
                  >
                    เครื่องหมายเลข {deviceId}
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
                      Size {items?.device_size}
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 14.5,
                        marginLeft: 10,
                        borderColor: "#fff",
                        fontFamily: "Prompt_500Medium",
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
                        {items?.device_weigth}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 16,
                      marginTop: 10,
                      fontFamily: "Prompt_400Regular",
                      lineHeight: 0,
                    }}
                  >
                    {items?.device_type_name}
                  </Text>
                </View>
              </View>
            </Card>

            {/* course list */}
            <View style={[styles.container, styles.flexColumn, styles.pb2]}>
              <Text
                style={{
                  fontSize: FONTSIZE.md,
                  marginTop: 15,
                  marginBottom: 15,
                  fontFamily: "Prompt_500Medium",
                  color: "#969696",
                }}
              >
                โปรแกรมซัก
              </Text>

              <View style={{ flex: 1 }}>
                {items?.course?.length &&
                items?.course?.map((item, index) => {
                    return (
                      <View style={{ flex: 1 }} key={`list-program-${index}`}>
                        <TouchableHighlight
                          style={{ flex: 1, marginBottom: 10 }}
                          underlayColor={COLORS.white}
                          onPress={() =>
                            props.navigation.navigate("ชำระเงิน", {
                              courseId: item.course_id,
                              storeID: storeID,
                              deviceId: equipmentId,
                              course: items.course,
                              equipmentId: equipmentId,
                              dataItem: dataItem,
                              itemCourse: items
                            })
                          }
                        >
                          <View
                            style={{
                              flex: 1,
                              borderRadius: 8,
                              backgroundColor: COLORS.white,
                              shadowColor: "#000",
                              shadowOffset: {
                                width: 0,
                                height: 2,
                              },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                              elevation: 5,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                padding: 10,
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: "column",
                                  marginLeft: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 20,
                                    lineHeight: 30,
                                    fontFamily: "Prompt_700Bold",
                                    color: "#000000",
                                  }}
                                >
                                  {item?.course_type_name}
                                </Text>

                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontFamily: "Prompt_400Regular",
                                    lineHeight: 37,
                                    textAlign: "left",
                                  }}
                                >
                                  {item?.course_type_name}{" "}
                                </Text>

                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontFamily: "Prompt_400Regular",
                                    lineHeight: 37,
                                    textAlign: "left",
                                  }}
                                >
                                  {dataItem?.status?.remaining_time === null  ? "Na" : dataItem?.status?.remaining_time} นาที
                                </Text>


                                <Text style={styles.machineTitle}>
                                  แนะนำ 15 กก.
                                </Text>
                              </View>

                              <View style={{ flex: 1, marginRight: 10 }}>
                                <Text
                                  style={{
                                    fontSize: 32,
                                    fontFamily: "Prompt_700Bold",
                                    textAlign: "right",
                                    lineHeight: 40,
                                  }}
                                >
                                  {item?.price?.toLocaleString()}
                                </Text>
                                
                                <Text
                                  style={{
                                    fontSize: 20,
                                    fontFamily: "Prompt_700Bold",
                                    textAlign: "right",
                                    lineHeight: 40,
                                    color: "#FF0000"
                                  }}
                                >
                                  {item?.discount?.toLocaleString()}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontFamily: "Prompt_400Regular",
                                    textAlign: "right",
                                    lineHeight: 17,
                                  }}
                                >
                                  บาท
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableHighlight>
                      </View>
                    );
                  })}
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
    flex: 1,
  },
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  containerText: {
    paddingLeft: 16,
    paddingRight: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
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
    // justifyContent: 'start',
    alignItems: "center",
  },
  serviceCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  bgImage: {
    // paddingTop: '54%',
    position: "relative",
  },
  bgImage2: {
    display: "flex",
    // alignItems: 'start',
    paddingLeft: 40,
  },
  serviceIcon: {
    width: 28,
    height: 28,
  },
  serviceTitle: {
    fontSize: FONTSIZE.sm,
    textAlign: "center",
    lineHeight: 24,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  machineTitle: {
    fontSize: FONTSIZE.md,
    lineHeight: 24,
    color: COLORS.dark,
    fontFamily: "Prompt_400Regular",
  },
  machineSize: {
    fontSize: FONTSIZE.sm,
    lineHeight: 18,
    color: COLORS.dark,
    marginLeft: 4,
    fontFamily: "Prompt_400Regular",
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
    fontFamily: "Prompt_400Regular",
  },
  rowStatus: {
    // paddingLeft: 20
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
    width: "25%",
  },
  machineInfo: {
    // width: '45%',
  },
  statusBox: {
    width: "20%",
    paddingBottom: 8,
    fontFamily: "Prompt_500Medium",
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
    // fontWeight: FONTWEIGHT.bold,
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
    // fontWeight: FONTWEIGHT.bold,
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
    textAlign: "center",
  },
  nameText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Prompt_500Medium",
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
    fontFamily: "Prompt_500Medium",
  },
  scan: {
    backgroundColor: "#AB4740",
    borderRadius: 10,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
    height: 124,
  },
});

export default ListProgram;
