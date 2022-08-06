import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import { AuthContext } from './AuthProvider';
import Loading from '../components/Loading';
import HomeStack from './HomeStack';
import firestore from '@react-native-firebase/firestore';
import { BookingProvider } from '../providers/BookingProvider';
import {HStack, Spinner, Heading} from 'native-base';
import AdminHomeStack from './AdminHomeStack';

export default function Routes() {
  const { user, setUser, userLoading } = useContext(AuthContext);
  const { userDetails, setUserDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  async function getUser(uid){
    firestore().collection('users').doc(uid).get()
      .then(snapshot => {
        if(snapshot.exists){
          const data = snapshot.data();
          if(data){
            setUserDetails(data);
          }
          if (initializing) setInitializing(false);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('Error getting documents', err);
        return false;
      });
  }

  // Handle user state changes
  function onAuthStateChanged(u) {
    console.log('id', u);
    setUser(u);
    if(u && u.emailVerified){
      getUser(u.uid);
    }else{
      if (initializing) setInitializing(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {
        !user && !userDetails && userLoading && (
          <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Fetching user..." />
            <Heading color="primary.500" fontSize="md">
              Fetching user...
            </Heading>
          </HStack>
        )
      }
      {
        user && userDetails ? (
          <NavigationContainer>
            {
              userDetails.isAdmin  ? <AdminHomeStack /> : <BookingProvider><HomeStack /></BookingProvider>
            }
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <AuthStack />
          </NavigationContainer>
        )
      }
    </>
    
  );
}
