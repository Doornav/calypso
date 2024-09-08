import { Button, Alert, TextInput } from "react-native";
import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";




export default function HomePage() {
    const [linkToken, setLinkToken] = useState('');

  // Fetch the link token when the component renders
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('http://localhost:5001/users/create_link_token', {
          method: 'POST', // Make sure this matches your backend route
          headers: {
            'Content-Type': 'application/json', // You may not even need this if there is no body data
          },
          // No need to include body if the API doesn't require it
        });

        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };

    fetchLinkToken();
  }, []);

  

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the HomePage</Text>
      <Button title="connect a bank" onPress={() => console.log("button pressed")}/>
      <Text>Your PLaid link toekn is: {linkToken}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});