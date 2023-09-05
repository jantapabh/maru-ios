import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableHighlight,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
  Prompt_700Bold,
} from "@expo-google-fonts/prompt";

// local
import AppLoading from "expo-app-loading";

const PaymentCredit = (props) => {
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
    Prompt_700Bold,
  });

  const addCard = () => {
    props.navigation.navigate("FormPaymentCredit");
  };

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
            fontFamily: "Prompt_700Bold",
            textAlign: "center",
            justifyContent: "center",
            lineHeight: 24,
            marginBottom: 10,
          }}
        >
          คุณไม่มีบัตรเดบิต/เครดิต{" "}
        </Text>

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableHighlight
            style={styles.box}
            underlayColor={COLORS.dark}
            onPress={addCard}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={styles.textStyle}>เพิ่มบัตร</Text>
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
    width: 170,
    backgroundColor: "#393A3A",
  },
  textStyle: {
    fontFamily: "Prompt_500Medium",
    color: "#fff",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentCredit;
