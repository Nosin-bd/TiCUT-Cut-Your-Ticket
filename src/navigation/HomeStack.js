import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SitBookingScreen from '../screens/SitBookingScreen';
import DrawerStack from './DrawerStack';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="DrawerStack">
      <Stack.Screen name='DrawerStack' component={DrawerStack} options={{headerShown: false}} />
      <Stack.Screen name='seatBooking' options={{headerBackTitleVisible: false, headerTitle: 'Select Available Seat(s)'}} component={SitBookingScreen} />
    </Stack.Navigator>
  );
}
