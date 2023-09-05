import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  Switch,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// fonst
import { useFonts, Prompt_500Medium } from "@expo-google-fonts/prompt";
import AppLoading from "expo-app-loading";

// uplaod
import * as ImagePicker from "expo-image-picker";

// local
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileMain = (props) => {
  const [profile, setProfile] = useState({});
  let [fontsLoaded, error] = useFonts({
    Prompt_500Medium,
  });
  const [pickedImagePath, setPickedImagePath] = useState(null);
  const [profileImg, setProfileImg] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initialData();
  }, []);

  useEffect(() => {
    const unsbscribe = props.navigation.addListener("focus", () => {
      initialData();
    });
    return unsbscribe;
  });

  async function initialData() {
    const accessToken = await AsyncStorage.getItem("access_token");
    fetch(`https://api.marulaundry-kangyong.com/v2/user/profile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        setProfile(responseJson.result);
        let img = await getImage(responseJson.result.image_profile);
        // setTimeout(() => {
        setProfileImg(img.split(",")[1]);
        // }, 1000);
      })
      .catch((error) => console.log(error));
  }

  async function logout() {
    const accessToken = await AsyncStorage.getItem("access_token");
    //delete access_revoke
    fetch(`https://api.marulaundry-kangyong.com/v2/user/auth/access_revoke`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer" + accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // delete refresh token
        fetch(`https://api.marulaundry-kangyong.com/v2/user/auth/refresh_revoke`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer" + accessToken,
          },
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson) {
              setTimeout(() => {
                if (accessToken) {
                  AsyncStorage.removeItem("access_token");
                }
                setModalVisible(false);
                Alert.alert("Logout Success!");
                props.navigation.navigate("Login");
              }, 500);
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ base64:true });
    if (result.canceled) {
      return;
    }
    // Explore the result
    if (result?.assets) {
      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop();
      // Infer the type of the image
      setPickedImagePath(result?.assets[0]?.uri);
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      const formData = new FormData();
      formData.append("file", {
        uri:
          Platform.OS === "android"
            ? localUri
            : localUri.replace("file://", ""),
        name: filename,
        type,
      });
      const accessToken = await AsyncStorage.getItem("access_token");
      fetch(`https://api.marulaundry-kangyong.com/v2/user/image-profile`, {
        body: formData,
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8; boundary=------random-boundary",
          Authorization: "Bearer " + accessToken,
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (
            responseJson?.message?.includes(
              "The data has been saved successfully."
            )
          ) {
            // refresh data
            initialData();
            // alert
            Alert.alert(responseJson.message);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const getImage = async (path) => {
    const accessToken = await AsyncStorage.getItem("access_token");
    return fetch(
      `https://api.marulaundry-kangyong.com/v2/file/download/profile/${path}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "image/jpeg",
        },
      }
    ).then((response) => {
      return response
        .blob()
        .then((data) => {
          let reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.onload = (event) => {
              return resolve(event.target.result);
            };
            reader.onerror = (event) => {
              return reject(event);
            };
            reader.readAsDataURL(data);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.pageWrap}>
      <ScrollView style={styles.container}>
        <View style={styles.profile}>
          <View style={styles.profileInner}>
            <Image
              style={styles.profileAvatar}
              source={{
                uri:
                  pickedImagePath !== null
                    ? pickedImagePath
                    : `data:image/jpg;base64,` + profileImg,
              }}
            />
            <TouchableHighlight
              style={[styles.btnUpload, styles.shadowProp]}
              onPress={showImagePicker}
            >
              <FontAwesome name="camera" size={18} color="#393A3A" />
            </TouchableHighlight>
          </View>
          <Text style={styles.nameText}>
            {profile?.firstname} {profile?.lastname}
          </Text>
        </View>

        <View style={styles.listGroup}>
          <View style={styles.listItem}>
            <Text style={styles.listText}>การแจ้งเตือน</Text>
            <Switch
              trackColor={{ false: "#eeeeee", true: "#34C759" }}
              thumbColor={"white"}
              activeThumbColor={"white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() =>
                setProfile({ ...profile, is_active: !profile?.is_active })
              }
              value={profile?.is_active}
            />
          </View>
          <View style={styles.divider} />
          <TouchableHighlight
            underlayColor="rgba(0,0,0,0.2)"
            onPress={() => props.navigation.navigate("เปลี่ยนหมายเลขโทรศัพท์")}
          >
            <View style={styles.listItem}>
              <Text style={styles.listText}>เปลี่ยนเบอร์โทร</Text>
              <FontAwesome name="angle-right" size={24} color="#B6B6B6" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="rgba(0,0,0,0.2)"
            onPress={() => props.navigation.navigate("ข้อมูลส่วนตัว")}
          >
            <View style={styles.listItem}>
              <Text style={styles.listText}>ข้อมูลส่วนตัว</Text>
              <FontAwesome name="angle-right" size={24} color="#B6B6B6" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="rgba(0,0,0,0.2)"
            onPress={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.listItem}>
              <Text style={styles.listText}>ออกจากระบบ</Text>
            </View>
          </TouchableHighlight>
        </View>

        {/* Modal confirm */}
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
              <Text style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
                คุณต้องการออกจากระบบใช่หรือไม่?
              </Text>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={logout}
                >
                  <Text style={styles.textStyle}>ตกลง</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>ยกเลิก</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageWrap: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    backgroundColor: "#FFFFFF",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Prompt_500Medium",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 24,
  },
  profileInner: {
    position: "relative",
    backgroundColor: "#e9ecef",
    width: 120,
    height: 120,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: "#AB4740",
    marginBottom: 12,
  },
  profileAvatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 120,
  },
  btnUpload: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    bottom: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
  },
  shadowProp: {
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listGroup: {
    display: "flex",
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: "#FFFFFF",
  },
  divider: {
    // marginTop: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderBottomColor: "#EFEFEF",
    marginLeft: 24,
    marginRight: 24,
  },
  listText: {
    fontSize: 16,
    fontFamily: "Prompt_500Medium",
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
    width: 100,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 10,
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
});

export default ProfileMain;
