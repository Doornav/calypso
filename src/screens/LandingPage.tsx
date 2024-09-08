import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text >Welcome to Calypso: A mobile investment solution</Text>
      <Button title="get started" onPress={() => navigation.navigate('UserNav') }/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  }
});

export default LandingPage;