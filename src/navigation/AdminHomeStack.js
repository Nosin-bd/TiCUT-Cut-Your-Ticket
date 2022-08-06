import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import colorConfig from '../utils/colorConfig';
import AdminDrawerStack from './AdminDrawerStack';
import { BookByScreen } from '../screens/Admin/BookByScreen';

const Stack = createStackNavigator();
const HeaderColor = colorConfig.headerColor;

export default function AdminHomeStack() {
  return (
    <Stack.Navigator initialRouteName="AdminDrawerStack">
      <Stack.Screen name='AdminDrawerStack' component={AdminDrawerStack} options={{headerShown: false}} />
      <Stack.Screen name='BookBy' options={{headerBackTitleVisible: false, headerStyle: { backgroundColor: HeaderColor }, headerTintColor: '#fff', headerTitle: 'Booked By'}} component={BookByScreen} />
    </Stack.Navigator>
  );
}
