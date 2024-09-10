import { Button, Alert, TextInput, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../assets/constants/colors";


export default function UserLogin() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');


    const handleLogin = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          setLoading(false);
          Alert.alert("Success", "Login successful!");
          console.log("User Info:", data.user); // Log or use the user information
        navigation.navigate('HomePage', {userInfo: data.user});
        } else {
          setLoading(false);
          Alert.alert("Login Errodasfasdfr", data.error || "Login failed. Please try again.");
        }
      } catch (error) {
        setLoading(false);
        Alert.alert("Network Error", "Unable to connect to the server. Please try again later.");
      }
    };
  
    

  return (

    

    <View style={styles.container}>
      <TouchableOpacity style={styles.topLeftButton} onPress={() => navigation.navigate('UserNav')}>
      <Image source={require('../../assets/images/back_button.png')} />
      </TouchableOpacity>
      <Text style={styles.title}>Welcome to Calypso</Text>
      <Text style={styles.subtitle}>Track all your financials</Text>
      <TextInput 
       style={styles.input} 
       value={email}
       onChangeText={setEmail} 
       placeholder={'Email address'}
       />
       <TextInput
       style={styles.input} 
       value={password}
       onChangeText={setPassword} 
       placeholder={'Password'}
       secureTextEntry = {true}
       />
       <TouchableOpacity style={styles.button}onPress={handleLogin}>
      <Text style={styles.buttonText}>Log in to account</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('UserSignup')}>
      <Text style={styles.secondaryButton}>New to Calypso?</Text>
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