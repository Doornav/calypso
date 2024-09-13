import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../assets/constants/colors';
import { useAuth } from '../../AuthContext'; // Assume you have an AuthContext providing authToken and userInfo

export default function VerifyEmail() {
    const navigation = useNavigation();
    const { userInfo, authToken } = useAuth(); // Assume userInfo contains the user's email
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    // Poll the server every 5 seconds to check verification status
    useEffect(() => {
        if (!userInfo || !userInfo.email) {
            return; // If userInfo or userInfo.email is null, don't execute the effect
        }
    
        let isMounted = true;
        const intervalId = setInterval(async () => {
            try {
                setLoading(true);
                
                // Fetch the verification status
                const response = await fetch(`http://localhost:5001/users/check-verification-status?email=${userInfo.email}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Optional if needed
                    },
                });
    
                const data = await response.json();
    
                if (data.verified) {
                    if (isMounted) {
                        setIsVerified(true);
                        clearInterval(intervalId); // Stop polling once verified
                        Alert.alert('Success', 'Your email is verified!');
                        navigation.navigate('LinkAccount'); // Navigate to the next page
                    }
                }
            } catch (error) {
                console.error('Error checking verification status:', error);
            } finally {
                setLoading(false);
            }
        }, 5000); // Poll every 5 seconds
    
        return () => {
            clearInterval(intervalId); // Clean up interval on unmount
            isMounted = false; // Prevent updates to state if component is unmounted
        };
    }, [userInfo?.email, authToken, navigation]);
    

    const handleResendVerification = async () => {
        try {
            const response = await fetch('http://localhost:5001/users/resend-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Optional if needed
                },
                body: JSON.stringify({ email: userInfo.email }),
            });

            if (response.ok) {
                Alert.alert('Verification Email Sent', 'A new verification email has been sent to your inbox.');
            } else {
                Alert.alert('Error', 'Failed to resend verification email.');
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            Alert.alert('Error', 'An error occurred while resending the email.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.body}>
                We have sent a verification link to the email associated with your account. Please verify your email to continue.
            </Text>
            {loading && <ActivityIndicator size="large" color={colors.primary} />}
            <TouchableOpacity onPress={handleResendVerification} style={styles.button}>
                <Text style={styles.buttonText}>Resend Verification Email</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Merriweather Bold',
    },
    body: {
        marginTop: 30,
        marginBottom: 30,
        marginHorizontal: 30,
        fontSize: 17,
        color: colors.textTertiary,
        fontFamily: 'Merriweather Sans',
        textAlign: 'center',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 320,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Merriweather Bold',
    },
});
