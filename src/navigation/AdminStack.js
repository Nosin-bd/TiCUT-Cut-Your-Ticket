import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SitBookingScreen from '../screens/SitBookingScreen';
import AdminDrawerStack from './AdminDrawerStack';

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator initialRouteName="DrawerStack">
      <Stack.Screen name='AdminDrawerStack' component={AdminDrawerStack} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}
