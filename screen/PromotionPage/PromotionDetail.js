import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { COLORS } from "../../components/common/colors";
import { useEffect, useState } from "react";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_400Regular,
  Prompt_700Bold,
  Prompt_600SemiBold,
} from "@expo-google-fonts/prompt";

const PromotionDetail = ({ route, navigation }) => {
  // get params
  const { id } = route?.params || 0;
  const [promotion, setPromotion] = useState({});
  const [loading, setLoading] = useState(false);
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_400Regular,
    Prompt_700Bold,
    Prompt_600SemiBold,
  });

  useEffect(() => {
    initialData();
  }, [id]);

  async function initialData() {
    setLoading(true)
    fetch(`https://api.marulaundry-kangyong.com/v2/remote/promotion?id=${id}`)
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log("XXXXXX; ",responseJson.data[0]);
        setTimeout(() => {
          setLoading(false)
          setPromotion({
            id: responseJson.data[0].id,
            promotion_name: responseJson.data[0].promotion_name,
            image_detail: responseJson.data[0]?.image_url_detail,
            promotion_detail: responseJson.data[0].promotion_detail,
          });
        }, 500);
      })
      .catch((error) => console.log(error));
  }


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
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
      <ScrollView>
        <Image
          style={styles.imgFluid}
          resizeMode="cover"
          source={{
            uri:
               promotion.image_detail,
          }}
        />
        <View style={styles.py3}>
          <View style={styles.container}>
            <View style={styles.mb3}>
              <Text style={styles.titleText}>{promotion?.promotion_name}</Text>
            </View>
            <Text style={styles.contentText}>
              {promotion?.promotion_detail}
            </Text>
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
    // flex: 1
  },
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  py3: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  mb3: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: "Prompt_600SemiBold",
    lineHeight: 28,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.body,
    fontFamily: "Prompt_400Regular",
    marginBottom: 8,
  },
  imgFluid: {
    width: "100%",
    paddingTop: "125%",
  },
  imgPromotion: {
    paddingTop: 42,
    borderRadius: 8,
    marginBottom: 8,
  },
  shadowProp: {
    shadowOpacity: 0.5,
    shadowRadius: 4,
    height: 200,
  },
});

export default PromotionDetail;
