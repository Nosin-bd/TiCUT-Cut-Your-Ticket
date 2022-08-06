import React, { useContext, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Image, Heading, CheckIcon, FormControl, Select, WarningOutlineIcon, Button,ScrollView, View, Stack, Box,Text, HStack, Spinner, Input, Badge} from 'native-base';

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useToast } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingScreen() {
  const [trips, setTrips] = useState([]);
  const [searchLoading, setSearchLoading] = useState(true);

  const toast = useToast();
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchRoutes() {
      const data = []
      const querySnapshot = await firestore().collection("bookings").get();
      const snapshot = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      snapshot.forEach((doc) => {
          data.push(doc);
      });
      setTrips(data);
      setSearchLoading(false);
    }

    fetchRoutes();
    return () => {
      setTrips([]),
      setSearchLoading(true)
    }
  }, []);

  
  return (
    <SafeAreaView>
        <ScrollView style={homeStyles.container} h={'100%'} w={'100%'}>
        
        <Stack px={6} pb={6} alignContent={'center'}>
            
          
            {
              trips.length > 0 && (
                <Stack my={4} w={'100%'}>
                  <Heading my={3} size="sm">Bookings:</Heading>
                  {
                    trips.map((trip,index) => {
                        let seatsName = '';
                        trip.seats.forEach((s) => {
                            seatsName += s.name + ' ';
                        })
                        
                      return (
                        <Box key={index} mb={2} alignItems="center">
                            <Box w={'100%'} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                                borderColor: "coolGray.600",
                                backgroundColor: "gray.700"
                              }} _web={{
                                shadow: 2,
                                borderWidth: 0
                              }} _light={{
                                backgroundColor: "gray.50"
                              }}>
                                <Stack p={3} space={3}>
                                  <Stack space={2}>
                                    <Heading color={'theme.600'} size="xs">{trip.bus_name}</Heading>
                                    <Badge bg={'theme.400'}><Text color={'theme.color'}>{`${trip.route.from }- ${trip.route.to}`}</Text></Badge>
                                        <HStack flexWrap={'wrap'}>
                                          <Badge w={'60%'} bg="theme.second">{`Seat(s): ${seatsName}`}</Badge>
                                          <Badge w={'40%'} bg="theme.second">{`Fares: ${trip.fares} Tk.`}</Badge>
                                          <Badge w={'100%'} bg="theme.second">{`Departure time : ${trip.trip_date} (${trip.trip_time})`}</Badge>
                                          <Badge w={'100%'} bg={'theme.second'}>{`Booked date: ${trip.booked_date}(${trip.booked_time})`}</Badge>
                                          <Badge colorScheme="coolGray">{`Status: ${trip.status == 1 ? 'Processing' : 'Confirmed'}`}</Badge>
                                        </HStack>
                                    <HStack justifyContent={'flex-end'}>
                                        <Button size={'xs'} bg={'theme.button'} onPress={() => {
                                          navigation.navigate('BookBy', {
                                            user_id: trip.user_id,
                                          });
                                        }} ml={3}>Booked By</Button>
                                    </HStack>
                                    
                                  </Stack>
                                </Stack>
                            </Box>
                          </Box>
                          );
                        })
                      }
                </Stack>
              )
            }

            {
              searchLoading && (
                <HStack mt={4} space={2} justifyContent="center">
                  <Spinner accessibilityLabel="Loading posts" />
                  <Heading color="primary.500" fontSize="md">
                    Searching trips...
                  </Heading>
                </HStack>
              )
            }
            
          </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f1'
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
});
