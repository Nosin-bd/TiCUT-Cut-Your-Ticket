import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Image, Heading, CheckIcon, FormControl, Select, WarningOutlineIcon, Button,ScrollView, View, Stack, Box,Text, HStack, Spinner, Input, Badge} from 'native-base';
// @ts-ignore
import busImg from '../assets/images/Transport.jpg';
import { useState } from 'react';
import DatesPicker from '../components/DatesPicker';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { useToast } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const win = Dimensions.get('window');
  const [trips, setTrips] = useState([]);
  const [date, setDate] = useState('');
  const [open, setOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInit, setSearchInit] = useState(false);
  const [routeInit, setRouteInit] = useState(false);
  const [dateInit, setDateInit] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('');

  const toast = useToast();
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchRoutes() {
      const data = []
      const querySnapshot = await firestore().collection("routes").get();
      const snapshot = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      snapshot.forEach((doc) => {
          data.push(doc);
      });
      setRoutes(data);
    }
    fetchRoutes();
    return () => {
      setTrips([]),
      setDate(''),
      setOpen(false),
      setRoutes([]),
      setSearchLoading(false),
      setSearchInit(false),
      setRouteInit(false),
      setDateInit(false),
      setSelectedRouteId('')
    }
  }, []);

  const onConfirmDate = (d) => {
    setOpen(false);
    const formatDate = moment(d).format("DD-MM-YYYY");
    setDate(formatDate);
    setDateInit(true);
    if(routeInit){
      selectedRouteId.length ? fetchTrips(selectedRouteId, formatDate) : toast.show({description: "Please select journey route!"});
    }else if(selectedRouteId.length > 1){
      fetchTrips(selectedRouteId, formatDate)
    }
  }

  const changeRoute = (val) => {
    setSelectedRouteId(val);
    setRouteInit(true);
    date.length > 1 ? fetchTrips(val, date) : toast.show({description: "Please select journey date!"});
     
  }

  async function fetchTrips(routeId, currentDate) {
      setSearchLoading(true);
      setSearchInit(true);
      setTrips([]);
      const querySnapshot = await firestore().collection("trips").where('date', '==', currentDate).get();
      var snapshot = querySnapshot.docs.reduce(function(filtered, trip) {
        let returnObj = {
          id: trip.id, ...trip.data()
        }
        let checkRoute = returnObj.routes.some((r) => {
          return r.id == routeId;
        })
        if(checkRoute) {
           filtered.push(returnObj);
        }
        return filtered;
      }, []);
      setTrips(snapshot);
      setSearchLoading(false);
  }


  return (
    <SafeAreaView>
        <ScrollView style={homeStyles.container} h={'100%'} w={'100%'}>
        <Image source={busImg} alt="Transport Image" style={{
            width: win.width,
            height: 200,
          }} />
        <Heading pl={6} py={3} mt={2} color={'theme.500'}>Book Your Ticket</Heading>
        <Stack px={6} pb={6} alignContent={'center'}>
            <FormControl isRequired py={3}>
              <HStack>
                <Input flex={1} placeholder="Select Journey Date" value={date} isDisabled={true} />
                <Button variant={'outline'} size={'sm'} color={'theme.button'} onPress={() => setOpen(true)}  >Select date</Button>
                <DatesPicker date={new Date()} onConfirm={onConfirmDate} setOpen={setOpen} open={open} />
              </HStack>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Please select journey date!
              </FormControl.ErrorMessage>
            </FormControl>

            {
              routes.length > 0 && (
                <FormControl isRequired>
                  <Select color={'gray.500'} accessibilityLabel="Select Available Root" onValueChange={(value) => { changeRoute(value); }} onC placeholder="Select Available Root" _selectedItem={{
                  bg: "theme.300",
                  endIcon: <CheckIcon size={5} />
                }} mt="1">
                  {
                    routes.map((r,i) => {
                      let label = `${r.from} to ${r.to}`;
                      return (
                        <Select.Item color={'gray.100'} key={r.id} label={label} value={r.id} />
                      )
                    })
                  }
                  </Select>
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Please select location and destination root!
                  </FormControl.ErrorMessage>
                </FormControl>
              )
            }
          
            {
              trips.length > 0 && (
                <Stack my={4} w={'100%'}>
                  <Heading my={3} color={'theme.600'} size="sm">Available bus:</Heading>
                  {
                    trips.map((trip,index) => {
                      let busRoute = trip.routes.filter((br) => {
                        return br.id = selectedRouteId;
                      })
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
                                    <Heading color={'black'} size="xs">{trip.bus_name}</Heading>
                                    {
                                      busRoute.length > 0 && (
                                        <HStack flexWrap={'wrap'}>
                                          <Badge w={'55%'} bg="theme.third"><Text>{`${busRoute[0].from }- ${busRoute[0].to}`}</Text></Badge>
                                          <Badge w={'45%'} bg="theme.third"><Text>{`Fares: ${busRoute[0].fares} Tk.`}</Text></Badge>
                                          <Badge w={'100%'} bg="theme.third"><Text>{`Departure date: ${trip.date}`}</Text></Badge>
                                          <Badge w={'50%'} bg="theme.third"><Text>{`Time : ${trip.start_time}`}</Text></Badge>
                                          <Badge w={'50%'} bg={'theme.third'}><Text>Available seats: {availableSeat.length}</Text></Badge>
                                        </HStack>
                                      )
                                    }
                                    <HStack justifyContent={'flex-end'}>
                                      <Button size={'xs'} bg={'theme.button'} ml={3} onPress={() => {
                                          navigation.navigate('seatBooking', {
                                            tripId: trip.id,
                                            routeId: selectedRouteId
                                          });
                                        }}>Book Now</Button>
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
              (trips.length < 1 && !searchLoading && searchInit) && (
                <Heading w={'100%'} py={10} textAlign={'center'} color={'warning.600'} size="sm">No bus available!</Heading>
              )
            }

            {
              searchLoading && (
                <HStack mt={4} space={2} justifyContent="center">
                  <Spinner accessibilityLabel="Loading posts" />
                  <Heading color="primary.500" fontSize="md">
                    Searching available buses...
                  </Heading>
                </HStack>
              )
            }

            {
              routes.length < 1 && (
                <HStack mt={4} space={2} justifyContent="center">
                  <Spinner accessibilityLabel="Loading posts" />
                  <Heading color="primary.500" fontSize="md">
                    Searching available routes...
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
