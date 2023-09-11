import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
  TouchableHighlight
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// font
import { useFonts, Prompt_800ExtraBold } from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";
import { COLORS } from "../../../components/common/colors";

const ScanQR = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  let [fontsLoaded, error] = useFonts({
    Prompt_800ExtraBold,
  });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setLoading(true);
    let storeData = data?.split("!@#$")[1];
    setScanned(true);
    let deviceID = storeData?.split("||")[1]; // equipment id
    let storeIdData = storeData?.split("||")[0];

    if (scanned) {
      fetch(
          `https://api.marulaundry-kangyong.com/v2/equipment/${deviceID}/status`
        )
        .then((response) => response.json())
        .then((responseJson) => {
          // return store id and equipment id 
          const results = responseJson?.result;
          // case err code
          if (responseJson?.detail?.code) {
            setLoading(false);
            Alert.alert(responseJson?.detail?.content);
            return;
          }

          if (results?.status?.is_available) {
            setLoading(false);
            props.navigation.navigate("เลือกโปรแกรมซัก", {
              storeID:  storeIdData,
              equipmentId: deviceID,
            });
          } else {
            // เครื่องไม่ว่าง
            setLoading(false);
            setModalVisible(true);
            props.navigation.navigate("เลือกโปรแกรมซัก", {
              storeID:  storeIdData,
              equipmentId: deviceID,
              // equipmentId: 52, // mock up

            });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleBarCodeScannedAgain = async ({ type, data }) => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
    if (hasPermission) {
      setLoading(true);
      let storeData = data?.split("!@#$")[1];
      setScanned(true);
      let storeId = storeData?.split("||")[1];

      if (scanned || data) {
        fetch(
          `https://api.marulaundry-kangyong.com/v2/equipment/all/store/${
            storeData?.split("||")[0]
          }/status`
        )
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson?.detail?.code) {
              setLoading(false);
              Alert.alert(responseJson?.detail?.content);
              return;
            }

            const response = responseJson?.result?.find(
              (item) => item?.installed_device_id + "" === storeId
            );

            setData(responseJson?.result)
            if (response?.status?.is_available) {
              setLoading(false);
              props.navigation.navigate("เลือกโปรแกรมซัก", {
                storeID: storeData.split("||")[0],
                equipmentId: storeId,
                deviceId: response.id,
              });
            } else {
              // เครื่องไม่ว่าง
              setLoading(false);
              // setModalVisible(true);
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const findSuccessTime  = (minutesTime) => {
    const currentDate = new Date();
    // Define the number of minutes to add
    const minutesToAdd = +minutesTime;
    const futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000); // 60000 milliseconds in a minute
    const futureHours = futureDate.getHours();
    const futureMinutes = futureDate.getMinutes();
    return `${futureHours}:${futureMinutes}`
  }


  const mockDevice = async () => {
    setLoading(true)
   await fetch(
      `https://api.marulaundry-kangyong.com/v2/equipment/all/store/1003/status`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson?.detail?.code) {
          setLoading(false);
          Alert.alert(responseJson?.detail?.content);
          return;
        }

          setLoading(false);
          props.navigation.navigate("เลือกโปรแกรมซัก", {
            storeID: 1003,
            equipmentId: 44,
            deviceId: 44,
          });
      })
      .catch((error) =>{    setLoading(true)
        console.log(error)});
  };

  if (hasPermission === null) {
    return <Text></Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.holder}>
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "#fff",
          opacity: 0.8,
        }}
      >
        <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            focusable={true}
          />
        </View>
      </View>

      {scanned && (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,

            width: "100%",
          }}
        >
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handleBarCodeScannedAgain}
          >
            <Text style={styles.textStyle}>Scan Again</Text>
          </Pressable>
        </View>
      )}

      <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,

            width: "100%",
          }}
        >
          {/* <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={mockDevice}
          >
            <Text style={styles.textStyle}>Bypass Device ID:44 </Text>
          </Pressable> */}
        </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#AB4740"
          style={{
            zIndex: 9999,
            top: "30%",
            left: "50%",
            position: "absolute",
          }}
        />
      )}

      <View
        style={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 50,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
          }}
        >
            {/* mock scan device  */}
            {/* <TouchableHighlight
            style={styles.box}
            underlayColor={COLORS.white}
            onPress={mockDevice}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={styles.textStyle}>จ่ายเงิน</Text>
            </View>
          </TouchableHighlight> */}

          <Text style={{ fontFamily: "Prompt_800ExtraBold", fontSize: 16 }}>
            บริเวณ
          </Text>
          <Text style={{ fontFamily: "Prompt_800ExtraBold", fontSize: 16 }}>
            QR Code
          </Text>
        </View>

        <Image
          source={require("assets/wash.png")}
          resizeMode="cover"
          style={{
            height: 160,
          }}
        ></Image>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 700,
                color: "#AB4740",
                marginTop: 10,
              }}
            >
              กรุณาลองเครื่องอื่น
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 10 }}>
              เครื่องหมายเลข {data?.id}
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
                }}
              >
                {data?.remaining_time} 
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                marginTop: 10,
                marginBottom: 20,
              }}
            >
                เสร็จเวลา {findSuccessTime(+data?.remaining_time)} น.
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>ตกลง</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Later on in your styles..
const styles = StyleSheet.create({
  storeBackdrop: {
    display: "flex",
    width: "100%",
    paddingTop: "40%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  holder: {
    backgroundColor: "#ffffff",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  img: {
    width: 90,
    height: 100,
  },
  bgImage: {
    width: 290,
    height: 350,
    paddingTop: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
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
  button: {
    width: 200,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#AB4740",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  boxAdd: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 280,
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
});

export default ScanQR;
