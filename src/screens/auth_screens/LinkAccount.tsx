
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { create, open, dismissLink, LinkSuccess, LinkExit, LinkIOSPresentationStyle, LinkLogLevel } from 'react-native-plaid-link-sdk';
import colors from '../../assets/constants/colors';
import { Image } from 'react-native';

const LinkAccount = ({ route, navigation }: any) => {
  const [linkToken, setLinkToken] = useState(null);
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
  const {userInfo} = route.params;

  const createLinkToken = useCallback(async () => {
    await fetch(`http://localhost:5001/users/create_link_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ address: address })
    })
      .then((response) => response.json())
      .then((data) => {
        setLinkToken(data.link_token);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setLinkToken]);

  useEffect(() => {
    if (linkToken == null) {
      createLinkToken();
    } else {
      const tokenConfiguration = createLinkTokenConfiguration(linkToken);
      create(tokenConfiguration);
    }
  }, [linkToken]);

  const createLinkTokenConfiguration = (token: string, noLoadingState: boolean = false) => {
    return {
      token: token,
      noLoadingState: noLoadingState,
    };
  };

  const createLinkOpenProps = () => {
    return {
      onSuccess: async (success: LinkSuccess) => {
        await fetch(`http://localhost:5001/users/exchange_public_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: userInfo.uid, public_token: success.publicToken }),
        })
          .catch((err) => {
            console.log(err);
          });
        navigation.navigate('HomePage', {userInfo});
        
      },
      onExit: (linkExit: LinkExit) => {
        console.log('Exit: ', linkExit);
        dismissLink();
      },
      iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
      logLevel: LinkLogLevel.ERROR,
    };
  };

  const handleOpenLink = () => {
    const openProps = createLinkOpenProps();
    open(openProps);
  };

  return (
    <View style={styles.container}>
    
    <Text style={styles.title}>Link your financials</Text>
    <Text style={styles.body}>Calypso uses Plaid to access your financials information across different institutions.</Text>
    <Text style={styles.body}>You will never be asked to provide, share, or distribute additional information</Text>
    <View style={styles.sideside}>
        <Image source={require('../../assets/images/plaid_logo.png')} />
        <Text style={styles.title2}>Calypso</Text>
    </View>
    
    <TouchableOpacity onPress={handleOpenLink} style={styles.button}>
    <Text style={styles.buttonText}>Connect accounts</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate('HomePage', {userInfo: userInfo})}>
    <Text style={styles.secondaryButton}>Skip for now</Text>
  </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
    sideside: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    title2: {
        fontFamily: 'Merriweather Bold',
        alignSelf: 'center',
        fontSize: 34,
        color: colors.textPrimary,
        
      },
    topLeftButton: {
      alignSelf: 'flex-start',
      marginStart: 30,
      marginTop: -140,
      marginBottom: 70,
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
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    input: {
      height: 60,
      width: 340,
      borderColor: "#828282",
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
      marginVertical: 8,
      fontFamily: 'Merriweather Sans',
    },
    title: {
      fontFamily: 'Merriweather Bold',
      fontSize: 34,
      color: colors.textPrimary,
      marginBottom: 10,
    },
    subtitle: {
      fontFamily: 'Merriweather Sans',
      fontSize: 17,
      color: colors.textTertiary,
      marginBottom: 40,
    },
    button: {
      backgroundColor: colors.primary,  // Red color similar to the one in the image
      borderRadius: 20,  // Rounded edges
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: 340,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
      marginTop: 30,
      marginBottom: 30,
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

export default LinkAccount;
