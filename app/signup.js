import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Alert} from "react-native";
import Themes from "@/Branding/Themes";
import {Ionicons} from "@expo/vector-icons";
import {useState} from "react";
import { Link } from 'expo-router';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get("screen");



const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () => {
        if (email.length < 6 || password.length < 6) {
            Alert.alert("Please enter a valid email address");
            return;
        }

        try {
            const response = await fetch(`http://192.168.186.166:4000/signup/send-mail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: email,
                    password:password
                })
            });

            const responseData = await response.json(); // Always try to parse the response

            if (!response.ok) {
                // Server returned an error (400, 500, etc.)
                console.log("Server error details:", {
                    status: response.status,
                    statusText: response.statusText,
                    responseData
                });
                throw new Error(responseData.message || `Server error: ${response.status}`);
            }

            // Success case
            // console.log("Signup successful:", responseData);
            Alert.alert("Success", "Check your email for verification");

            await AsyncStorage.removeItem("session").then(async (value) => {
                await AsyncStorage.setItem("session", JSON.stringify(responseData));
            });
            router.push("/otp")

        } catch (e) {
            // console.log("Full error:", {
            //     message: e.message,
            //     name: e.name,
            //     stack: e.stack
            // });
            Alert.alert("Error", e.message || "Failed to sign up");
        }
    }

    const router = useRouter();


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.rightBg}/>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{alignSelf: "flex-start", padding: 10}}
                >
                    <Ionicons name="arrow-back" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <Text style={styles.create}>Create Account</Text>
                <TextInput
                    placeholder="Email"
                    maxLength={100}
                    style={styles.input}
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                    onChangeText={email => setEmail(email.trim())}
                    value={email}
                />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry={true}
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={password => setPassword(password.trim())}
                />

                <TouchableOpacity
                    onPress={submit}
                    style={styles.button}>
                    <Text style={styles.signUp}>SignUp</Text>
                    <Ionicons name="arrow-forward" size={30} color={Themes.colors.backgroundColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Themes.colors.textColor,
        padding: 15,
        overflow: "hidden",
        height,
    },
    rightBg: {
        height: 130,
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        position: 'absolute',
        width: 200,
        right: -80,
        backgroundColor: Themes.colors.primaryColor,
        transform: [{skewY: "-25deg"}]
    },
    header:{
        position: 'relative',
        height: height * 0.2
    },
    body:{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 15,
    },
    input:{
        height: 55,
        fontSize: 17,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: "#fff",
        color: Themes.colors.textColor,
        fontFamily: Themes.Montserrat_Font.Mont400
    },
    button:{
        backgroundColor: Themes.colors.primaryColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 10,
        alignSelf: "flex-end",
        paddingHorizontal: width * 0.15,
        paddingVertical: 12,
        marginTop: 20,
        borderRadius: 8,
    },
    signUp:{
        fontSize: 18,
        fontFamily: Themes.Montserrat_Font.Mont700,
        color: Themes.colors.backgroundColor,
    },
    create:{
        fontSize: 30,
        color: Themes.colors.backgroundColor,
        fontFamily: Themes.Montserrat_Font.Mont700,
        textAlign: "center",
        marginBottom: 30
    },
});

export default Signup;