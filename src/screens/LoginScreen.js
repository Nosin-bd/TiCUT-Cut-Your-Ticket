import { Button, Text, View } from 'native-base';
import React, { useState, useContext, useEffect } from 'react';
import {  StyleSheet, TouchableOpacity } from 'react-native';
import FormInput from '../components/FormInput';
import { AuthContext } from '../navigation/AuthProvider';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [logingLoading, setLoginLoading] = useState(false);

  const makeLogin = async (email,password) => {
    setLoginLoading(true);
    await login(email, password);
    setLoginLoading(false);
  }

  useEffect(() => {
    return () => {
      setLoginLoading(false);
      setEmail('');
      setPassword('');
    }
  },[]);

  return (
    <View style={styles.container} px={10}>
      <Text py={3} px={10} textAlign={'center'} mb={12} style={styles.text}>Welcome to Student Ticket Booking App</Text>
      <FormInput
        value={email}
        placeholderText='Email'
        onChangeText={userEmail => setEmail(userEmail)}
        autoCapitalize='none'
        keyboardType='email-address'
        autoCorrect={false}
      />
      <FormInput
        value={password}
        placeholderText='Password'
        onChangeText={userPassword => setPassword(userPassword)}
        secureTextEntry={true}
      />
      <Button w={150} isDisabled={(email.length < 1 || password.length < 1)} isLoadingText={'Login'} isLoading={logingLoading} size={'lg'} onPress={() => makeLogin(email, password)}>Login</Button>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.navButtonText}>New user? Join here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  text: {
    fontSize: 24,
    marginBottom: 10
  },
  navButton: {
    marginTop: 15
  },
  navButtonText: {
    fontSize: 20,
    color: '#6646ee'
  }
});
