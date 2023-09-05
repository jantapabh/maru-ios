import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  Keyboard,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Svg, { Path, Rect } from "react-native-svg";
import React, { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import axios from "axios";
import { Permissions } from "expo";
import MapViewDirections from "react-native-maps-directions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const SvgComponent = (props) => (
  <Svg width={9} height={9} style={{ marginLeft: 10 }}>
    <Path d="M4.5999 8L0.44298 0.799999L8.75683 0.8L4.5999 8Z" fill="#AB4740" />
  </Svg>
);

const SvgComponentSelected = (props) => (
  <Svg
    width={15}
    height={12}
    viewBox="0 0 15 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M7.56668 12L0.753951 0.199999L14.3794 0.2L7.56668 12Z"
      fill="#AB4740"
    />
  </Svg>
);

const IconComponent = (props) => (
  <Svg width={30} height={29}>
    <Rect width="30" height="28.8" rx="4" fill="#AB4740" />
    <Rect x="3.6001" y="3.6001" width="24" height="21.6" fill="white" />
    <Path
      d="M15.5956 25.5524C11.6986 25.5524 7.79866 25.5524 3.90174 25.5585C3.65494 25.5585 3.6001 25.4946 3.6001 25.2508C3.60619 17.7251 3.60619 10.1994 3.6001 2.67363C3.6001 2.46949 3.6458 2.40246 3.86213 2.40246C11.6895 2.40855 19.5199 2.40855 27.3503 2.39941C27.6458 2.39941 27.5971 2.56394 27.5971 2.73457C27.5971 7.67961 27.5971 12.6216 27.5971 17.5666C27.5971 20.0894 27.5971 22.6122 27.5971 25.135C27.5971 25.5524 27.5971 25.5524 27.1888 25.5524C23.3254 25.5524 19.462 25.5524 15.5956 25.5524ZM24.0506 9.49858C23.9988 9.3828 24.1176 9.34014 24.1694 9.28225C24.6508 8.7521 25.1474 8.23718 25.702 7.7832C25.836 7.67352 25.9548 7.55774 25.9183 7.35969C25.8421 6.93313 25.4125 6.68329 25.0164 6.86305C24.3095 7.18297 23.5753 7.37188 22.8014 7.38711C22.7069 7.38711 22.6094 7.40235 22.5698 7.50594C22.5271 7.61258 22.582 7.70094 22.649 7.78016C22.8592 8.02695 23.1456 8.10312 23.4717 7.9782C23.8099 7.85023 24.1542 7.74055 24.4832 7.58211C24.6447 7.50289 24.8184 7.43891 25.0438 7.42367C24.7331 7.86851 24.404 8.24937 24.0628 8.62109C23.5052 9.23046 22.9415 9.83373 22.2651 10.3182C22.0214 10.4949 21.9208 10.6838 21.9848 10.9519C22.0122 11.0647 22.0122 11.214 22.1676 11.2597C22.323 11.3054 22.4266 11.217 22.518 11.1165C22.6886 10.9276 22.8775 10.76 23.0786 10.6076C23.755 10.0897 24.5076 9.83373 25.3699 9.95256C25.9457 10.0318 26.2748 10.5193 26.1468 11.086C26.0493 11.5156 25.7812 11.7868 25.4064 11.9909C25.2175 12.0945 25.1413 12.0549 25.0652 11.8568C24.8519 11.3115 24.2913 10.9489 23.7185 10.9733C23.4138 10.9854 23.1609 11.1104 23.0146 11.3907C22.8684 11.671 22.908 11.9513 23.0847 12.2042C23.2706 12.4754 23.5204 12.6673 23.8495 12.7496C24.1085 12.8136 24.3735 12.8075 24.6295 12.7831C25.4216 12.71 26.1529 12.4784 26.5734 11.738C27.1553 10.7173 26.744 9.61131 25.5679 9.37975C25.0499 9.27921 24.5472 9.35842 24.0506 9.49858ZM10.0533 17.2102C10.1204 17.2376 10.1478 17.2498 10.1752 17.2589C11.2325 17.5484 12.308 17.7403 13.3988 17.85C14.1148 17.9231 14.8156 18.0541 15.4798 18.3345C16.9514 18.9591 18.0391 20.0194 18.8892 21.3508C18.9258 21.4087 19.0598 21.4758 18.9166 21.5733C18.7887 21.6586 18.7369 21.5976 18.6698 21.491C18.3042 20.9243 17.8898 20.3941 17.4023 19.9219C16.3481 18.9012 15.1081 18.2309 13.6425 18.0663C12.1922 17.9018 10.7632 17.6672 9.36169 17.2498C8.42326 16.9695 7.51835 16.6069 6.66218 16.1285C6.51898 16.0493 6.42148 15.9457 6.38492 15.769C6.25695 15.1566 6.18078 14.535 6.19297 13.9104C6.22648 12.0579 6.75054 10.3547 7.85959 8.86179C9.3099 6.90876 11.2477 5.7479 13.6578 5.38838C14.4377 5.2726 15.2177 5.2665 16.0008 5.38533C16.3298 5.43408 16.5218 5.31525 16.5523 5.05932C16.5858 4.77901 16.4304 4.62362 16.0983 4.58096C15.2574 4.47432 14.4164 4.46518 13.5785 4.58096C11.0984 4.9344 9.04177 6.07087 7.48179 8.02086C5.75422 10.1811 5.09305 12.6673 5.51657 15.4156C5.90352 17.914 7.11312 19.9493 9.12099 21.4636C11.4518 23.2186 14.0935 23.834 16.9362 23.1454C20.6442 22.2466 22.9994 19.8792 24.017 16.1956C24.0963 15.9153 23.9774 15.7081 23.7276 15.641C23.5082 15.5831 23.3071 15.7294 23.2401 15.9975C22.8227 17.6672 21.9787 19.0901 20.7295 20.2722C20.568 20.4246 20.3913 20.5587 20.2176 20.7049C20.05 20.3941 19.8337 20.2235 19.5321 20.1443C19.3279 20.0894 19.1177 20.0681 18.9075 20.062C18.7673 20.062 18.6546 20.0072 18.7643 19.8487C19.0598 19.4283 19.3828 19.0444 19.9708 19.0505C20.4248 19.0535 20.8483 18.9499 21.2261 18.6696C21.5826 18.4076 21.6618 18.0602 21.415 17.7038C21.2627 17.4813 21.1378 17.2376 21.0433 16.9877C20.9184 16.6556 20.7234 16.3692 20.4035 16.2413C19.8733 16.0341 19.6387 15.5984 19.4193 15.1322C19.3462 14.9799 19.267 14.8306 19.1878 14.6843C19.008 14.3461 18.8252 14.3217 18.5327 14.5807C18.2219 14.8549 18.0483 15.2236 17.8167 15.5527C17.7405 15.6624 17.6583 15.7385 17.5303 15.769C17.2622 15.836 17.0367 15.9823 16.8387 16.1712C16.7534 16.2535 16.6772 16.2748 16.5523 16.2504C14.8369 15.9244 13.1489 16.0432 11.4914 16.5856C11.007 16.744 10.5286 16.9268 10.0533 17.2102ZM16.8752 8.21281C16.6041 8.21281 16.3359 8.21281 16.0648 8.21281C15.9825 8.21281 15.888 8.20062 15.8545 8.30421C15.818 8.40781 15.8637 8.48398 15.9429 8.54492C16.08 8.64851 16.2263 8.71859 16.403 8.73687C16.924 8.79171 17.448 8.77952 17.969 8.74296C18.1214 8.73077 18.1884 8.77343 18.1732 8.93491C18.161 9.08726 18.158 9.2396 18.1671 9.38889C18.1762 9.53514 18.1275 9.59303 17.9751 9.61436C17.6461 9.65702 17.3201 9.64178 16.991 9.63264C16.8966 9.63264 16.7716 9.60827 16.732 9.73623C16.6894 9.87334 16.8052 9.93123 16.8966 9.98608C17.122 10.1201 17.3719 10.1445 17.6278 10.1476C18.1854 10.1567 18.1762 10.1537 18.1701 10.7234C18.1701 10.8971 18.1214 10.9001 17.963 10.8788C17.4998 10.8148 17.0367 10.7996 16.6071 11.0403C16.1074 11.3206 15.9916 11.9452 16.3664 12.3718C16.9697 13.0634 18.2189 12.8532 18.5784 11.9848C18.6759 11.7472 18.7734 11.738 18.9532 11.866C18.9867 11.8904 19.0233 11.9117 19.0598 11.933C19.3706 12.1006 19.6692 12.2925 20.0104 12.3992C20.2633 12.4784 20.3822 12.3809 20.37 12.1158C20.3578 11.8477 20.2024 11.6801 19.9708 11.5796C19.7789 11.4973 19.5778 11.4272 19.3797 11.3602C18.9674 11.2241 18.7592 10.9428 18.7551 10.5162C18.7551 10.4065 18.7612 10.2969 18.7551 10.1872C18.746 10.0622 18.7978 10.0165 18.9227 9.98912C19.2518 9.916 19.5747 9.82155 19.8825 9.67834C20.0226 9.61131 20.1841 9.52905 20.1018 9.34014C20.0257 9.16952 19.855 9.11163 19.6753 9.16343C19.5382 9.20304 19.4102 9.26702 19.2792 9.32491C18.7765 9.54124 18.7612 9.5321 18.7582 9.00499C18.7582 8.98062 18.7612 8.95319 18.7582 8.92882C18.7125 8.72773 18.8344 8.66679 18.9989 8.63327C19.3615 8.5571 19.7149 8.44742 20.0531 8.29507C20.1841 8.23414 20.3029 8.16711 20.2633 7.99953C20.2237 7.84109 20.0957 7.77711 19.9434 7.76187C19.8429 7.75273 19.7454 7.77406 19.6479 7.81672C19.4315 7.90812 19.2122 7.99344 18.9867 8.06961C18.8344 8.1214 18.7186 8.11836 18.7673 7.89594C18.7978 7.75578 18.7947 7.60953 18.8283 7.47242C18.9288 7.03368 18.7917 6.83258 18.3347 6.77165C18.0574 6.73509 17.9416 6.86305 18.0513 7.12204C18.1701 7.40539 18.1701 7.69484 18.1823 7.99039C18.1884 8.14273 18.1244 8.18539 17.9751 8.19757C17.6126 8.225 17.25 8.23718 16.8874 8.21281H16.8752Z"
      fill="#AB4740"
    />
    <Path
      d="M19.5836 16.8324C19.8487 16.7562 20.0955 16.7897 20.3301 16.8964C20.3849 16.9207 20.4794 16.9421 20.4337 17.0304C20.4032 17.0914 20.3331 17.0731 20.2783 17.0365C20.0681 16.8933 19.8182 16.8781 19.5806 16.8324H19.5836Z"
      fill="#AB4740"
    />
    <Path
      d="M24.3218 12.2322C24.1054 12.2413 23.8921 12.1956 23.7154 12.025C23.5996 11.9153 23.5448 11.7752 23.6118 11.6381C23.6789 11.5009 23.8312 11.5101 23.9683 11.5345C24.2456 11.5863 24.4253 11.7691 24.5838 11.9793C24.6264 12.0372 24.6965 12.1073 24.666 12.1804C24.6325 12.2627 24.535 12.22 24.465 12.2291C24.4223 12.2352 24.3796 12.2291 24.3187 12.2291L24.3218 12.2322Z"
      fill="#AB4740"
    />
    <Path
      d="M24.0505 9.49816C24.0505 9.49816 24.0261 9.5134 24.0139 9.51949C24.0139 9.51035 24.0139 9.50426 24.0139 9.49512C24.0261 9.49512 24.0383 9.49816 24.0505 9.50121V9.49816Z"
      fill="#AB4740"
    />
    <Path
      d="M17.3017 12.2112C17.2408 12.199 17.1402 12.1838 17.0458 12.1503C16.8843 12.0924 16.7777 11.9736 16.7533 11.803C16.7259 11.6232 16.8752 11.5592 16.994 11.4861C17.3109 11.2941 17.643 11.3764 17.972 11.4495C18.0787 11.4739 18.0909 11.5409 18.0695 11.6384C17.9964 11.9858 17.707 12.2143 17.2987 12.2082L17.3017 12.2112Z"
      fill="#AB4740"
    />
  </Svg>
);

const SelectedIcon = (props) => (
  <Svg
    width="50"
    height="48"
    viewBox="0 0 50 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect width="49.1667" height="47.2" rx="4" fill="#AB4740" />
    <Rect x="5.8999" y="5.89941" width="39.3333" height="35.4" fill="white" />
    <Path
      d="M25.5594 41.8774C19.1727 41.8774 12.7811 41.8774 6.3945 41.8874C5.99003 41.8874 5.90015 41.7825 5.90015 41.383C5.91013 29.0492 5.91013 16.7154 5.90015 4.38154C5.90015 4.04698 5.97505 3.93712 6.32958 3.93712C19.1578 3.94711 31.9909 3.94711 44.8241 3.93213C45.3085 3.93213 45.2286 4.20178 45.2286 4.48141C45.2286 12.5858 45.2286 20.6852 45.2286 28.7895C45.2286 32.9241 45.2286 37.0587 45.2286 41.1933C45.2286 41.8774 45.2286 41.8774 44.5594 41.8774C38.2277 41.8774 31.8961 41.8774 25.5594 41.8774ZM39.4162 15.5669C39.3313 15.3771 39.526 15.3072 39.6109 15.2123C40.3999 14.3435 41.2138 13.4996 42.1226 12.7556C42.3423 12.5758 42.5371 12.386 42.4772 12.0615C42.3523 11.3624 41.6483 10.9529 40.9991 11.2475C39.8406 11.7718 38.6372 12.0814 37.3689 12.1064C37.2141 12.1064 37.0543 12.1314 36.9894 12.3012C36.9195 12.4759 37.0093 12.6207 37.1192 12.7506C37.4638 13.155 37.9331 13.2799 38.4674 13.0751C39.0217 12.8654 39.586 12.6857 40.1253 12.426C40.3899 12.2962 40.6745 12.1913 41.0441 12.1663C40.5347 12.8954 39.9954 13.5196 39.4362 14.1288C38.5224 15.1274 37.5986 16.1162 36.49 16.9101C36.0906 17.1997 35.9258 17.5093 36.0306 17.9487C36.0756 18.1335 36.0756 18.3782 36.3302 18.4531C36.5849 18.528 36.7547 18.3832 36.9045 18.2184C37.1841 17.9088 37.4937 17.6342 37.8233 17.3845C38.9318 16.5356 40.1652 16.1162 41.5784 16.3109C42.5221 16.4407 43.0614 17.2397 42.8517 18.1685C42.6919 18.8725 42.2525 19.317 41.6383 19.6515C41.3287 19.8213 41.2038 19.7564 41.079 19.4318C40.7295 18.538 39.8107 17.9438 38.8719 17.9837C38.3726 18.0037 37.9581 18.2084 37.7184 18.6678C37.4787 19.1272 37.5436 19.5866 37.8333 20.0011C38.1379 20.4455 38.5473 20.7601 39.0866 20.8949C39.5111 20.9997 39.9455 20.9898 40.3649 20.9498C41.6632 20.83 42.8617 20.4505 43.5508 19.2371C44.5045 17.5643 43.8304 15.7516 41.9029 15.3721C41.054 15.2073 40.2301 15.3372 39.4162 15.5669ZM16.4763 28.2053C16.5861 28.2502 16.6311 28.2702 16.676 28.2852C18.4087 28.7596 20.1714 29.0742 21.9591 29.2539C23.1325 29.3738 24.281 29.5885 25.3696 30.0479C27.7814 31.0715 29.5641 32.8093 30.9573 34.9914C31.0172 35.0863 31.2369 35.1961 31.0022 35.3559C30.7925 35.4957 30.7076 35.3959 30.5978 35.2211C29.9985 34.2923 29.3194 33.4235 28.5205 32.6495C26.7927 30.9767 24.7604 29.8781 22.3586 29.6085C19.9817 29.3388 17.6397 28.9543 15.3428 28.2702C13.8048 27.8108 12.3217 27.2166 10.9186 26.4326C10.6839 26.3028 10.5241 26.133 10.4642 25.8434C10.2544 24.8397 10.1296 23.821 10.1496 22.7974C10.2045 19.7614 11.0634 16.97 12.881 14.5232C15.2579 11.3224 18.4337 9.41993 22.3835 8.83071C23.6619 8.64095 24.9402 8.63097 26.2235 8.82571C26.7628 8.90561 27.0774 8.71086 27.1273 8.29141C27.1822 7.83201 26.9276 7.57735 26.3833 7.50744C25.0051 7.33267 23.6269 7.31769 22.2537 7.50744C18.189 8.08668 14.8184 9.94924 12.2618 13.145C9.43052 16.6854 8.34694 20.7601 9.04103 25.2642C9.67519 29.3588 11.6576 32.6944 14.9483 35.1762C18.7683 38.0524 23.0976 39.0611 27.7565 37.9325C33.8335 36.4595 37.6934 32.5796 39.3613 26.5425C39.4911 26.0831 39.2963 25.7435 38.8869 25.6337C38.5274 25.5388 38.1978 25.7785 38.0879 26.2179C37.4038 28.9543 36.0206 31.2863 33.9733 33.2237C33.7087 33.4734 33.4191 33.6931 33.1344 33.9328C32.8598 33.4235 32.5053 33.1438 32.0109 33.014C31.6763 32.9241 31.3318 32.8892 30.9872 32.8792C30.7575 32.8792 30.5728 32.7893 30.7526 32.5296C31.2369 31.8405 31.7662 31.2114 32.73 31.2213C33.474 31.2263 34.1681 31.0566 34.7873 30.5972C35.3715 30.1677 35.5013 29.5985 35.0969 29.0142C34.8472 28.6497 34.6424 28.2502 34.4877 27.8408C34.2829 27.2965 33.9633 26.8271 33.439 26.6174C32.5702 26.2778 32.1857 25.5638 31.8261 24.7998C31.7063 24.5501 31.5765 24.3054 31.4466 24.0657C31.152 23.5115 30.8524 23.4715 30.373 23.896C29.8637 24.3454 29.5791 24.9496 29.1996 25.4889C29.0748 25.6686 28.9399 25.7935 28.7302 25.8434C28.2908 25.9533 27.9213 26.1929 27.5967 26.5025C27.4569 26.6374 27.332 26.6723 27.1273 26.6324C24.316 26.0981 21.5496 26.2928 18.8332 27.1816C18.0392 27.4413 17.2553 27.7409 16.4763 28.2053ZM27.6566 13.4596C27.2122 13.4596 26.7728 13.4596 26.3284 13.4596C26.1935 13.4596 26.0387 13.4397 25.9838 13.6094C25.9239 13.7792 25.9988 13.9041 26.1286 14.0039C26.3533 14.1737 26.593 14.2885 26.8826 14.3185C27.7365 14.4084 28.5954 14.3884 29.4493 14.3285C29.6989 14.3085 29.8088 14.3784 29.7838 14.6431C29.7638 14.8928 29.7589 15.1424 29.7738 15.3871C29.7888 15.6268 29.7089 15.7217 29.4592 15.7566C28.92 15.8265 28.3857 15.8016 27.8464 15.7866C27.6916 15.7866 27.4868 15.7466 27.4219 15.9564C27.352 16.1811 27.5418 16.2759 27.6916 16.3658C28.0611 16.5855 28.4705 16.6255 28.89 16.6305C29.8038 16.6455 29.7888 16.6405 29.7788 17.5742C29.7788 17.8589 29.6989 17.8639 29.4393 17.8289C28.6803 17.724 27.9213 17.6991 27.2172 18.0936C26.3983 18.553 26.2085 19.5766 26.8227 20.2757C27.8114 21.4092 29.8587 21.0647 30.448 19.6415C30.6077 19.252 30.7675 19.2371 31.0621 19.4468C31.1171 19.4867 31.177 19.5217 31.2369 19.5566C31.7462 19.8313 32.2356 20.1459 32.7949 20.3206C33.2093 20.4505 33.4041 20.2907 33.3841 19.8562C33.3641 19.4168 33.1095 19.1422 32.73 18.9774C32.4154 18.8426 32.0858 18.7277 31.7612 18.6179C31.0854 18.3948 30.7442 17.9338 30.7376 17.2347C30.7376 17.0549 30.7476 16.8752 30.7376 16.6954C30.7226 16.4907 30.8075 16.4158 31.0122 16.3708C31.5515 16.251 32.0808 16.0962 32.5851 15.8615C32.8148 15.7516 33.0795 15.6168 32.9447 15.3072C32.8198 15.0276 32.5402 14.9327 32.2456 15.0176C32.0209 15.0825 31.8112 15.1874 31.5964 15.2822C30.7725 15.6368 30.7476 15.6218 30.7426 14.7579C30.7426 14.718 30.7476 14.673 30.7426 14.6331C30.6677 14.3035 30.8674 14.2037 31.137 14.1487C31.7313 14.0239 32.3105 13.8441 32.8648 13.5945C33.0795 13.4946 33.2742 13.3847 33.2093 13.1101C33.1444 12.8504 32.9347 12.7456 32.685 12.7206C32.5202 12.7056 32.3604 12.7406 32.2007 12.8105C31.8461 12.9603 31.4866 13.1001 31.1171 13.2249C30.8674 13.3098 30.6776 13.3048 30.7575 12.9403C30.8075 12.7106 30.8025 12.4709 30.8574 12.2462C31.0222 11.5272 30.7975 11.1976 30.0485 11.0977C29.5941 11.0378 29.4043 11.2475 29.5841 11.672C29.7788 12.1364 29.7788 12.6107 29.7988 13.0951C29.8088 13.3448 29.7039 13.4147 29.4592 13.4347C28.865 13.4796 28.2708 13.4996 27.6766 13.4596H27.6566Z"
      fill="#AB4740"
    />
    <Path
      d="M32.0956 27.5863C32.53 27.4615 32.9345 27.5164 33.319 27.6912C33.4088 27.7311 33.5636 27.7661 33.4887 27.9109C33.4388 28.0108 33.324 27.9808 33.2341 27.9209C32.8895 27.6862 32.4801 27.6612 32.0906 27.5863H32.0956Z"
      fill="#AB4740"
    />
    <Path
      d="M39.8605 20.0475C39.506 20.0625 39.1565 19.9876 38.8668 19.708C38.6771 19.5282 38.5872 19.2985 38.6971 19.0738C38.8069 18.8491 39.0566 18.8641 39.2813 18.904C39.7357 18.9889 40.0303 19.2885 40.29 19.6331C40.3599 19.728 40.4747 19.8428 40.4248 19.9627C40.3699 20.0975 40.2101 20.0276 40.0952 20.0426C40.0253 20.0525 39.9554 20.0426 39.8555 20.0426L39.8605 20.0475Z"
      fill="#AB4740"
    />
    <Path
      d="M39.4164 15.566C39.4164 15.566 39.3764 15.591 39.3564 15.601C39.3564 15.586 39.3564 15.576 39.3564 15.561C39.3764 15.561 39.3964 15.566 39.4164 15.571V15.566Z"
      fill="#AB4740"
    />
    <Path
      d="M28.3556 20.0133C28.2558 19.9934 28.091 19.9684 27.9362 19.9135C27.6715 19.8186 27.4968 19.6239 27.4568 19.3442C27.4119 19.0496 27.6566 18.9447 27.8513 18.8249C28.3706 18.5103 28.9149 18.6451 29.4542 18.765C29.629 18.8049 29.6489 18.9148 29.614 19.0746C29.4941 19.6438 29.0198 20.0183 28.3506 20.0084L28.3556 20.0133Z"
      fill="#AB4740"
    />
  </Svg>
);

const MarkSelcted = () => {
  return (
    <>
      <SelectedIcon />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: -2,
        }}
      >
        <SvgComponentSelected />
      </View>
    </>
  );
};

const MarkNotSelcted = () => {
  return (
    <View style={{ justifyContent: "center" }}>
      <IconComponent />
      <View style={{ marginTop: -2 }}>
        <SvgComponent />
      </View>
    </View>
  );
};

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

const Map = (props) => {
  const mapRef = React.useRef(null);
  const GOOGLE_API_KEY = "AIzaSyDSDGjQBDUD5AdeX9J1DfHCV_CUmve0HMc";
  const [locationData, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [storeData, setStoreData] = React.useState([]);
  const [storeDetail, setStoreDetail] = React.useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [imageMap, setImageMap] = useState("");
  const [initialRegion, setInitialRegion] = useState({
    lng: 0,
    lat: 0,
  });
  const [allLocation, setAllLocation] = useState([]);
  const [timeMachine, setTimeMachine] = useState({
    luandry: 0,
    dryer: 0,
  });
  const [currentDistanceLabel, setCurrentDistanceLabel] = useState("");
  const [isZoom, setIsZoom] = useState(false);
  const wrapperRef = useRef(null);
  const [locationtest, setLocationtest] = useState(null);
  const [imageFileName, setImgaeFileName] = React.useState("");

  useEffect(() => {
    props.navigation.setOptions({
      title: "ร้าน",
      headerTitle: "ร้านมารุ สะดวกซัก",
    });
  }, []);

  useEffect(() => {
    if (locationData?.coords !== "null") {
      handeInitData();
    }
  }, [locationData]);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getLastKnownPositionAsync({});
      setLocation(location);
    })();
  }, []);

  async function handeInitData() {
    let data_ = [];
    let response = await fetch(
      `https://api.marulaundry-kangyong.com/v2/store?page=1&nearby=${true}&current_lat=${
        locationData?.coords?.latitude
      }&current_lng=${locationData?.coords?.longitude}`
    );
    response = await response.json();
    const { data } = response;
    data?.length > 0 &&
      data.map((item) => {
        data_.push({
          ...item,
          isSelected: false,
        });
      });
    setStoreData(data);
    setInitialRegion({
      lng: data[0]?.lng || 100.6083320950427,
      lat: data[0]?.lat || 14.066076008036811,
    });
  }

  const selectedMark = (_index) => {
    const mockData = [...storeData];
    mockData?.length &&
      mockData.map((item, index) => {
        mockData[index].isSelected = +_index === +index ? true : false;
      });
    setStoreData(mockData);
  };

  const openMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${storeDetail.lat},${storeDetail.lng}&dir_action=navigate`;
    Linking.openURL(url);
  };

  const loadDetail = () => {
    try {
      axios
        .get(
          `https://api.marulaundry-kangyong.com/v2/equipment?store_id=${storeDetail.id}`
        )
        .then((data) => {
          const { data: detailResult } = data;
          const { data: listDevice } = detailResult;
          const luandry = listDevice.filter(
            (item) => item?.device_type_code === "1"
          );
          const dryer = listDevice.filter(
            (item) => item?.device_type_code === "2"
          );
          const luandryMin = Math.min(
            ...luandry?.map((item) => item.status.remaining_time)
          );
          const DryerMin = Math.min(
            ...dryer?.map((item) => item.status.remaining_time)
          );
          setTimeMachine({
            luandry: luandryMin === Infinity ? 0 : luandryMin,
            dryer: DryerMin === Infinity ? 0 : DryerMin,
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      const distanceLabel =
        args.distance < 1
          ? Math.round(Number(args.distance.toString().split(".")[1])) + " ม."
          : Math.round(args.distance) + " กม.";
      setCurrentDistanceLabel(distanceLabel);
    }
  };

  const getImage = async (path) => {
    const accessToken = await AsyncStorage.getItem("access_token");

    return fetch(
      `https://api.marulaundry-kangyong.com/v2/file/download/store/${path}`,
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

  const handleChangeToStore = () => {
    props.navigation.navigate("Store", {
      storeId: storeDetail.id,
    });
    props.navigation.setParams({ param: storeDetail.id });
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setShowDetail(false);
  };

  let text = "loading...";
  if (errorMsg) {
    text = errorMsg;
  } else if (
    locationData &&
    initialRegion.lng !== 0 &&
    initialRegion.lat !== 0
  ) {
    text = JSON.stringify(locationData);
    return (
      <TouchableWithoutFeedback>
        <View>
          {storeDetail && showDetail && (
            <View
              ref={wrapperRef}
              style={{
                backgroundColor: "#fff",
                width,
                height: Platform.OS !== "ios" ? "50%" : "42%",
                position: "absolute",
                bottom: Platform.OS !== "ios" ? 10 : 30,
                zIndex: 2,
              }}
            >
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={handleChangeToStore}
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    {storeDetail?.image_url?.length > 0 ? (
                      <Image
                        source={{ uri: storeDetail?.image_url[0] }}
                        style={{
                          height: 85,
                          width: 80,
                          borderRadius: 8,
                          marginTop: 20,
                          marginLeft: 40,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/icon.png")}
                        style={{
                          height: 85,
                          width: 80,
                          borderRadius: 8,
                          marginTop: 20,
                          marginLeft: 40,
                        }}
                      />
                    )}
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
                            color: "#000",
                            fontSize: 16,
                            flex: 1,
                          }}
                        >
                          {storeDetail?.name}
                        </Text>
                        <Text
                          style={{
                            color: "#AB4740",
                            fontSize: 16,
                            fontWeight: "600",
                            textAlign: "right",
                          }}
                        >
                          {currentDistanceLabel}
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
                          {timeMachine.luandry === 0
                            ? "ว่าง"
                            : timeMachine.luandry}{" "}
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
                          {timeMachine.dryer === 0 ? "ว่าง" : timeMachine.dryer}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
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
                  onPress={() => openMap()}
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
            </View>
          )}

          <MapView
            ref={mapRef}
            onPress={handlePressOutside}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: initialRegion.lat !== 0 && initialRegion.lat,
              longitude: initialRegion.lng !== 0 && initialRegion.lng,
              latitudeDelta: 0.0012,
              longitudeDelta: isZoom ? 0.0005 * width : 0.1,
            }}
          >
            {showDetail && (
              <MapViewDirections
                origin={{
                  latitude: locationData.coords.latitude,
                  longitude: locationData.coords.longitude,
                }}
                destination={{
                  latitude: storeDetail.lat,
                  longitude: storeDetail.lng,
                }}
                apikey={GOOGLE_API_KEY}
                strokeColor="#6644ff"
                strokeWidth={4}
                onReady={traceRouteOnReady}
              />
            )}

            {locationData?.coords && (
              <Marker
                coordinate={{
                  latitude: locationData?.coords?.latitude,
                  longitude: locationData?.coords?.longitude,
                }}
              >
                <Image
                  source={require("../../assets/pin.png")}
                  style={{ height: 41, width: 43, }}
                  resizeMode={Platform.OS === "android" ? "center" : "contain"}
                />
              </Marker>
            )}

            {storeData?.length > 0 &&
              storeData.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: item.lat,
                      longitude: item.lng,
                    }}
                    onPress={async (e) => {
                      console.log('e: ',e);
                      const { coordinate } = e.nativeEvent;
                      const { latitude, longitude } = coordinate;
                      mapRef?.current.animateToRegion(
                        {
                          latitude: latitude,
                          longitude: longitude,
                        },
                        1000
                      );
                      loadDetail();
                      const image = await getImage(item.image_url[0]);
                      setImageMap(image.split(",")[1]);
                      setIsZoom(true);
                      setStoreDetail(item);
                      setShowDetail(true);
                      selectedMark(index);
                    }}
                  >
                    {item.isSelected ? <MarkSelcted /> : <MarkNotSelcted />}
                  </Marker>
                );
              })}
          </MapView>
        </View>
      </TouchableWithoutFeedback>
      // </SafeAreaView>
    );
  }

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <ActivityIndicator
        size="large"
        color="#AB4740"
        style={{ position: "absolute", zIndex: 9999, top: "50%", left: "50%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "5%",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    // flex: 1
  },
  container2: {
    flex: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  customMarker: {
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "53%",
    height: "30%",
  },
  buttonGPlusStyle: {
    flexDirection: "row",
    textAlign: "center",
    backgroundColor: "#A94640",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 50,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonFacebookStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#393A3A",
    borderWidth: 0.5,
    textAlign: "center",
    borderColor: "#393A3A",
    height: 50,
    borderRadius: 8,
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
  },
  buttonTextStyle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
  },
  buttonIconSeparatorStyle: {
    backgroundColor: "#fff",
    width: 1,
    height: 40,
  },
});

export default Map;
