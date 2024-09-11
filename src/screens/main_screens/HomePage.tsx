import { link } from 'fs';
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { create, open, dismissLink, LinkSuccess, LinkExit, LinkIOSPresentationStyle, LinkLogLevel } from 'react-native-plaid-link-sdk';
import colors from '../../assets/constants/colors';
import { useAuth } from '../../AuthContext';

const HomeScreen = ({ route, navigation }: any) => {
  const { userInfo, authToken } = useAuth();
  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  const data = [
    { title: 'Investments', description: '30% return' },
    { title: 'Savings', description: '60% return' },
    { title: 'Checking', description: '90% return' },
  ];


  console.log("userinfo on home page" + userInfo);

  const handlePress = (index: number) => {
    setSelectedTab(index === selectedTab ? null : index); // Toggle the selected tab
  };


  return (
    <View style={styles.container}>

      <View style = {styles.header}>
        <Text style={styles.title}>Welcome, Pranav</Text>
        <View style={styles.card}>
            <Text style={styles.title3}>Your total asset portfolio</Text>
            <Text style={styles.amount}>$1,000,000</Text>
        </View>
            <Text style={styles.title2}> Your accounts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
              <Text style= {styles.title4}>See All →</Text>
            </TouchableOpacity>


      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, selectedTab === index && styles.selectedTab]} // Highlight selected tab
            onPress={() => handlePress(index)}
          >
            <Text style={styles.tabTitle}> {item.title}</Text>
            <Text style={styles.tabDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>  

  {/* Reveal Content Below */}
  {selectedTab !== null && (
        <View style={styles.content}>
          <Text style={styles.contentText}>
            {data[selectedTab].title} details go here.
          </Text>
        </View>
      )}


    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  title4: {
    color: colors.primary,
    fontFamily: "Merriweather Bold",
    fontSize: 18,
    alignSelf: 'flex-end',
    marginEnd: '7%',
    marginTop: -10,
    marginBottom: 10,
  },
  header: {
    marginTop: '20%',
  },
  card:{
    width: '90%',
    height: 80,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    paddingTop: 10,
    paddingLeft: 20,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    shadowColor: '#000', // Color of the shadow
    shadowOpacity: 0.25, // Opacity of the shadow (0 to 1)
    shadowOffset: { width: 0, height: 2 }, // Offset of the shadow
    shadowRadius: 4,
  },
  sideside: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      
  },
  title3: {
    fontFamily: 'Merriweather Sans',
    color: "white",
    fontSize: 16,
  },
  amount: {
    fontFamily: "Merriweather Bold",
    color: "white",
    fontSize: 30,
  },
  title2: {
      paddingTop: 20,
      fontFamily: 'Merriweather Bold',
      alignSelf: "flex-start",
      paddingStart: "7%",
      fontSize: 22,
      color: colors.textPrimary,
      marginBottom: 30,
      
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
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: 10,
    alignSelf: "flex-start",
    paddingStart: '7%',
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
    
    
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  tab: {
    width: 150,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Color of the shadow
    shadowOpacity: 0.25, // Opacity of the shadow (0 to 1)
    shadowOffset: { width: 0, height: 2 }, // Offset of the shadow
    shadowRadius: 4,
  },
  selectedTab: {
    backgroundColor: colors.secondary, // Highlight the selected tab
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  tabDescription: {
    fontSize: 12,
    color: '#000',
  },
  content: {
    flex: 1,
    marginTop: -400,
    top: 10,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000', // Color of the shadow
    shadowOpacity: 0.25, // Opacity of the shadow (0 to 1)
    shadowOffset: { width: 0, height: 2 }, // Offset of the shadow
    shadowRadius: 4,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
});
