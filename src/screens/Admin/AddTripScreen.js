import React, { useState, useEffect } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { FormControl, Input, Stack, WarningOutlineIcon, Box, ScrollView, Button, View, HStack, Switch, Text, Badge, Modal } from 'native-base';
import styles from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import DatesPicker from '../../components/DatesPicker';
import TimePicker from '../../components/TimePicker';
import moment from 'moment';

export const AddTripScreen = () => {
    const toast = useToast();
    const [ trip, setTrip ] = useState({
        bus_name: '',
        date: '',
        start_time: '',
        routes: [],
        seats: [],
        status: true
    });
    const [ loading, setLoading ] = useState(false);
    const [ validation, setValidation ] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [openDate, setOpenDate] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const [ defaultSeats, setDefaultSeats ] = useState([]);
    const [ defaultRoutes, setDefaultRoutes ] = useState([]);
    const [ routes, setRoutes ] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      async function fetchRoutes() {
        const data = []
        const querySnapshot = await firestore().collection("routes").get();
        const snapshot = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        snapshot.forEach((doc) => {
            data.push(doc);
        });
  
        setDefaultRoutes(data);
      }

      async function fetchSeats() {
        let data = []
        const querySnapshot = await firestore().collection("default_seats").orderBy('date_time', 'asc').get();
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        let finalSeats = data.map(s=>{
          return {
            ...s,
            user: null,
            booked: false
          }
        })
        setDefaultSeats(finalSeats);
      }
  
      fetchRoutes();
      fetchSeats();
    }, []);

    const updateInput = (name, value) => {
      setTrip({
        ...trip,
        [name]: value,
      })
    }

    const onConfirmDate = (date) => {
      setOpenDate(false);
      const formatDate = moment(date).format("DD-MM-YYYY");
      setDate(formatDate);
    }

    const handleSubmit = ()=> {
        const formData = {
          bus_name: trip.bus_name,
          date: date,
          start_time: time,
          routes: routes,
          seats: defaultSeats,
          status: trip.status
        }
        setValidation(true);
        if( (formData.date != '' || formData.date != undefined) && formData.start_time.length && formData.routes.length && formData.seats.length && formData.bus_name.length ){
            setLoading(true);
            firestore()
            .collection('trips')
            .add(formData)
            .then(() => {
                setLoading(false);
                setDate('');
                setTime('');
                setRoutes([]);
                setTrip({
                  bus_name: '',
                  date: '',
                  start_time: '',
                  routes: [],
                  seats: [],
                  status: true
                });
                setValidation(false);
                toast.show({description: "Trip added successfully!"});
            });
        }else{
          toast.show({description: "Please fill all the required filled!"});
        }
    }

    const handleSetRoutes = (routeObject) => {
      let check = routes.every((r) => {
        if(r.id === routeObject.id && routeObject.selected === false){
          var resfil = routes.filter((rf) =>{
            return rf.id != routeObject.id;
          })
          setRoutes(resfil);
          return false;
        }
        return true;
      })
      if(check){
        setRoutes([...routes,routeObject]);
      }
    }


    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
            <Box w="100%">
                <FormControl isRequired>
                    <Stack mx="4" mb={3}>
                        <FormControl.Label>Bus Name</FormControl.Label>
                        <Input type="text" placeholder="Ex. BAUET BUS 1" onChangeText={(value) => updateInput('bus_name', value)} value={trip.bus_name || ''} />
                        <FormControl.ErrorMessage isInvalid={ !trip.bus_name.length && validation } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                    </Stack>
                    <Stack mx="4" mb={3}>
                      <HStack>
                          <Input flex={1} placeholder="Date" value={date} isDisabled={true} />
                          <Button ml={1} variant={'outline'} size={'sm'} colorScheme='amber' onPress={() => setOpenDate(true)}  >Select date</Button>
                          <DatesPicker date={new Date()} onConfirm={onConfirmDate} setOpen={setOpenDate} open={openDate} />
                      </HStack>
                      <FormControl.ErrorMessage w={'100%'} isInvalid={ (date == '' || date == undefined) && validation } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                    </Stack>

                    <Stack mx="4" mb={3}>
                      <HStack>
                          <Input flex={1} placeholder="Time" value={time} isDisabled={true} />
                          <Button ml={1} variant={'outline'} size={'sm'} colorScheme='amber' onPress={() => setOpenTime(true)}  >Select time</Button>
                          <TimePicker setTime={setTime} setOpen={setOpenTime} open={openTime} />
                      </HStack>
                      <FormControl.ErrorMessage w={'100%'} isInvalid={ !time.length && validation } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                    </Stack>

                    <Stack mx="4" mb={3} mt={3}>
                      <Button onPress={() => setShowModal(true)} backgroundColor={'amber.300'} width={130} mb={2}>Add routes</Button>
                      {
                        routes.length > 0 && (
                            <Box p={2} borderWidth={1} borderColor={'theme.200'}>
                            {
                                routes.map((route, i) => {
                                  return (
                                    <Text p={1} key={route.id} alignSelf={'flex-start'} colorScheme="info">{route.from} - {route.to} - {route.fares} Tk.</Text>
                                  );
                                })
                            }
                          </Box>
                        )
                      }
                      <FormControl.ErrorMessage w={'100%'} isInvalid={ !routes.length && validation } leftIcon={<WarningOutlineIcon size="xs" />}>You must add atleast one route.</FormControl.ErrorMessage>

                      {/* Add Modal */}
                      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                            <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>Select routes for this trip.</Modal.Header>
                            <Modal.Body>
                              <Box py={1}>
                                <Stack direction={{
                                  base: "column",
                                  md: "row"
                                }} space={3} alignItems="flex-start">
                                  
                                  {
                                    defaultRoutes.map((r, index) => {
                                      var selected = routes.filter((er) => {
                                        if(r.id === er.id && er.selected ){
                                          return true;
                                        }
                                        return false;
                                      })
                                      selected = selected.length ? true : false;
                                      return (
                                        <HStack key={index} alignItems={'center'}>
                                          <CheckBox
                                            value={ selected || false}
                                            onValueChange={(val) => handleSetRoutes({id: r.id, from: r.from, to: r.to, fares: r.fares, selected: val})}
                                            style={styles.checkbox}
                                          />
                                          <Text fontSize={12}>{r.from} - {r.to} ({r.fares} Tk.)</Text>
                                        </HStack>
                                        
                                      );
                                    })
                                  }
                                </Stack>
                              </Box>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                                }}>
                                    Close
                                </Button>
                                </Button.Group>
                            </Modal.Footer>
                            </Modal.Content>
                        </Modal>

                    </Stack>

                    <HStack mx="4" alignItems={'center'} mb={3} space={4}>
                        <FormControl.Label isRequired={false}>Status : </FormControl.Label>
                        <Switch onValueChange={(value) => updateInput('status', value)} size="sm" isChecked={trip.status || false} />
                    </HStack>

                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} pr={4} mt={6}>
                        <Button bg={'theme.500'} onPress={handleSubmit} w={120} flex={1} isLoading={loading} spinnerPlacement="end" isLoadingText="Adding">Add Trip</Button>
                    </View>
                </FormControl>
            </Box>
            <Text mx="4" mb={3} fontSize={12} mt={14}>
              Default seats will be added dynamically. you can easily modify default seats, routes and fares later!
            </Text>
            </ScrollView>
        </SafeAreaView>
    )
}
