// screens/BlankPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import UserLogin from './screens/auth_screens/UserLogin';
import LandingPage from './screens/LandingPage';
import UserNav from './screens/auth_screens/UserNav';
import UserSignup from './screens/auth_screens/UserSignup';
import HomePage from './screens/main_screens/HomePage';
import LinkAccount from './screens/auth_screens/LinkAccount';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserNav" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserNav" component={UserNav} />
        <Stack.Screen name="UserLogin" component={UserLogin} />
        <Stack.Screen name="UserSignup" component={UserSignup} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="LinkAccount" component={LinkAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}
export default App;
