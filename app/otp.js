import {View, StyleSheet, Text, Dimensions, TouchableOpacity, TextInput, Alert} from "react-native";
import Themes from "../Branding/Themes";
import {useRef, useState, useEffect} from "react";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const {width, height} = Dimensions.get("screen");

const ipAdrress = process.env.address;

const Otp = () => {

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    const handleOTPChange = async (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text.length === 1 && index < 5) {
            inputRefs[index + 1].current.focus();
        }

        if (text.length === 1 && index === 5) {
            const completeOTP = newOtp.join('');
            if (completeOTP.length === 6) {
                try {
                    // submit();
                    submit(completeOTP);
                } catch (error) {
                    setPreloader(false);
                    console.log('Error handling OTP:', error);
                    Alert.alert('Error', 'Failed to process OTP verification');
                }
            }
        }
    };

    const handleOTPKeyPress = (event, index) => {
        const { key } = event.nativeEvent;

        // Handle backspace to move to previous input
        if (key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const router = useRouter();

    const submit = async (value) => {

        try {
            const session = await AsyncStorage.getItem("session");
            if (!session) {
                Alert.alert("Error", "No user session found");
                return;
            }

            const user = await JSON.parse(session);

            const response = await fetch(`${ipAdrress}/signup/verify-otp/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp: value }) // Send the OTP in the request body
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.log("Server error details:", {
                    status: response.status,
                    statusText: response.statusText,
                    responseData
                });
                throw new Error(responseData.message || `Server error: ${response.status}`);
            }

            // Success case
            Alert.alert("Success", "You are in, welcome");
            // Navigate to next screen or perform necessary actions

        } catch (e) {
            console.log("Full error:", {
                message: e.message,
                name: e.name,
                stack: e.stack
            });
            Alert.alert("Error", e.message || "Failed to verify OTP");
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{alignSelf: "flex-start", padding: 10}}
            >
                <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <View>
                <Text style={[styles.txt, {fontSize: 40, marginBottom: 5, fontFamily: Themes.Montserrat_Font.Mont800}]}>Dear User!</Text>
                <Text style={styles.txt}>Please enter below the six digit code sent to your email?</Text>
                <View style={styles.inpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={inputRefs[index]}
                            style={styles.otpBox}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) =>
                                handleOTPChange(text, index)
                            }
                            onKeyPress={(event) =>
                                handleOTPKeyPress(event, index)
                            }
                            textAlign="center"
                        />
                    ))}
                </View>
            </View>
            <View/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Themes.colors.textColor,
        padding: 15,
        justifyContent: "space-between"
    },
    inpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: '99%',
        // marginTop: -10,
    },
    otpBox: {
        width: 45,
        borderRadius: 20,
        fontSize: 20,
        padding: 15,
        fontFamily: Themes.Montserrat_Font.Mont600,
        color: Themes.colors.textColor,
        backgroundColor: '#fff',
        borderWidth: 0.5,
    },
    txt:{
        fontSize: 18,
        color: Themes.colors.backgroundColor,
        fontFamily:Themes.Montserrat_Font.Mont400,
        marginBottom: 10
    },
})

export default Otp;