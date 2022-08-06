import React, { useState, useContext, useRef, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { View } from 'native-base';
import FormInput from '../components/FormInput';
import { AuthContext } from '../navigation/AuthProvider';
import PhoneInput from "react-native-phone-number-input";
import { Button } from 'native-base';
import { useToast } from 'native-base';
import firestore from '@react-native-firebase/firestore';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deptId, setDeptId] = useState('');
  const { register } = useContext(AuthContext);
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [records , setRecords] = useState([]);
  const toast = useToast();

  useEffect(() => {
    async function fetchRecords() {
      const data = []
      const querySnapshot = await firestore().collection("records").get();
      const snapshot = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      snapshot.forEach((doc) => {
          data.push(doc);
      });
      setRecords(data);
    }

    fetchRecords();
    return () => {
      setRecords([])
    }
  }, []);

  const makeRegister = async (email, password, name, phone, deptId) => {
    if(email.length && password.length && name.length && phone.length && deptId.length){
      setRegisterLoading(true);
      let permitted = records.find((r) => r.email == email);
      if(permitted){
        await register(email, password, name, phone, deptId);
        setRegisterLoading(false);
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setDeptId('');
      }else{
        toast.show({description: "You are not able to use this app!"});
        setRegisterLoading(false);
      }
    }else{
      toast.show({description: "Please fill all the filled!"});
    }
  }

  return (
    <View style={styles.container} px={10}>
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

      <View>
        <PhoneInput
          containerStyle={{ borderColor: 'gray', borderWidth: 1, marginVertical: 4, borderRadius: 5}}
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
      <Button w={150} isLoading={registerLoading && records.length > 0} isLoadingText={'Register'} size={'lg'} onPress={() => makeRegister(email, password, name, phone, deptId)}>Register</Button>
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
