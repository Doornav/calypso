import { Button } from "react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function UserNav() {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the New Screen!</Text>
      <Button title="Login" onPress={() => navigation.navigate('UserLogin')}/>
      <Button title="Signup" onPress={()  => navigation.navigate("UserSignup")}/>
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