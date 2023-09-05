import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SuccessModal = (props) => {
  const { visible } = props;
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <View style={styles.container}>
      {/* ซักเสร็จแล้ว */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Ionicons name="checkmark-circle-sharp" size={74} color="#76B073" />
            <Text style={{ fontSize: 25, fontWeight: 700 }}>ซักเสร็จแล้ว</Text>
            <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 10 }}>เครื่องหมายเลข 12</Text>
            <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 10, marginBottom: 20 }}>เสร็จเวลา 12:30 น.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>ตกลง</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 200,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#AB4740',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  boxAdd: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center'

  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 280
  },
  time: {
    fontSize: 20,
    fontWeight: 700,
    backgroundColor: '#AB4740',
    padding: 10,
    width: 140,
    marginBottom: 15,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default SuccessModal;
