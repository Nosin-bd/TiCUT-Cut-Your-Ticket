import * as React from 'react';
import {useContext} from 'react';
import { View } from 'native-base';
import { createDrawerNavigator, DrawerContentScrollView,
  DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';
import { AdminHomeScreen } from '../screens/Admin/AdminHomeScreen';
import { AddTripScreen } from '../screens/Admin/AddTripScreen';
import { ViewTripScreen } from '../screens/Admin/ViewTripScreen';
import { AddRouteScreen } from '../screens/Admin/AddRouteScreen';
import { ViewRouteScreen } from '../screens/Admin/ViewRouteScreen';
import { DefaultSeatScreen } from '../screens/Admin/DefaultSeatScreen';
import BookingScreen from '../screens/Admin/BookingScreen';
import { RecordScreen } from '../screens/Admin/RecordScreen';


function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex:1}}>
        <DrawerItemList {...props}  style={{borderWidth:1}}/>
        <View style={{flex:1,marginVertical:20,borderWidth:1}}>
          {/* here's where you put your logout drawer item*/}
          <DrawerItem 
            label="Log out"
            onPress={logout}
            style={{flex:1,justifyContent:'flex-end'}}
          />
        </View>
      </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function AdminDrawerStack() {
  return (
    <Drawer.Navigator initialRouteName="AdminHome" screenOptions={{ headerStyle: { backgroundColor: '#FD5602' }, headerTintColor: '#fff' }} drawerContent={props => <CustomDrawerContent {...props} />} >
        <Drawer.Screen name="AdminHome" options={{ title: 'Admin Dashboard' }} component={AdminHomeScreen} />
        <Drawer.Screen name="AddTrip" options={{ title: 'Add a Trip' }} component={AddTripScreen} />
        <Drawer.Screen name="ViewTrips" options={{ title: 'View Trips' }} component={ViewTripScreen} />
        <Drawer.Screen name="AddRoute" options={{ title: 'Add a Route' }} component={AddRouteScreen} />
        <Drawer.Screen name="ViewRoute" options={{ title: 'View Routes' }} component={ViewRouteScreen} />
        <Drawer.Screen name="DefaultSeat" options={{ title: 'Default Seat' }} component={DefaultSeatScreen} />
        <Drawer.Screen name="RecordScreen" options={{ title: 'Access Record' }} component={RecordScreen} />
    </Drawer.Navigator>
  );
}