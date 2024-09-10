import { TouchableOpacity } from "react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../assets/constants/colors";
import { Image } from "react-native";
export default function UserNav() {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/usernavpic.png')} />
      
      <Text style={styles.title}>Welcome to Calypso</Text>
      <Text style={styles.body}>Calypso is a mobile investment solution that allows you to monitor and share your financial assets across multiple different institutions</Text>
      <TouchableOpacity onPress={() => navigation.navigate('UserSignup')} style={styles.button}>
      <Text style={styles.buttonText}>Create account</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
      <Text style={styles.secondaryButton}>Login</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Merriweather Bold"
  },
  body: {
    marginTop: 30,
    marginBottom: 30,
    marginHorizontal: 30,
    fontSize: 17,
    color: colors.textTertiary,
    fontFamily: "Merriweather Sans",
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,  // Red color similar to the one in the image
    borderRadius: 20,  // Rounded edges
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