import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  Image,
  View,
  TouchableHighlight,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
} from "@expo-google-fonts/prompt";

// local
import AppLoading from "expo-app-loading";

const SelectPaymentCredit = (props) => {
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
  });
  const { data } = props?.route?.params || "";

  const selectGardVisa = () => {};

  const selectGardMaster = () => {};

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.holder}>
      <View
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "flex-start",
          flexDirection: "column",
          width: "90%",
        }}
      >
        <TouchableHighlight
          style={styles.box}
          underlayColor={COLORS.white}
          onPress={selectGardVisa}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Image
              style={styles.qrcodeImage}
              resizeMode="contain"
              source={require("assets/visa.png")}
            />
            <Text style={styles.textStyle}>**** **** **** 1234</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.box}
          underlayColor={COLORS.white}
          onPress={selectGardMaster}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Image
              style={styles.qrcodeImage}
              resizeMode="contain"
              source={require("assets/master.png")}
            />
            <Text style={styles.textStyle}>**** **** **** 5678</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

// Later on in your styles..
const styles = StyleSheet.create({
  qrcodeImage: {
    width: 23,
    height: 23,
    marginRight: 10,
  },
  dowloadImg: {
    width: 17,
    height: 17,
    marginRight: 5,
  },
  holder: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  bgImage: {
    width: 265,
    height: 257,
  },
  box: {
    borderColor: "#FFFFFF",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    width: "100%",
    height: 58,
  },
  textStyle: {
    fontFamily: "Prompt_400Regular",
    fontSize: 16,
  },
});

export default SelectPaymentCredit;
