import { Button, Alert, TextInput, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../assets/constants/colors";
import { useAuth } from "../../AuthContext";

export default function ForgotPass() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const handleForgotPassword = async (email: string) => {
        
        try {

            const response = await fetch('http://localhost:5001/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {email} ),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Password reset email sent successfully:', data.message);
                navigation.navigate('UserLogin');
                // Show success message to the user
            } else {
                console.error('Error:', data.error);
                // Show error message to the user
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };
    
  
    

  return (

    

    <View style={styles.container}>
      <TouchableOpacity style={styles.topLeftButton} onPress={() => navigation.navigate('UserLogin')}>
      <Image source={require('../../assets/images/back_button.png')} />
      </TouchableOpacity>
      <Text style={styles.title}>Forgot password?</Text>
      <Text style={styles.subtitle}>Enter your email associated to your account below</Text>
      <TextInput 
       style={styles.input} 
       value={email}
       onChangeText={setEmail} 
       placeholder={'Email address'}
       />
       <TouchableOpacity style={styles.button}onPress={() => handleForgotPassword(email)}>
      <Text style={styles.buttonText}>Send recovery email</Text>
    </TouchableOpacity>

    </View>
  );
}

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
    marginTop: -10,
  },
  subtitle: {
    fontFamily: 'Merriweather Sans',
    textAlign: 'center',
    paddingHorizontal: 40,
    fontSize: 17,
    color: colors.textTertiary,
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.primary,  // Red color similar to the one in the image
    borderRadius: 20,  // Rounded edges
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
    color: 'white',  // White text
    fontSize: 17,
    fontFamily: 'Merriweather Bold'
    
  },
  secondaryButton: {
    fontSize: 17,
    color: colors.textSecondary,
    fontFamily: 'Merriweather Sans',
    
  }
});