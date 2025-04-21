import {Text, View, StyleSheet, Dimensions, TouchableOpacity, StatusBar} from "react-native";
import Themes from "@/Branding/Themes";
import LottieView from 'lottie-react-native';
import {useRouter} from "expo-router";

const {width, height} = Dimensions.get("screen");

const Index = () => {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Themes.colors.textColor} barStyle={"light-content"}/>
            <View>
                <Text style={styles.company}>MiroGate</Text>

            </View>
            <View style={styles.mainView}>
                <LottieView source={require('../assets/farm2.json')} autoPlay loop style={styles.json}/>

                <Text style={styles.slogan}>Welcome to the farmer's World!</Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/signup");
                    }}
                    style={styles.button}>
                    <Text style={styles.txt}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:Themes.colors.textColor,
        justifyContent: "space-between",
        padding: 15
    },
    json:{
        height: height * 0.3,
        width: width * 0.9,
        alignSelf: "center",
    },
    mainView:{
        // borderWidth: 2,
        // backgroundColor:Themes.colors.textColor,
        height: height * 0.5,
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: 20
    },
    company:{
        fontSize: 30,
        fontFamily:Themes.Montserrat_Font.Mont800,
        color:Themes.colors.backgroundColor,
        // fontStyle: "italic"
    },
    slogan:{
        fontSize: 20,
        textAlign: "center",
        fontFamily:Themes.Montserrat_Font.Mont500,
        color:Themes.colors.primaryColor
    },
    button:{
        backgroundColor:Themes.colors.primaryColor,
        padding: 10,
        borderRadius: 40
    },
    txt:{
        fontSize: 20,
        fontFamily:Themes.Montserrat_Font.Mont600,
        textAlign: "center",
        color:Themes.colors.backgroundColor
    }

})
export default Index;