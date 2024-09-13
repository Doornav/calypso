import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChangeInfo from './screens/auth_screens/ChangeInfo';
import ForgotPass from './screens/auth_screens/ForgotPass';
import UserLogin from './screens/auth_screens/UserLogin';
import UserNav from './screens/auth_screens/UserNav';
import UserSignup from './screens/auth_screens/UserSignup';
import HomePage from './screens/main_screens/HomePage';
import LinkAccount from './screens/auth_screens/LinkAccount';
import AccountsPage from './screens/main_screens/AccountsPage';
import SettingsPage from './screens/main_screens/SettingsPage';
import colors from './assets/constants/colors';
import { AuthProvider } from './AuthContext';
import VerifyEmail from './screens/auth_screens/VerifyEmail';
// Initialize navigators
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create Bottom Tabs Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          bottom: 30,
          left: 20,
          right: 20,
          borderRadius: 40,

          paddingTop: 20,
          backgroundColor: colors.primary,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
        },
        tabBarActiveTintColor: '',
        tabBarInactiveTintColor: 'white',
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Accounts" component={AccountsPage} />
      <Tab.Screen name="Profile" component={SettingsPage} />
    </Tab.Navigator>
    
  );
}

// // Drawer Navigator that wraps the BottomTabs
// function MyDrawer() {
//   return (
//     <Drawer.Navigator screenOptions={{ headerShown: false }}>
//       {/* The BottomTabs are now inside the Drawer */}
//       <Drawer.Screen name="MainApp" component={BottomTabs} options={{ title: 'Home' }} />
//       <Drawer.Screen name="SettingsPage" component={SettingsPage} />
//       {/* Add any additional screens you want in the drawer */}
//     </Drawer.Navigator>
//   );
// }

// Root Stack Navigator
const App = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserNav" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserNav" component={UserNav} />
        <Stack.Screen name="UserLogin" component={UserLogin} />
        <Stack.Screen name="UserSignup" component={UserSignup} />
        <Stack.Screen name="LinkAccount" component={LinkAccount} />
        {/* Use MyDrawer as the main app navigator */}
        <Stack.Screen name="MainApp" component={BottomTabs} />
        <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
