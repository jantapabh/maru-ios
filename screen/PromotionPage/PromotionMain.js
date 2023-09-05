import { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFonts, Prompt_500Medium } from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";
import { COLORS } from "../../components/common/colors";

const PromotionMain = (props) => {
  const [promotionList, setPromotionList] = useState([]);
  const [loading, setLoading] = useState(false);

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
  });

  useEffect(() => {
    initialData();
  }, []);

  async function initialData() {
    setLoading(true);
    fetch(
      `https://api.marulaundry-kangyong.com/v2/remote/promotion/news/news-activated`
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        let newArr = [];
        if (responseJson?.result?.length) {
          responseJson?.result &&
            responseJson?.result.map(async (item) => {
              if (item?.image_url_title !== null) {
                newArr.push({
                  img: item.image_url_title,
                  id: item.id,
                });
                setTimeout(() => {
                  setPromotionList(newArr);
                  setLoading(false);
                }, 500);
              }
            });
        } else {
          setLoading(false);
          setPromotionList(newArr);
        }
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
      <ScrollView style={styles.container}>
        <View style={[styles.flexColumn, styles.pt3]}>
          {promotionList?.length > 0 ? (
            promotionList.map((item) => {
              return (
                <TouchableHighlight
                  key={item.id}
                  underlayColor={COLORS.transparent}
                  style={{  marginBottom: 16, paddingBottom: 0 }}
                  onPress={() =>
                    props.navigation.navigate(`PromotionDetail`, {
                      id: item.id,
                    })
                  }
                >
                  <Image
                    key={item.id}
                    resizeMode="cover"
                    style={[styles.imgPromotion, styles.shadowProp]}
                    source={{ uri: item.img }}
                  />
                </TouchableHighlight>
              );
            })
          ) : (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Text>ไม่มีข้อมูลโปรโมชั่นและข่าวสาร</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  holder: {
    backgroundColor: "#ffffff",
    height: "100%",
  },
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  pt3: {
    paddingTop: 16,
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
    fontFamily: "Prompt_500Medium",
  },
  imgPromotion: {
    borderRadius: 8,
  },
  shadowProp: {
    shadowOpacity: 0.5,
    shadowRadius: 4,
    height: 200,
  },
  elevation: {
    elevation: 20,
    shadowColor: "#52006A",
  },
  imgUrl: {
    // padding: 80
  }
});

export default PromotionMain;
