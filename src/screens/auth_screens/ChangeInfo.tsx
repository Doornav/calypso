import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import colors from '../../assets/constants/colors';
import { Alert } from 'react-native';
import { useAuth } from '../../AuthContext';


const ChangeInfo = ({ route, navigation }: any) => {
    const { userInfo, authToken, setUserInfo } = useAuth();
    const {infoType} = route.params;
    const userId = userInfo?.uid; 

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [text, setText] = useState(userInfo?.[infoType] || '');
    const [loading, setLoading] = useState(false);


    const handleChangeName = (newName: string) => {
        setUserInfo({ name: newName}); // Update name locally
      };

    const getPlaceholder = () => {
        
        switch (infoType) {
            case 'name':
                return 'Name';
            case 'email':
                return 'Email address';
            case 'password':
                return 'Current Password';
            default:
                return '';
        }
    };

    const getTitle = () => {
        switch (infoType) {
            case 'name':
                return 'Change Name';
            case 'email':
                return 'Change Email';
            case 'password':
                return 'Change Password';
            default:
                return 'Update Information';
        }
    };

    const handleUpdate = () => {
        if (infoType === 'password') {
            handleChangePassword();
            console.log(`Current Password: ${currentPassword}, New Password: ${newPassword}`);
        } else if (infoType === 'name') {
            Alert.alert(
                "Change Name",          // Title of the alert
                "Are you sure you want to change your username", // Message content
                [
                
                  { text: "Continue", onPress: () => changeName(text, userId) },
                  { text: "Cancel"}
                ],
                { cancelable: false } // Set true to dismiss on tapping outside the alert
              );
            
            console.log(`Updated name: ${text}`);
        } else {
            console.log(`Updated ${infoType}: ${text}`);
        }
    };

        const changeName = async (newName: string, userId: string) => {
    
        try {
            const response = await fetch('http://localhost:5001/users/change-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token for authentication
                },
                body: JSON.stringify({
                    userId,
                    newName,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to change name');
            }

            const data = await response.json();
            console.log('Name changed successfully:', data);

            Alert.alert('Success', 'Your name has been updated.');
            handleChangeName(newName);
            navigation.navigate('MainApp');
            
            return data;
        } catch (error) {
            console.error('Error changing name:', error);
            Alert.alert('Error', 'Failed to change name.');
            throw error;
        }
    };

    const changePassword = async () => {
        try {
            const email = userInfo.email;
            const response = await fetch('http://localhost:5001/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Include auth token for authentication
                },
                body: JSON.stringify({
                    userId,  // Pass the userId here (instead of userInfo.uid)
                    currentPassword,
                    newPassword,
                    email,
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to change password');
            }
    
            const data = await response.json();
            console.log('Password changed successfully:', data);
            Alert.alert('Success', 'Your password has been updated.');
            navigation.navigate('MainApp');
            
            return data;
        } catch (error) {
            console.error(' changing password:', error);
            
            Alert.alert(
                "Error Changing Password",          // Title of the alert
                "Current password not correct", // Message content
                [
                
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false } // Set true to dismiss on tapping outside the alert
              );
            throw Error;
        }
    };
    
    const handleChangePassword = async () => {
        console.log("hehhhehehe")

        if(newPassword == confirmPassword){
            try {
                const result = await changePassword();
                console.log('Password change result:', result);
            } catch (error) {
                console.error('Password change failed:', error);
            }
        } else {
            Alert.alert(
                "Error Changing Password",          // Title of the alert
                "New passwords don't match", // Message content
                [
                
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false } // Set true to dismiss on tapping outside the alert
              );
        }
        
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.topLeftButton} onPress={() => navigation.navigate('MainApp')}>
                <Image source={require('../../assets/images/back_button.png')} />
            </TouchableOpacity>
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={styles.subtitle}>Track all your financials</Text>

            {infoType === 'password' ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Current Password"
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New Password"
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm New Password"
                        secureTextEntry={true}
                    />
                </>
            ) : (
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder={getPlaceholder()}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update {infoType}</Text>
            </TouchableOpacity>

            
        </View>
    );
};

export default ChangeInfo;

const styles = StyleSheet.create({
    topLeftButton: {
        alignSelf: 'flex-start',
        marginStart: 30,
        marginTop: -230,
        marginBottom: 70,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    input: {
        height: 60,
        width: 340,
        borderColor: "#828282",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 8,
        fontFamily: 'Merriweather Sans',
    },
    title: {
        fontFamily: 'Merriweather Bold',
        fontSize: 32,
        color: colors.textPrimary,
        marginBottom: 10,
        marginTop: -30,
    },
    subtitle: {
        fontFamily: 'Merriweather Sans',
        fontSize: 17,
        color: colors.textTertiary,
        marginBottom: 40,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 340,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginTop: 30,
        marginBottom: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Merriweather Bold',
    },
    secondaryButton: {
        fontSize: 17,
        color: colors.textSecondary,
        fontFamily: 'Merriweather Sans',
    }
});
