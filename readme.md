# dependescies wrong

react-native-paper
react-navigation-material-bottom-tab
react-native-gesture-handler
react-navigation/stack
react-navigation-tabs

# Build for ios to apple store

1. run "npx expo build:ios"


# Build for android app store

1. run "npx expo build:android"
2. or "eas build -p android"


# flow แจ้งเตือน

1. พอจ่ายเสร็จ check status ที่ห้อง payment ถ้า success => ไปหน้า Home ส่ง props => หมายเลขเครื่อง device_id, เวลา remaining time, เวลาซักเสร็จคำนวณเอง + remain time กับ เวลาปัจจุบัน

2. หน้า Home แสดง popup และ check status ตาม remaining time ถ้า === 0 จะแสดง popup เสร็จสิ้น

3. ถ้าซักหลายเครื่อง จะ check จาก list my device ว่าอันไหน remaining time = 0 จะแสดง popup ทุกครั้ง