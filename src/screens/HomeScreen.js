import React, { useContext } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Image, Heading, Container, CheckIcon, FormControl, Select, WarningOutlineIcon, Button, View, IconButton, Flex } from 'native-base';
// @ts-ignore
import busImg from '../assets/images/Transport.jpg';
import { useState } from 'react';
import { HStack, Input } from 'native-base';
import DatesPicker from '../components/DatesPicker';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const win = Dimensions.get('window');
  const ratio = win.width / 200;
  const [date, setDate] = useState('');
  const [open, setOpen] = useState(false);
  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={busImg} alt="Transport Image" style={{
          width: win.width,
          height: 200,
        }} />
      <Heading py={3} mt={2} color={'theme.500'}>Book Your Ticket</Heading>
      <Container w={"95%"}>
          <FormControl isRequired>
            <Select accessibilityLabel="Select Destination Root" placeholder="Select Destination Root" _selectedItem={{
            bg: "theme.300",
            endIcon: <CheckIcon size={5} />
          }} mt="1">
              <Select.Item label="BAUET To Rajshahi" value="bauetToRaj" />
              <Select.Item label="Rajshahi - BAUET" value="RajToBauet" />
              <Select.Item label="BAUET to Natore" value="bauetToNatore" />
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Please select your location and destination root!
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired py={3}>
            <HStack>
              <Input flex={1} placeholder="Date" value={typeof date === 'string' ? '' :  date.toDateString()} isDisabled={true} />
              <Button variant={'outline'} size={'sm'} colorScheme='amber' onPress={() => setOpen(true)}  >Select date</Button>
              <DatesPicker date={new Date()} setDate={setDate} setOpen={setOpen} open={open} />
            </HStack>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Please select your location and destination root!
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <Select accessibilityLabel="Select Start Time" placeholder="Select Start Time" _selectedItem={{
            bg: "theme.300",
            endIcon: <CheckIcon size={5} />
          }} mt="1">
              <Select.Item label="BAUET To Rajshahi" value="bauetToRaj" />
              <Select.Item label="Rajshahi - BAUET" value="RajToBauet" />
              <Select.Item label="BAUET to Natore" value="bauetToNatore" />
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Please select your location and destination root!
            </FormControl.ErrorMessage>
          </FormControl>

          <View style={{width: '100%'}} alignItems={'center'} py={5}>
            <Button onPress={() => navigation.navigate('seatBooking')} backgroundColor={'theme.500'}>Submit</Button>
          </View>
          
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f1'
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
});
