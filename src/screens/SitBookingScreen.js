import React, { useEffect, useState, useCallback, useMemo, useRef, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Heading,View, Row, HStack, Spinner, ScrollView, Text, Badge, Box } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import BottomSheet from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../utils/styles';
import { AuthContext } from '../navigation/AuthProvider';
import moment from 'moment';
import { useToast } from 'native-base';

export default function SitBookingScreen({route,navigation}) {
  const toast = useToast();
  const { user, setUser } = useContext(AuthContext);
  const seatColor = {
    available: 'gray.500',
    booked: 'red.500',
    selected: 'green.500',
    disabled: 'black.400'
  }

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['3%', '25%', '40%'], []);

  const { tripId, routeId } = route.params;
  const [currentTrip, setCurrentTrip] = useState(null);
  const [seats, setSeats] = useState([]);
  const [locationRoute, setLocationRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seatLoader, setSeatLoader] = useState(false);

  useEffect(() => {
    fetchTrips();
  },[fetchTrips]);

  const fetchTrips = useCallback(async (returnPromis = false) => {
      const querySnapshot = await firestore().collection("trips").doc(tripId).get();
      let data = querySnapshot.data();
      data['id'] = querySnapshot.id;
      setCurrentTrip(data);

      let routeFound = false;

      for (let obj of data.routes) {
        if(obj.id == routeId){
          routeFound = true;
          setLocationRoute(obj);
          break;
        }
      }

      if(routeFound){
        let map_seat = [];
        let temp = [];
        data.seats.forEach((s, i) => {
            i++;
            let pos = i%4 === 0 ? 4 : i%4;
            temp.push(s);
            if(pos === 4){
                map_seat.push(temp);
                temp= [];
            }else if(data.length === i){
                map_seat.push(temp);
                temp= [];
            }
        })
        setSeats(map_seat);
      }
      if(returnPromis){
        return data;
      }
  }, [])


  const handleSelectSeats = (sit) => {
    setSeatLoader(true);
    let isSelected = selectedSeats.some((s) => {
      return sit.date_time == s.date_time;
    })
    if(isSelected){
      setSelectedSeats(current => 
        current.filter(val => {
           return val.date_time != sit.date_time;
        })
      );
    }else{
      setSelectedSeats((current) => [...current,sit]);
    }
    setSeatLoader(false);
  }

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleSubmit = async ()=> {
      setLoading(true);
      let passengerSeats = selectedSeats.map((s) => {
        s.user = user.uid;
        s.booked = true;
        return s;
      })

      const formData = {
        user_id : user.uid,
        transaction_code: '',
        trip_id: tripId,
        route_id: routeId,
        fares: locationRoute.fares,
        seats: passengerSeats,
        booked_date: moment().format('YYYY-MM-DD'),
        booked_time: moment().format('hh:mm A')
      }
      fetchTrips(true).then((resData) => {
        let checkSeats = false;
        let checkFlag = false;
        let alreadyBooked = [];

        for (let s of resData.seats) {
          checkSeats = passengerSeats.find(ts => (s.date_time == ts.date_time && s.booked));
          if(checkSeats){
            console.log('checkSeats', s );
            checkFlag = true;
            alreadyBooked.push(s);
          }
        }
        let CheckChar =  '';
        alreadyBooked.forEach((b) => {
          setSelectedSeats((current) => 
            current.filter((fs) => {
              return fs.date_time != b.date_time;
            })
          )
          CheckChar += ` ${b.name}`;
        });

        if(checkFlag){
          toast.show({description: `Seat ${CheckChar} already booked!`});
        }else{
          let seatsData = currentTrip.seats.map((s) => {
            let mappedData = s;
            let seatFound = passengerSeats.find(sseat => {
              return sseat.date_time == s.date_time;
            });
            passengerSeats.forEach((ps) => {
              if(ps.date_time == s.date_time){
                mappedData = ps;
              }
            })
            return seatFound ? mappedData : s;
          })

          if( formData.seats.length ){
            const docRef = firestore().collection('trips').doc(tripId);
            docRef.update({
              seats: seatsData,
            })
            .then(() => {
              firestore()
              .collection('bookings')
              .add(formData)
              .then(() => {
                  fetchTrips(true).then((fetchData) => {
                    setCurrentTrip(fetchData);
                  });
                  setSelectedSeats([]);
                  toast.show({description: "Booked Successfully!"});
                  setLoading(false);
                  
              });
              
            });
          }else{
            toast.show({description: "Please fill all the required filled!"});
          }


        }
      })
      
  }
  
  
  return (
    <SafeAreaView>
        <ScrollView style={styles.container} h={'100%'}>
          <HStack flexWrap={'wrap'} justifyContent={'center'} py={3} mb={2}>
            <Badge bg={seatColor.available}>Available</Badge>
            <Badge bg={seatColor.selected}>Selected</Badge>
            <Badge bg={seatColor.booked}>Booked</Badge>
            <Badge bg={seatColor.disabled}>Disable</Badge>
          </HStack>
          <View alignItems={'center'} pb={50}>
            {
                seats.map((seat,index) => {
                  let [seat1, seat2, seat3 , seat4] = [false];
                  seat1 = selectedSeats.find(s => seat[0] && seat[0].date_time == s.date_time);
                  seat2 = selectedSeats.find(s => seat[1] && seat[1].date_time == s.date_time);
                  seat3 = selectedSeats.find(s => seat[2] && seat[2].date_time == s.date_time);
                  seat4 = selectedSeats.find(s => seat[3] && seat[3].date_time == s.date_time);

                  
                    return (
                        <Row key={index} justifyContent={'space-between'} w={'90%'}>
                            <Row>
                                { seat[0] && seat[0].visible && <Button onPress={() => handleSelectSeats(seat[0])} disabled={(seat[0].booked ) || seat[0].disabled} bg={seat[0].booked || seat[0].user != null ? seatColor.booked : (seat[0].disabled ? seatColor.booked : ( seat1 ? seatColor.selected : seatColor.available ))} minW={45} m={3}>{ seat[0].name }</Button> }
                                { seat[1] && seat[1].visible && <Button onPress={() => handleSelectSeats(seat[1])} disabled={(seat[1].booked ) || seat[1].disabled} bg={seat[1].booked || seat[1].user != null ? seatColor.booked : (seat[1].disabled ? seatColor.booked : ( seat2 ? seatColor.selected : seatColor.available ))} minW={45} m={3}>{ seat[1].name }</Button> }
                            </Row>
                            <Row>
                                { seat[2] && seat[2].visible && <Button onPress={() => handleSelectSeats(seat[2])} disabled={(seat[2].booked) || seat[2].disabled} bg={seat[2].booked || seat[2].user != null ? seatColor.booked : (seat[2].disabled ? seatColor.booked : ( seat3 ? seatColor.selected : seatColor.available ))} minW={45} m={3}>{ seat[2].name }</Button> }

                                { seat[3] && seat[3].visible && <Button onPress={() => handleSelectSeats(seat[3])} disabled={(seat[3].booked) || seat[3].disabled} bg={seat[3].booked || seat[3].user != null ? seatColor.booked : (seat[3].disabled ? seatColor.booked : ( seat4 ? seatColor.selected : seatColor.available ))} minW={45} m={3}>{ seat[3].name }</Button> }
                            </Row>
                        </Row>
                    );
                })
            }

          {
            seats.length < 1 && (
              <HStack mt={4} space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                <Heading color="primary.500" fontSize="md">
                  Searching seats...
                </Heading>
              </HStack>
            )
          }
        </View>
        </ScrollView>

        {
          (selectedSeats.length > 0) && (
            <BottomSheet
              ref={bottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <View style={sitBookingStyles.contentContainer}>
                <Button onPress={handleSubmit} isLoading={loading} spinnerPlacement="end" isLoadingText={'Processing...'}> Pay and book </Button>
              </View>
            </BottomSheet>
          )
        }
        


      </SafeAreaView>
  );
}

const sitBookingStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  }
});
