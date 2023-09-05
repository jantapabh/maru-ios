import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Linking,
  Image,
  View,
  TouchableHighlight,
  Alert,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
} from "@expo-google-fonts/prompt";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

const PaymentPage = (props) => {
  const [qrCode, setQrCode] = useState("");
  const [dataResponse, setDataResponse] = useState({});
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
  });
  const {
    storeID,
    deviceId,
    courseId,
    result,
    ref,
    operation_token,
    settlement,
    model_code,
    unit_no,
    type,
    ref1
  } = props?.route?.params || "";

  useEffect(() => {
    initialData();
  }, []);

  const initialData = () => {
    if (result) {
      setQrCode(result.data.qrImage);
    }
  };

  const MINUTE_MS = 10000;
  useEffect(() => {
    const interval = setInterval(() => {
      checkStatusPayment();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);


  const checkStatusPayment = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      // call api
      fetch(`https://api.marulaundry-kangyong.com/v2/payment/check-status/${ref}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson?.result?.payment_success) {
            lockDevice();
          }
        })
        .catch((error) => console.log(error));
    } catch (err) {
      console.log(err);
    }
  };

  const lockDevice = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const payload = {
        device_id: deviceId,
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
          if (responseJson) {
            props.navigation.navigate("หน้าแรก", {
              transaction_success: true,
              unit_no: unit_no,
            });
          }
        })
        .catch((error) => console.log(error));
    } catch (err) {
      console.log(err);
    }
  };

  const dowloadImage = async () => {
    const base64Code = qrCode;
    const filename = FileSystem.documentDirectory + "some_unique_file_name.png";
    await FileSystem.writeAsStringAsync(filename, base64Code, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const mediaResult = await MediaLibrary.saveToLibraryAsync(filename);
    setTimeout(() => {
      Alert.alert("บันทึกรุปภาพเสร็จสิ้น")
    }, 1000);
  };

  const payWithAPI = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const payload = {
        "payment_success": true,
        "equipment_success": true,
        "paid_amount": 100 // แก้จำนวนเงินจ่าย
      };
      
      const refIDPayment = await AsyncStorage.getItem("refID");

      // call api
      fetch(`https://api.marulaundry-kangyong.com/v2/payment/2cedab4a48713cfcf632/_scb/edit_trans/${refIDPayment}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson) {
                        // mock Update
            await addMyEquiment()
            await checkStatusPayment()
          }
        })
        .catch((error) => console.log(error));
    } catch (err) {
      console.log(err);
    }
  };


  const addMyEquiment = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const payload = {
        "user_id": "154d5d68-f73d-4c4b-82bc-29bd2162efb0",
        "transaction_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "store_id": 1003,
        "device_id": 44,
        "model_name": "SF-155GL",
        "course_id": 1,
        "course": "wash and dry",
        "amount": "140",
        "settlement": [
          {"type": "1", "amount": 120}  
        ],
        "timestamp_remaining_time": 1
      };

      // call api
      fetch(`https://api.marulaundry-kangyong.com/v2/equipment/all/add-my-equipment`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson) {
            // await checkStatusPayment()
            // // mock Update
            // await addMyEquiment()
            // link to page
            props.navigation.navigate("หน้าแรก", {
              transaction_success: true,
              unit_no: unit_no,
              deviceId: responseJson?.device_id,
              remaining_time: responseJson?.timestamp_remaining_time
            });

          }
        })
        .catch((error) => console.log(error));
    } catch (err) {

    }
  }


  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.holder}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Prompt_400Regular",
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 10,
          }}
        >
          กรุณาทำรายการภายใน 5 นาที
        </Text>

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable style={[styles.button, styles.buttonClose]}>
            <Image
              source={{ uri: `data:image/jpg;base64,` + qrCode }}
              resizeMode="contain"
              style={[styles.bgImage, styles.imgPromotion]}
            />
          </Pressable>
          
          <TouchableHighlight
            style={styles.box}
            underlayColor={COLORS.white}
            onPress={dowloadImage}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Image
                style={styles.dowloadImg}
                resizeMode="contain"
                source={require("assets/dowload.png")}
              />
              <Text style={styles.textStyle}>บันทึกรูปภาพ</Text>
            </View>
          </TouchableHighlight>

          {/* pay with api */}
          <TouchableHighlight
            style={styles.box}
            underlayColor={COLORS.white}
            onPress={payWithAPI}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={styles.textStyle}>จ่ายเงิน</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Later on in your styles..
const styles = StyleSheet.create({
  dowloadImg: {
    width: 17,
    height: 17,
    marginRight: 5,
  },
  holder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 12,
    backgroundColor: "#fff",
  },
  bgImage: {
    width: 265,
    height: 257,
  },
  box: {
    borderColor: "#969696",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: 180,
  },
  textStyle: {
    fontFamily: "Prompt_500Medium",
  },
});

export default PaymentPage;
