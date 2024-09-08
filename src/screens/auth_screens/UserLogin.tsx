import { Button, Alert, TextInput } from "react-native";
import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";



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
        navigation.navigate('HomePage');
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
      <Text>Welcome to the Login Page!</Text>
      <TextInput 
       style={styles.input} 
       value={email}
       onChangeText={setEmail} 
       placeholder={'email'}
       />
       <TextInput
       style={styles.input} 
       value={password}
       onChangeText={setPassword} 
       placeholder={'password'}
       secureTextEntry = {true}
       />
       <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin}/>
       <Button title={"new user? click here to signup"} onPress={() => navigation.navigate('UserSignup')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});