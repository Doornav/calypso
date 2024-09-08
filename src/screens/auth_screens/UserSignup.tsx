import { Button, Alert, TextInput } from "react-native";
import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function UserSignup() {
   
    const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSignup = async () => {
    console.log("asdfsf")
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'User registered successfully!');
        console.log("User Info:", data.user); // Log or use the user information
        navigation.navigate('HomePage')
      } else {
        Alert.alert('Signup Error', data.error || 'Unknown error occurred.');
      }
    } catch (error) {
      // Alert.alert('Network Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Signup!</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName} 
        placeholder={'Display Name'}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail} 
        placeholder={'Email'}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword} 
        placeholder={'Password'}
        secureTextEntry={true}
      />
      <Button title={loading ? "Signing up..." : "Sign Up"} onPress={handleSignup} />
      <Button title="Already have an account? Login here" onPress={() => navigation.navigate('UserLogin')} />
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