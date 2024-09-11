
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { create, open, dismissLink, LinkSuccess, LinkExit, LinkIOSPresentationStyle, LinkLogLevel } from 'react-native-plaid-link-sdk';
import colors from '../../assets/constants/colors';
import { Image } from 'react-native';
import { useAuth } from '../../AuthContext';
const AccountsPage = ({ route, navigation }: any) => {
  const { userInfo, authToken } = useAuth();

  console.log(userInfo);
  return (
    <View style={styles.container}>
      <Text>accounts pgae</Text>
     
    </View>
  );
};

export default AccountsPage;

const styles = StyleSheet.create({
  header:{
    alignItems: 'flex-start',
    marginStart: -20,
    marginVertical: 10,
    marginTop: -60,
  },
  title:{
    fontFamily: 'Merriweather Bold',
    fontSize: 30,
  },
  subtitle: {
    fontFamily: 'Merriweather Sans',
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  buttonText: {
    fontFamily: 'Merriweather Regular',
    fontSize: 20,
    color: 'black',
  },
  settingsButton: {
    width: '90%',
    height: 60,
    backgroundColor :'#f0f0f0',
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
  }

});