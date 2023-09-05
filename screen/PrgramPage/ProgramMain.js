import { StyleSheet, Button, Image, View } from 'react-native';

const PaymentPage = (props) => {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
            title="Go To Maps"
            onPress={() =>
                props.navigation.navigate('Map')
            }
        />
    </View>
    );
}


// Later on in your styles..
var styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    linearGradient: {
        width: '100%',
        height: '100%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    img: {
        width: 90,
        height: 100,
    }
});

export default PaymentPage;