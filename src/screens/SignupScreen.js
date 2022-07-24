import React, { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import { AuthContext } from '../navigation/AuthProvider';
import PhoneInput from "react-native-phone-number-input";

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deptId, setDeptId] = useState('');
  const { register } = useContext(AuthContext);
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState("");

  return (
    <View style={styles.container} w={'100%'}>
      <Text style={styles.text}>Create an account</Text>
      <FormInput
        value={name}
        placeholderText='Name'
        onChangeText={userName => setName(userName)}
        autoCapitalize='none'
        keyboardType='default'
        autoCorrect={false}
      />
      <FormInput
        value={deptId}
        placeholderText='Department ID'
        onChangeText={userDeptId => setDeptId(userDeptId)}
        autoCapitalize='none'
        keyboardType='numeric'
        autoCorrect={false}
      />
      {/* <FormInput
        value={phone}
        placeholderText='Phone'
        onChangeText={userPhone => setPhone(userPhone)}
        autoCapitalize='none'
        keyboardType='numeric'
        autoCorrect={false}
      /> */}

      <View>
        <PhoneInput
          ref={phoneInput}
          defaultValue={phone}
          defaultCode="BD"
          layout="first"
          onChangeText={(text) => {
            setPhone(text);
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text);
          }}
          countryPickerProps={{ withAlphaFilter: true }}
        />
      </View>
      
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
      <FormButton
        buttonTitle='Signup'
        onPress={() => register(email, password, name, phone, deptId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    marginBottom: 10
  }
});
