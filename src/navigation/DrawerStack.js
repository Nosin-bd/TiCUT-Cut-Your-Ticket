import * as React from 'react';
import {useContext} from 'react';
import { Button, View } from 'native-base';
import { createDrawerNavigator, DrawerContentScrollView,
  DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import { AuthContext } from './AuthProvider';


function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back home</Button>
    </View>
  );
}

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

export default function DrawerStack() {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerStyle: { backgroundColor: '#FD5602' }, headerTintColor: '#fff' }} drawerContent={props => <CustomDrawerContent {...props} />} >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}