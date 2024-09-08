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
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="UserNav" component={UserNav} />
        <Stack.Screen name="UserLogin" component={UserLogin} />
        <Stack.Screen name="UserSignup" component={UserSignup} />
        <Stack.Screen name="HomePage" component={HomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}
export default App;
