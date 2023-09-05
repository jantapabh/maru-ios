import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableHighlight,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import { FONTWEIGHT, FONTSIZE } from "../../components/common/variable";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

const StoreMap = ({ route }) => {
  const [promotionList, setPromotionList] = useState([]);
  const { storeId } = route?.params;

  useEffect(() => {
    initialData();
  }, []);

  async function initialData() {
    const params = {
      page: 1,
      store_id: storeId,
      limit: 10,
      sort: "asc",
      order_by: "id",
      start: 0,
    };
    fetch(
      `https://api.marulaundry-kangyong.com/v2/equipment?page=${params.page}&store_id=${params.store_id}&limit=${params.limit}&sort=${params.sort}&order_by=${params.order_by}&start=${params.start}`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setTimeout(() => {
          setPromotionList(responseJson.data);
          console.log(promotionList);
        }, 1000);
      })
      .catch((error) => console.log(error));
  }

  return (
    <SafeAreaView style={styles.holder}>
      <ScrollView showsScrollIndicator={false}>
        <ImageBackground
          source={{
            uri: "http://charldesign.com/project/maru/mock/store.jpg",
          }}
          resizeMode="cover"
          style={styles.bgImage}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            style={styles.storeBackdrop}
          />
          <View style={styles.locationTextWrap}>
            <Feather name="map-pin" size={24} color={COLORS.white} />
            <Text style={styles.locationText}>ใกล้แฟมิลี่มาร์ท</Text>
          </View>
        </ImageBackground>
        <View style={styles.py3}>
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={[styles.col, styles.col_2_3]}>
                <TouchableHighlight
                  underlayColor={COLORS.primary}
                  onPress={() => {}}
                  style={styles.btnPrimary}
                >
                  <View style={[styles.flexRow, styles.flexCenter]}>
                    <FontAwesome5
                      name="compass"
                      size={22}
                      color={COLORS.white}
                    />
                    <Text style={[styles.btnPrimaryText, styles.ms2]}>
                      นำทาง 350 ม.
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={[styles.col, styles.col_1_3]}>
                <TouchableHighlight
                  underlayColor={COLORS.transparent}
                  onPress={() => {}}
                  style={styles.btnOutlineDark}
                >
                  <View style={[styles.flexRow, styles.flexCenter]}>
                    <Ionicons name="call-sharp" size={22} color={COLORS.dark} />
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
              fontWeight: FONTWEIGHT.semibold,
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
              <View style={styles.serviceCol}>
                <View style={styles.serviceIconBox}>
                  <Image
                    source={{
                      uri: "http://charldesign.com/project/maru/icons/24-hours.png",
                    }}
                    resizeMode="contain"
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>เปิดตลอด</Text>
              </View>
              <View style={styles.serviceCol}>
                <View style={styles.serviceIconBox}>
                  <Image
                    source={{
                      uri: "http://charldesign.com/project/maru/icons/wifi.png",
                    }}
                    resizeMode="contain"
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>Wifi</Text>
              </View>
              <View style={styles.serviceCol}>
                <View style={styles.serviceIconBox}>
                  <Image
                    source={{
                      uri: "http://charldesign.com/project/maru/icons/closed-circuit.png",
                    }}
                    resizeMode="contain"
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>วงจรปิด</Text>
              </View>
              <View style={styles.serviceCol}>
                <View style={styles.serviceIconBox}>
                  <Image
                    source={{
                      uri: "http://charldesign.com/project/maru/icons/car-park.png",
                    }}
                    resizeMode="contain"
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>จอดรถ</Text>
              </View>
              <View style={styles.serviceCol}>
                <View style={styles.serviceIconBox}>
                  <Image
                    source={{
                      uri: "http://charldesign.com/project/maru/icons/iron.png",
                    }}
                    resizeMode="contain"
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>รีดผ้า</Text>
              </View>
              <View style={styles.serviceCol}>
                <View style={styles.serviceIconBox}>
                  <Image
                    source={{
                      uri: "http://charldesign.com/project/maru/icons/fold-clothes.png",
                    }}
                    resizeMode="contain"
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>พับผ้า</Text>
              </View>
              <View style={styles.serviceCol}>
                <View style={styles.serviceIconBox}>
                  <Image
                    source={{
                      uri: "http://charldesign.com/project/maru/icons/candy.png",
                    }}
                    resizeMode="contain"
                    style={styles.serviceIcon}
                  />
                </View>
                <Text style={styles.serviceTitle}>ตู้ขนม</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[styles.container, styles.flexColumn, styles.pb2]}>
          <Text
            style={{
              fontSize: FONTSIZE.md,
              fontWeight: FONTWEIGHT.semibold,
              marginBottom: 8,
            }}
          >
            เครื่องภายในร้าน
          </Text>
          {/* Size S */}
          <View style={[styles.machine, styles.bgPrimary]}>
            <View style={styles.row}>
              <View style={[styles.col, styles.machineImage]}>
                <Image
                  source={{
                    uri: "http://charldesign.com/project/maru/mock/washing-drying-s.png",
                  }}
                  resizeMode="contain"
                  style={styles.imgMachine}
                />
              </View>
              <View style={[styles.col, styles.machineInfo]}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingLeft: 4,
                  }}
                >
                  <View>
                    <Text style={styles.machineTitle}>เครื่องซัก/อบ</Text>
                    <Text style={styles.machineSize}>Size S</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingBottom: 12,
                    }}
                  >
                    <View style={styles.machineCapacity}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.xs,
                          fontWeight: FONTWEIGHT.regular,
                          color: COLORS.white,
                        }}
                      >
                        15 KG
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.col, styles.statusBox]}>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Size M */}
          <View style={[styles.machine, styles.bgPrimary]}>
            <View style={styles.row}>
              <View style={[styles.col, styles.machineImage]}>
                <Image
                  source={{
                    uri: "http://charldesign.com/project/maru/mock/washing-drying-m.png",
                  }}
                  resizeMode="contain"
                  style={styles.imgMachine}
                />
              </View>
              <View style={[styles.col, styles.machineInfo]}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingLeft: 4,
                  }}
                >
                  <View>
                    <Text style={styles.machineTitle}>เครื่องซัก/อบ</Text>
                    <Text style={styles.machineSize}>Size M</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingBottom: 12,
                    }}
                  >
                    <View style={styles.machineCapacity}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.xs,
                          fontWeight: FONTWEIGHT.regular,
                          color: COLORS.white,
                        }}
                      >
                        27 KG
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.col, styles.statusBox]}>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
                <View style={[styles.status, styles.unavailable]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.regular,
                      color: COLORS.white,
                      textAlign: "center",
                    }}
                  >
                    22 นาที
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Washing Size L */}
          <View style={[styles.machine, styles.bgPrimary]}>
            <View style={styles.row}>
              <View style={[styles.col, styles.machineImage]}>
                <Image
                  source={{
                    uri: "http://charldesign.com/project/maru/mock/washing-drying-l.png",
                  }}
                  resizeMode="contain"
                  style={styles.imgMachine}
                />
              </View>
              <View style={[styles.col, styles.machineInfo]}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingLeft: 4,
                  }}
                >
                  <View>
                    <Text style={styles.machineTitle}>เครื่องซัก/อบ</Text>
                    <Text style={styles.machineSize}>Size M</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingBottom: 12,
                    }}
                  >
                    <View style={styles.machineCapacity}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.xs,
                          fontWeight: FONTWEIGHT.regular,
                          color: COLORS.white,
                        }}
                      >
                        35 KG
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.col, styles.statusBox]}>
                <View style={[styles.status, styles.unavailable]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.regular,
                      color: COLORS.white,
                      textAlign: "center",
                    }}
                  >
                    22 นาที
                  </Text>
                </View>
                <View style={[styles.status, styles.unavailable]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.regular,
                      color: COLORS.white,
                      textAlign: "center",
                    }}
                  >
                    22 นาที
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Drying Size M */}
          <View style={[styles.machine, styles.bgDark]}>
            <View style={styles.row}>
              <View style={[styles.col, styles.machineImage, styles.pb2]}>
                <Image
                  source={{
                    uri: "http://charldesign.com/project/maru/mock/drying-m.png",
                  }}
                  resizeMode="contain"
                  style={[styles.imgMachine2]}
                />
              </View>
              <View style={[styles.col, styles.machineInfo]}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingLeft: 4,
                  }}
                >
                  <View>
                    <Text style={styles.machineTitle}>เครื่องอบ</Text>
                    <Text style={styles.machineSize}>Size M</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingBottom: 12,
                    }}
                  >
                    <View style={styles.machineCapacity}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.xs,
                          fontWeight: FONTWEIGHT.regular,
                          color: COLORS.white,
                        }}
                      >
                        14 KG
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.col, styles.statusBox]}>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Drying Size L*/}
          <View style={[styles.machine, styles.bgDark]}>
            <View style={styles.row}>
              <View style={[styles.col, styles.machineImage]}>
                <Image
                  source={{
                    uri: "http://charldesign.com/project/maru/mock/drying-l.png",
                  }}
                  resizeMode="contain"
                  style={styles.imgMachine3}
                />
              </View>
              <View style={[styles.col, styles.machineInfo]}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingLeft: 4,
                  }}
                >
                  <View>
                    <Text style={styles.machineTitle}>เครื่องอบ</Text>
                    <Text style={styles.machineSize}>Size L</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      paddingBottom: 12,
                    }}
                  >
                    <View style={styles.machineCapacity}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.xs,
                          fontWeight: FONTWEIGHT.regular,
                          color: COLORS.white,
                        }}
                      >
                        25 KG
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.col, styles.statusBox]}>
                <View style={[styles.status, styles.ready]}>
                  <Text
                    style={{
                      fontSize: FONTSIZE.md,
                      fontWeight: FONTWEIGHT.semibold,
                      color: COLORS.success,
                      textAlign: "center",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
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
    fontSize: FONTSIZE.sm,
    fontWeight: FONTWEIGHT.regular,
    textAlign: "center",
    lineHeight: 24,
  },
  machineTitle: {
    fontSize: FONTSIZE.md,
    fontWeight: FONTWEIGHT.semibold,
    lineHeight: 24,
    color: COLORS.white,
  },
  machineSize: {
    fontSize: FONTSIZE.sm,
    fontWeight: FONTWEIGHT.semibold,
    lineHeight: 18,
    color: COLORS.white,
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
    paddingTop: "140%",
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
});

export default StoreMap;
