import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useToast } from 'native-base';

/**
 * This provider is created
 * to access user in whole app
 */

export const AuthContext = createContext({});

export const AuthProvider = ({ children, navigation }) => {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const createUserInDb = ( uid, email, name, phone, deptId  ) => {
    return firestore().collection('users').doc(uid).set({
      uid,
      name,
      email,
      phone,
      deptId,
      isAdmin: false
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userDetails,
        setUserDetails,
        emailVerified,
        userLoading,
        login: async (email, password) => {
          try {
            setUserLoading(true);
            let fetchUser = await auth().signInWithEmailAndPassword(email, password);
            if(!fetchUser.user.emailVerified){
              setEmailVerified(false);
              await fetchUser.user.sendEmailVerification();
              try {
                await auth().signOut();
              } catch (e) {
                console.error(e);
              }
              toast.show({description: "Please confirm email verification for login. Link sent to your email!"});
            }else{
              setEmailVerified(true);
            }
          } catch (e) {
            toast.show({description: "The password is invalid or the user does not have a password!"});
            console.log(e);
          }
          setUserLoading(false);
        },
        register: async (email, password, name, phone, deptId) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password).then( async (u)=>{
              const { uid } = u.user;
              u.user.sendEmailVerification();
              let createUser = await createUserInDb(uid, email, name, phone, deptId);
              toast.show({description: "Registration Successfull! Please login after email verification."});

            });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
