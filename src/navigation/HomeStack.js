import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SitBookingScreen from '../screens/SitBookingScreen';
import DrawerStack from './DrawerStack';
import colorConfig from '../utils/colorConfig';
import { Text } from "native-base";
const Stack = createStackNavigator();
const HeaderColor = colorConfig.headerColor;

export default function HomeStack() {
  return (
   
      <Text>Progressing</Text>
  );
}
