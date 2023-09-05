import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Svg, { Path, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const LuandryIcon = () => (
    <Svg
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M2.85714 0H13.1429C14.7207 0 16 1.2593 16 2.8125V15.75C16 16.9928 14.9768 18 13.7143 18H2.28571C1.02321 18 -7.15256e-07 16.9928 -7.15256e-07 15.75V2.8125C-7.15256e-07 1.2593 1.27857 0 2.85714 0ZM1.71429 15.75C1.71429 16.0602 1.97064 16.3125 2.28571 16.3125H13.7143C14.0294 16.3125 14.2857 16.0602 14.2857 15.75V2.8125C14.2857 2.19234 13.7729 1.6875 13.1429 1.6875H2.85714C2.22714 1.6875 1.71429 2.19234 1.71429 2.8125V15.75ZM11.425 3.65625C11.425 3.19043 11.8118 2.8125 12.2829 2.8125C12.7582 2.8125 13.1407 3.19043 13.1407 3.65625C13.1407 4.12207 12.76 4.5 12.2857 4.5C11.8143 4.5 11.425 4.12383 11.425 3.65625ZM9.425 4.5C8.95393 4.5 8.57179 4.12207 8.57179 3.65625C8.57179 3.19043 8.95714 2.8125 9.425 2.8125C9.90036 2.8125 10.2829 3.19043 10.2829 3.65625C10.2829 4.12207 9.90357 4.5 9.425 4.5ZM8 5.625C10.6843 5.625 12.8571 7.76496 12.8571 10.3746C12.8571 12.9843 10.6857 15.1875 8 15.1875C5.31429 15.1875 3.14286 13.0472 3.14286 10.4062C3.14286 7.76531 5.31429 5.625 8 5.625ZM8 13.5914C9.78679 13.5914 11.2357 12.163 11.24 10.4052C11.24 10.3041 11.2178 10.2074 11.2089 10.1064C10.9866 10.2162 10.7421 10.2734 10.4978 10.2734C10.0221 10.2734 9.57353 10.0844 9.2446 9.75023C8.92143 10.0863 8.47143 10.2762 8 10.2762C7.52857 10.2762 7.08 10.0872 6.75536 9.75305C6.42654 10.087 5.9775 10.2762 5.50214 10.2762C5.25764 10.2762 5.01321 10.219 4.79107 10.1092C4.78214 10.2094 4.76071 10.3043 4.76071 10.4062C4.76428 12.1641 6.21429 13.5914 8 13.5914Z"
        fill="#393A3A"
      />
    </Svg>
  );
  
  const DryingIcon = () => (
    <Svg
      width="16"
      height="19"
      viewBox="0 0 16 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M13.1429 0H2.85714C1.27929 0 0 1.32926 0 2.96875V16.625C0 17.9368 1.02321 19 2.28571 19H13.7143C14.9768 19 16 17.9368 16 16.625V2.96875C16 1.32926 14.7214 0 13.1429 0ZM14.2857 16.625C14.2857 16.9525 14.0294 17.2188 13.7143 17.2188H2.28571C1.97064 17.2188 1.71429 16.9525 1.71429 16.625V2.96875C1.71429 2.31414 2.22714 1.78125 2.85714 1.78125H13.1429C13.7729 1.78125 14.2857 2.31414 14.2857 2.96875V16.625ZM4.575 3.85938C4.575 3.36768 4.18821 2.96875 3.71714 2.96875C3.24179 2.96875 2.85929 3.36768 2.85929 3.85938C2.85929 4.35107 3.24 4.75 3.71429 4.75C4.18571 4.75 4.575 4.35293 4.575 3.85938ZM6.575 4.75C7.04607 4.75 7.42822 4.35107 7.42822 3.85938C7.42822 3.36768 7.04286 2.96875 6.575 2.96875C6.09964 2.96875 5.71714 3.36768 5.71714 3.85938C5.71714 4.35107 6.09643 4.75 6.575 4.75ZM8 5.9375C5.31429 5.9375 3.14214 8.19746 3.14214 10.9844C3.14214 13.7713 5.31429 16.0312 8 16.0312C10.6857 16.0312 12.8571 13.772 12.8571 10.9844C12.8571 8.19672 10.6857 5.9375 8 5.9375ZM8 14.25C6.56571 14.25 5.36643 13.2414 4.99036 11.875H6.28571C6.75893 11.875 7.14286 11.4761 7.14286 10.9844C7.14286 10.4927 6.76071 10.0938 6.28571 10.0938H4.98929C5.36786 8.72812 6.56429 7.71875 8 7.71875C9.73321 7.71875 11.1436 9.18383 11.1436 10.9844C11.1436 12.7849 9.73214 14.25 8 14.25Z"
        fill="#393A3A"
      />
    </Svg>
  );

  const NavigatorIcon = () => (
    <Svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M10.7824 11.4293L5.70937 13.3805C4.9957 13.6441 4.35586 12.9727 4.61953 12.2906L6.5707 7.21758C6.6832 6.91875 6.91875 6.6832 7.21758 6.5707L12.2906 4.61953C12.9727 4.35586 13.6441 4.9957 13.3805 5.70937L11.4293 10.7824C11.3168 11.0813 11.0813 11.3168 10.7824 11.4293ZM8.96836 7.875C8.37773 7.875 7.84336 8.37773 7.84336 9C7.84336 9.62227 8.37773 10.125 8.96836 10.125C9.62227 10.125 10.125 9.62227 10.125 9C10.125 8.37773 9.62227 7.875 8.96836 7.875ZM18 9C18 13.9711 13.9711 18 9 18C4.02891 18 0 13.9711 0 9C0 4.02891 4.02891 0 9 0C13.9711 0 18 4.02891 18 9ZM9 1.6875C4.96055 1.6875 1.6875 4.96055 1.6875 9C1.6875 13.0395 4.96055 16.3125 9 16.3125C13.0395 16.3125 16.3125 13.0395 16.3125 9C16.3125 4.96055 13.0395 1.6875 9 1.6875Z"
        fill="white"
      />
    </Svg>
  );

export default class RBResultMap extends Component {
  render() {
    const { data } = this.props;

    return (
      <RBSheet
        ref={this?.props?.refs}
        height={(height * 30) / 100}
        openDuration={100}
        customStyles={{
          container: {
            alignItems: "center",
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            paddingTop: 16,
            height: 250,
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View style={{flex: 1}}>

          <View
            style={{
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  marginTop: 20,
                  marginLeft: 40,
                  backgroundColor: "red",
                  height: 85,
                  width: 80,
                  borderRadius: 8,
                }}
              />

              <View>
                <View
                  style={{
                    marginTop: 20,
                    marginLeft: 20,
                    flexDirection: "row",
                    width: width / 1.7,
                    marginRight: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#AB4740",
                      fontSize: 16,
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    {data.name}
                  </Text>
                  <Text
                    style={{
                      color: "#AB4740",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    350 ม
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    marginLeft: 20,
                    flexDirection: "row",
                    width: width / 1.7,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                    }}
                  >
                    <LuandryIcon />
                    <Text
                      style={{
                        color: "#393A3A",
                        fontSize: 14,
                        fontWeight: "400",
                        marginLeft: 5,
                      }}
                    >
                      เครื่องซัก/อบ
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#76B073",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginLeft: 20,
                    flexDirection: "row",
                    width: width / 1.7,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                    }}
                  >
                    <DryingIcon />
                    <Text
                      style={{
                        color: "#393A3A",
                        fontSize: 14,
                        fontWeight: "400",
                        marginLeft: 5,
                      }}
                    >
                      เครื่องอบ
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#76B073",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    ว่าง
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#AB4740",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginLeft: 30,
              marginRight: 30,
              marginTop: 30,
              height: 40,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <NavigatorIcon />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  fontWeight: "700",
                  color: "white",
                }}
              >
                นำทาง
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
    borderColor: "#027979",
    borderWidth: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 210,
    height: 48,
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  containerRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
  salaryText: {
    padding: 10,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Prompt-Medium",
  },
  companyImage: {
    height: 48,
    width: 48,
    borderRadius: 15,
    backgroundColor: "red",
  },
  customMarker: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressBox: {
    width: 150,
    height: 45,
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addressText: {
    textDecorationLine: "underline",
  },
});
