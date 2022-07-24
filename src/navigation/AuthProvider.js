import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * This provider is created
 * to access user in whole app
 */

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const createUserInDb = ( uid, email, name, phone, deptId  ) => {
    return firestore().collection('users').doc(uid).set({
      uid,
      name,
      email,
      phone,
      deptId
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userDetails,
        setUserDetails,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password, name, phone, deptId) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password).then((u)=>{
              const { uid } = u.user;
              u.user.sendEmailVerification();
              createUserInDb(uid, email, name, phone, deptId);
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
