import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, CommonActions } from "@react-navigation/native";

// pages
import HomeScreen from "./screen/HomePage/HomePageMain";
import PromotionScreen from "./screen/PromotionPage/PromotionMain";
import PromotionDetail from "./screen/PromotionPage/PromotionDetail";
import ProfileScreen from "./screen/ProfilePage/ProfileMain";
import ProfileDetail from "./screen/ProfilePage/ProfileDetail";

// profile
import FormChange from "./screen/ProfilePage/ChangePhoneNumber/FormChange";
import FormChangeConfirm from "./screen/ProfilePage/ChangePhoneNumber/FormComfirm";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// auth
import ListProgram from "./screen/HomePage/ListProgram";
import ProgramDetail from "./screen/HomePage/ProgramDetail";
import StoreMap from "./screen/StorePage/StoreMap";
import LoginPage from "./screen/LoginPage/LoginPage";
import LoginPageWithPhone from "./screen/LoginPage/LoginWithPhone";
import LoginWithOtp from "./screen/LoginPage/LoginWithOtp";
import PolicyDetail from "./screen/PolicyPage/PolicyDetail";
import RegisterForm from "./screen/RegisterPage/RegisterForm";
import RegisterStatus from "./screen/RegisterPage/RegisterStatus";
import MapScreen from "./screen/MapScreen/MapScreen";
//test mockup
import PaymentPage from "./screen/HomePage/Payment";
// fonst
import {
  useFonts,
  Prompt_500Medium,
  Prompt_600SemiBold,
  Prompt_400Regular,
  Prompt_700Bold,
} from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";
import { SvgXml } from "react-native-svg";
import jwt_decode from "jwt-decode";
import PaymentCredit from "./screen/HomePage/PaymentCredit";
import FormPaymentCredit from "./screen/HomePage/FormPaymentCredit";
import SelectPaymentCredit from "./screen/HomePage/SelectPaymentCredit";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { initializeApp } from 'firebase/app';

// messaging
// import messaging from '@react-native-firebase/messaging';

// const firebaseConfig = {
//   apiKey: "AIzaSyDhkTLBVTMTiu3OyJPyYe8olgPqeHZVjj0",
//   authDomain: "kangyong-laundry.firebaseapp.com",
//   projectId: "kangyong-laundry",
//   storageBucket: "kangyong-laundry.appspot.com",
//   messagingSenderId: "1016008093976",
//   appId: "1:1016008093976:web:af7712a9c82bd9246e2e6d",
//   measurementId: "G-02RHW4Y366"
// };

// initializeApp(firebaseConfig);

// async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }
// }

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const svgArrowLeftGray = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.3334 14.667H9.52004L14.36 8.8537C14.5864 8.58141 14.6952 8.23037 14.6627 7.8778C14.6302 7.52523 14.459 7.20002 14.1867 6.9737C13.9144 6.74738 13.5634 6.6385 13.2108 6.67101C12.8582 6.70351 12.533 6.87475 12.3067 7.14704L5.64004 15.147C5.59519 15.2107 5.55508 15.2775 5.52004 15.347C5.52004 15.4137 5.52004 15.4537 5.42671 15.5204C5.36627 15.6732 5.33463 15.836 5.33337 16.0004C5.33463 16.1648 5.36627 16.3275 5.42671 16.4804C5.42671 16.547 5.42671 16.587 5.52004 16.6537C5.55508 16.7232 5.59519 16.7901 5.64004 16.8537L12.3067 24.8537C12.4321 25.0042 12.5891 25.1253 12.7665 25.2082C12.9439 25.2912 13.1375 25.334 13.3334 25.3337C13.6449 25.3343 13.9468 25.2258 14.1867 25.027C14.3217 24.9151 14.4333 24.7776 14.5151 24.6225C14.5969 24.4674 14.6473 24.2976 14.6634 24.123C14.6795 23.9484 14.661 23.7723 14.609 23.6048C14.5569 23.4373 14.4723 23.2818 14.36 23.147L9.52004 17.3337H25.3334C25.687 17.3337 26.0261 17.1932 26.2762 16.9432C26.5262 16.6931 26.6667 16.354 26.6667 16.0004C26.6667 15.6467 26.5262 15.3076 26.2762 15.0576C26.0261 14.8075 25.687 14.667 25.3334 14.667Z" fill="#393A3A"/>
</svg>`;

const svgArrowLeftWhite = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.3333 14.667H9.51992L14.3599 8.8537C14.5862 8.58141 14.6951 8.23037 14.6626 7.8778C14.6301 7.52523 14.4589 7.20002 14.1866 6.9737C13.9143 6.74738 13.5633 6.6385 13.2107 6.67101C12.8581 6.70351 12.5329 6.87475 12.3066 7.14704L5.63992 15.147C5.59507 15.2107 5.55496 15.2775 5.51992 15.347C5.51992 15.4137 5.51992 15.4537 5.42659 15.5204C5.36615 15.6732 5.33451 15.836 5.33325 16.0004C5.33451 16.1648 5.36615 16.3275 5.42659 16.4804C5.42659 16.547 5.42659 16.587 5.51992 16.6537C5.55496 16.7232 5.59507 16.7901 5.63992 16.8537L12.3066 24.8537C12.4319 25.0042 12.5889 25.1253 12.7664 25.2082C12.9438 25.2912 13.1374 25.334 13.3333 25.3337C13.6448 25.3343 13.9467 25.2258 14.1866 25.027C14.3216 24.9151 14.4332 24.7776 14.515 24.6225C14.5968 24.4674 14.6472 24.2976 14.6633 24.123C14.6794 23.9484 14.6609 23.7723 14.6088 23.6048C14.5568 23.4373 14.4722 23.2818 14.3599 23.147L9.51992 17.3337H25.3333C25.6869 17.3337 26.026 17.1932 26.2761 16.9432C26.5261 16.6931 26.6666 16.354 26.6666 16.0004C26.6666 15.6467 26.5261 15.3076 26.2761 15.0576C26.026 14.8075 25.6869 14.667 25.3333 14.667Z" fill="white"/>
</svg>
`;

const svgArrowLeftNormal = `<svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.46875 7.94414C-0.15625 8.53008 -0.15625 9.48164 0.46875 10.0676L8.46875 17.5676C9.09375 18.1535 10.1087 18.1535 10.7337 17.5676C11.3587 16.9816 11.3587 16.0301 10.7337 15.4441L3.86375 9.00352L10.7288 2.56289C11.3538 1.97695 11.3538 1.02539 10.7288 0.439453C10.1038 -0.146484 9.08875 -0.146484 8.46375 0.439453L0.46375 7.93945L0.46875 7.94414Z" fill="white"/>
</svg>`;

// svg
const SvgArrowGray = ({ style }) => {
  return <SvgXml style={style} xml={svgArrowLeftGray} />;
};

const SvgArrowNormal = ({ style }) => {
  return <SvgXml style={style} xml={svgArrowLeftNormal} />;
};

const SvgArrowWhiteNormal = ({ style }) => {
  return <SvgXml style={style} xml={svgArrowLeftWhite} />;
};

function HomeTabs(props) {
  const [ accessTokenExpire, setAccessTokenExpire] = useState("")
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_400Regular,
  });

  useEffect(() => {
    handleAuth();
  }, []);

  // check expire token
  const handleAuth = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    setAccessTokenExpire(accessToken)
    if (checkExpire(accessToken)) {
      if (accessToken) {
        AsyncStorage.removeItem("access_token");
      }
    } 
  };

  const checkExpire = (token) => {
    const decodedToken = jwt_decode(token);
    const expirationTime = decodedToken?.exp;
    const currentTime = Date.now() / 1000;
    if (expirationTime < currentTime) {
      return true;
    } else {
      return false;
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: Platform.OS === "ios" ? 110 : 70,
        },
        headerStyle: { backgroundColor: "#913F3A" },
        headerTintColor: "#FFFFFF",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "หน้าแรก") {
            iconName = (
              <Feather
                name="home"
                size={28}
                color={focused ? "#AB4740" : "#C9C9C9"}
              />
            );
          } else if (route.name === "ร้าน") {
            iconName = (
              <FontAwesome5
                name="store"
                size={28}
                color={focused ? "#AB4740" : "#C9C9C9"}
              />
            );
          } else if (route.name === "โปรโมชั่น") {
            iconName = (
              <MaterialCommunityIcons
                name="brightness-percent"
                size={28}
                color={focused ? "#AB4740" : "#C9C9C9"}
              />
            );
          } else if (route.name === "โปรไฟล์") {
            iconName = (
              <FontAwesome5
                name="user"
                size={28}
                color={focused ? "#AB4740" : "#C9C9C9"}
              />
            );
          }
          return iconName;
        },
        tabBarLabelStyle: {
          fontFamily: "Prompt_500Medium",
          fontSize: 13,
        },
        headerTitle: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "หน้าแรก") {
            iconName = "หน้าแรก";
          } else if (route.name === "ร้าน") {
            iconName = "ร้าน";
          } else if (route.name === "โปรโมชั่น") {
            iconName = "โปรโมชั่น และข่าวสาร";
          } else if (route.name === "โปรไฟล์") {
            iconName = "โปรไฟล์";
          }
          return iconName ? <Text style={styles.text}>{iconName}</Text> : null;
        },
        tabBarActiveTintColor: "#AB4740",
        tabBarInactiveTintColor: "#A8A8A8",
      })}
    >
      {/* Tab หลัก */}
      <Tab.Screen
        name="หน้าแรก"
        options={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: "#AB4740",
            borderBottomWidth: 0,
            borderBottomColor: "#AB4740",
          },
          headerBackTitleVisible: false,
          headerShown: false,
          headerTitle: route.params,
          headerTitleStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "Prompt_600SemiBold",
            alignItems: "center",
          },
          headerTitleAlign: "center",
        })}
        component={HomeScreen}
      />
      <Tab.Screen
        name="ร้าน"
        options={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: "#AB4740",
            borderBottomWidth: 0,
            height: "0%",
            borderBottomColor: "#AB4740",
            height: Platform.OS !== "ios" ? 90 : 100,
          },
          headerBackTitleVisible: Platform.OS === "ios" && false,
          headerShown: true,
          headerTitle: route.params,
          headerTitleStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "Prompt_600SemiBold",
            alignItems: "center",
          },
          headerTitleAlign: "center",
        })}
        component={MapScreen}
      />
      <Tab.Screen
        name="โปรโมชั่น"
        options={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: "#AB4740",
            borderBottomWidth: 0,
            height: "0%",
            borderBottomColor: "#AB4740",
          },
          headerBackImage: () => (
            <SvgArrowNormal
              style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
            />
          ),
          headerBackTitleVisible: false,
          headerTitleStyle: { color: "#fff" },
          headerStyle: { backgroundColor: "#AB4740" },
          headerShown: true,
          headerTitle: "โปรโมชั่น และข่าวสาร",
          headerTitleStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "Prompt_600SemiBold",
          },
          headerStyle: {
            backgroundColor: "#AB4740",
            height: Platform.OS !== "ios" ? 90 : 120,
          },
          headerTitleAlign: "center",
        })}
        component={PromotionScreen}
      />
      <Tab.Screen
        name="โปรไฟล์"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: "#AB4740",
            borderBottomWidth: 0,
            height: "0%",
            borderBottomColor: "#AB4740",
          },
          headerTitleStyle: { color: "#fff" },
          headerStyle: { backgroundColor: "#AB4740" },
          headerShown: true,
          headerTitle: "โปรไฟล์",
          headerTitleStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "Prompt_600SemiBold",
          },
          headerStyle: {
            backgroundColor: "#AB4740",
            height: Platform.OS !== "ios" ? 90 : 120,
          },
          headerTitleAlign: "center",
        })}
      />
    </Tab.Navigator>
  );
}

const App = (props) => {
  const [accessTokenUser, setAccessTokenUser] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [ accessTokenExpire, setAccessTokenExpire] = useState("")

  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
    Prompt_400Regular,
  });

  useEffect(() => {
    handleAuth();
    getSession();
  }, []);

  const getSession = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      console.log(accessToken);
      // call api
      fetch(`https://api.marulaundry-kangyong.com/v2/user/auth/current_session`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson?.user !== "") {
            setUserId(responseJson?.user);
          }
        })
        .catch((error) => console.log(error));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleAuth();
  }, [accessTokenExpire]);

 const handleAuth = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    if (checkExpire(accessToken)) {
      AsyncStorage.removeItem("access_token");
      props?.navigation.navigate("Login");
      
    }
    if (accessToken !== "" && !checkExpire(accessToken)) {
      setAccessTokenUser(accessToken);
      setAccessTokenExpire(accessToken)
    }
  };

  const checkExpire = (token) => {
    const decodedToken = jwt_decode(token);
    const expirationTime = decodedToken?.exp;
    const currentTime = Date.now() / 1000;
    if (expirationTime < currentTime) {
      return true;
    } else {
      return false;
    }
  };

  const toggleModal = async () => {
    setModalVisible(true);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const screenOptions = {
    headerTintColor: "#fff",
    headerStyle: { backgroundColor: "#ff005d" },
    headerBackImage: () => (
      <FontAwesome5 name="arrow-alt-circle-left" size={24} color="#000" />
    ),
  };

  const handleShowDelete = () => {
    toggleModal();
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={accessTokenUser !== "" ? "Home" : "Login"}
      >
        {/* หน้า home */}
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeTabs}
        />
        {/* หน้าสแกน */}
        <Stack.Screen
          name="เลือกโปรแกรมซัก"
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
            },
            headerShown: true,
            headerTitle: "เลือกโปรแกรมซัก",
            headerTitleStyle: {
              color: "#fff",
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
            },
            headerTitleAlign: "center",
          })}
          component={ListProgram}
        />

        <Stack.Screen
          name="SelectPaymentCredit"
          component={SelectPaymentCredit}
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleShowDelete}>
                <Text
                  style={{
                    marginRight: 25,
                    color: "#fff",
                    fontSize: 20,
                    fontFamily: "Prompt_400Regular",
                  }}
                >
                  ลบ
                </Text>
              </TouchableOpacity>
            ),
            headerBackTitleVisible: false,
            headerBackTitleVisible: Platform.OS === "ios" && false,
            headerTitleStyle: { color: "#fff" },
            headerShown: true,
            headerTitle: "เลือกบัตร",
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
              height: Platform.OS !== "ios" ? 90 : 120,
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
            },
            headerTitleAlign: "center",
          })}
        />

        <Stack.Screen
          name="ชำระเงิน"
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
            },
            headerShown: true,
            headerTitle: "ชำระเงิน",
            headerTitleStyle: {
              color: "#fff",
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
            },
            headerTitleAlign: "center",
          })}
          component={ProgramDetail}
        />
        {/* ไปหน้าอื่นแบบไม่มี tab */}
        <Stack.Screen
          name="ข้อมูลส่วนตัว"
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: Platform.OS === "ios" && false,
            headerStyle: {
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
              backgroundColor: "#AB4740",
              height: Platform.OS !== "ios" ? 90 : 120,
            },
            headerShown: true,
            headerTitle: "ข้อมูลส่วนตัว",
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
            },
            headerTitleAlign: "center",
          })}
          component={ProfileDetail}
        />
        <Stack.Screen
          name="เปลี่ยนหมายเลขโทรศัพท์"
          options={({ navigation, route }) => ({
            // headerBackImage: () => <SvgArrowNormal />,
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: false,
            headerBackTitleVisible: Platform.OS === "ios" && false,
            headerTitleStyle: { color: "#fff" },
            headerShown: true,
            headerTitle: "เปลี่ยนหมายเลขโทรศัพท์",
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
              height: Platform.OS !== "ios" ? 90 : 120,
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
            },
            headerTitleAlign: "center",
          })}
          component={FormChange}
        />
        <Stack.Screen
          name="ChangePhoneComfirm"
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: Platform.OS === "ios" && false,
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
            },
            headerShown: true,
            headerTitle: "เปลี่ยนหมายเลขโทรศัพท์",
            headerTitleStyle: {
              color: "#fff",
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
            },
            headerTitleAlign: "center",
          })}
          component={FormChangeConfirm}
        />
        {/* PromotionDetail */}
        <Stack.Screen
          name="PromotionDetail"
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              height: "0%",
              borderBottomColor: "#AB4740",
            },
            headerTitleStyle: { color: "#fff" },
            headerStyle: { backgroundColor: "#AB4740" },
            headerShown: true,
            headerTitle: "โปรโมชั่น และข่าวสาร",
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
              height: Platform.OS !== "ios" ? 90 : 120,
            },
            headerTitleAlign: "center",
          })}
          component={PromotionDetail}
        />

        <Stack.Screen
          name="PaymentCredit"
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              height: "0%",
              borderBottomColor: "#AB4740",
            },
            headerTitleStyle: { color: "#fff" },
            headerStyle: { backgroundColor: "#AB4740" },
            headerShown: true,
            headerTitle: "เลือกบัตร",
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
              height: Platform.OS !== "ios" ? 90 : 120,
            },
            headerTitleAlign: "center",
          })}
          component={PaymentCredit}
        />

        <Stack.Screen
          name="FormPaymentCredit"
          component={FormPaymentCredit}
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerBackTitleVisible: false,
            headerBackTitleVisible: Platform.OS === "ios" && false,
            headerTitleStyle: { color: "#fff" },
            headerShown: true,
            headerTitle: "เพิ่มบัตร",
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#AB4740",
              height: Platform.OS !== "ios" ? 90 : 120,
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
            },
            headerTitleAlign: "center",
          })}
        />

        {/* auth */}
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginPage}
        />
        <Stack.Screen
          name="LoginWithPhone"
          options={{ headerShown: false }}
          component={LoginPageWithPhone}
        />
        <Stack.Screen
          name="LoginWithOtp"
          options={({ navigation, route }) => ({
            headerBackImage: () => (
              <SvgArrowWhiteNormal style={{ marginTop: 40, marginLeft: 10 }} />
            ),
            headerStyle: {
              height: 0,
            },
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            headerTitle: "",
            headerTitleAlign: "center",
          })}
          component={LoginWithOtp}
        />
        {/* consent */}
        <Stack.Screen
          name="Consent"
          component={PolicyDetail}
          options={({ navigation, route }) => ({
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        {
                          name: "LoginWithOtp",
                        },
                      ],
                    })
                  );
                }}
              >
                <SvgArrowGray style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomColor: "#AB4740",
            },
            headerTitle: () => (
              <View style={{ marginTop: 20, marginBottom: 10 }}>
                <Text
                  style={{
                    color: "#AB4740",
                    fontSize: 24,
                    fontFamily: "Prompt_600SemiBold",
                  }}
                >
                  เงื่อนไขและข้อตกลง
                </Text>
                <Text
                  style={{
                    color: "#AB4740",
                    fontSize: 24,
                    fontFamily: "Prompt_600SemiBold",
                  }}
                >
                  การยินยอมให้ข้อมูล
                </Text>
              </View>
            ),
            headerTitleStyle: {
              color: "#AB4740",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#fff",
              height: Platform.OS !== "ios" ? 100 : 140,
              fontFamily: "Prompt_500Medium",
            },
          })}
        />
        <Stack.Screen
          name="ลงทะเบียน"
          options={({ navigation, route }) => ({
            headerBackImage: () => <SvgArrowGray />,
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              height: "0%",
              borderBottomColor: "#AB4740",
            },
            headerShown: true,
            headerTitle: "ลงทะเบียน",
            headerTitleStyle: {
              color: "#AB4740",
              fontSize: 24,
              fontFamily: "Prompt_600SemiBold",
            },
            headerStyle: {
              backgroundColor: "#fff",
              height: Platform.OS !== "ios" ? 90 : 120,
              fontFamily: "Prompt_500Medium",
            },
            headerTitleAlign: "center",
          })}
          component={RegisterForm}
        />
        <Stack.Screen
          name="RegisterStatus"
          options={{ headerShown: false }}
          component={RegisterStatus}
        />
        <Stack.Screen
          name="Payment"
          options={({ navigation, route }) => ({
            headerBackTitleVisible: Platform.OS === "ios" && false,
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
              height: Platform.OS !== "ios" ? 100 : 120,
            },
            headerShown: true,
            title: "QR Code",
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            headerTitle: route.params,
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
              alignItems: "center",
            },
            headerTitleAlign: "center",
          })}
          component={PaymentPage}
        />
        <Stack.Screen
          name="Store"
          component={StoreMap}
          options={({ navigation, route }) => ({
            headerBackTitleVisible: Platform.OS === "ios" && false,
            headerBackImage: () => (
              <SvgArrowNormal
                style={{ marginLeft: Platform.OS === "ios" ? 15 : 0 }}
              />
            ),
            headerStyle: {
              backgroundColor: "#AB4740",
              borderBottomWidth: 0,
              borderBottomColor: "#AB4740",
              height: Platform.OS !== "ios" ? 90 : 100,
            },
            headerShown: true,
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            headerTitle: route.params,
            headerTitleStyle: {
              color: "#fff",
              fontSize: 20,
              fontFamily: "Prompt_600SemiBold",
              alignItems: "center",
            },
            headerTitleAlign: "center",
          })}
        />
      </Stack.Navigator>

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
                  fontFamily: "Prompt_700Bold",
                }}
              >
                ยืนยันการลบบัตร
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 10,
                  fontFamily: "Prompt_500Medium",
                }}
              >
                **** **** **** 1234
              </Text>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!isModalVisible)}
              >
                <Text style={styles.textStyle}>ยืนยัน</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonCloseCancel]}
                onPress={() => setModalVisible(!isModalVisible)}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: "Prompt_500Medium",
                  }}
                >
                  ยกเลิก
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontFamily: "Prompt_500Medium",
    fontSize: 10,
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
    marginTop: 20,
  },
  buttonCloseCancel: {
    backgroundColor: "#fff",
    marginTop: 10,
    color: "#000",
    borderWidth: 1,
    borderColor: "#D0D5DD",
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
});

export default App;
