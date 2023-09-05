import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator,createDrawerNavigator, createBottomTabNavigator } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../../pages/HomePage/HomePageMain';
// import LinksScreen from '../screens/LinksScreen';
// import SettingsScreen from '../screens/SettingsScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
//   LinksStack,
//   SettingsStack,
})