import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Heading,ScrollView, Stack, Box, HStack, Spinner, Badge} from 'native-base';
import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ViewTripScreen = () => {
  const [trips, setTrips] = useState([]);
  const [searchLoading, setSearchLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTrips() {
      const data = []
      const querySnapshot = await firestore().collection("trips").orderBy('date_time', 'desc').get();
      const snapshot = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      snapshot.forEach((doc) => {
          data.push(doc);
      });
      if(isMounted){
        setTrips(data);
        setSearchLoading(false);
      }
    }

    fetchTrips();
    return () => {
      isMounted = false
    }
  }, [trips, searchLoading]);

  
  return (
    <SafeAreaView>
        <ScrollView style={homeStyles.container} h={'100%'} w={'100%'}>
        
        <Stack px={6} pb={6} alignContent={'center'}>
            
          
            {
              trips.length > 0 && (
                <Stack my={4} w={'100%'}>
                  <Heading my={3} size="sm">All Trips:</Heading>
                  {
                    trips.map((trip,index) => {
                        let availableSeat = trip.seats.filter((s) => {
                          return s.booked == false;
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
                                    {/* <Badge bg={'theme.400'}><Text color={'theme.color'}>{`${trip.route.from }- ${trip.route.to}`}</Text></Badge> */}
                                        <HStack flexWrap={'wrap'}>
                                          {/* <Badge w={'100%'} bg="theme.second">{`Start date: ${trip.date}`}</Badge> */}
                                          <Badge w={'100%'} bg="theme.second">{`Departure time : ${trip.date} (${trip.start_time})`}</Badge>
                                          <Badge colorScheme="coolGray">{`Available seats: ${availableSeat.length}`}</Badge>
                                        </HStack>
                                    <HStack justifyContent={'flex-end'}>
                                      {/* <Button size={'xs'} bg={'theme.button'} ml={3}>Download Ticket</Button> */}
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
