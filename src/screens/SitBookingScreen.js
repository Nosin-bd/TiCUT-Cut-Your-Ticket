import React, { useEffect, useState, useCallback, useMemo, useRef, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Heading,View, Row, HStack, Spinner, ScrollView, Text, Badge, Stack } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../utils/styles';
import { AuthContext } from '../navigation/AuthProvider';
import { useToast } from 'native-base';
import { WebView } from 'react-native-webview';
import { BookingContext } from '../providers/BookingProvider';


export default function SitBookingScreen({route,navigation}) {
  const toast = useToast();
  const { user, setUser } = useContext(AuthContext);
  const seatColor = {
    available: 'theme.second',
    booked: 'theme.400',
    selected: 'theme.fifth',
    disabled: 'theme.fourth'
  }

  const { seats,locationRoute,selectedSeats,loadings, setCurrentTrip,setSeats,setLocationRoute,setSelectedSeats,setLoadings } = useContext(BookingContext);

  const { tripId, routeId } = route.params;
  const [ssl, setSsl] = useState(false);
  const [openSsl, setOpenSsl] = useState(false);


  useEffect(() => {
    fetchTrips();
    return () => {
      setSelectedSeats([]);
      setCurrentTrip(null);
      setSeats([]);
      setLocationRoute(null);
      setLoadings(false);
    }
  },[]);

  const fetchTrips = useCallback(async () => {
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
  }, [])


  const handleSelectSeats = async (sit) => {
    let isSelected = await selectedSeats.some((s) => {
      return sit.date_time == s.date_time;
    })
    if(isSelected){
      await setSelectedSeats(current => 
        current.filter(val => {
           return val.date_time != sit.date_time;
        })
      );
    }else{
      await setSelectedSeats((current) => [...current,sit]);
    }
  }

  const handleSubmit = async ()=> { 
      setLoadings(true);

      var seatsString = selectedSeats.map(function(s){
        return s.date_time;
      }).join("_");

      let response = await fetch(
        'https://ticut-stripe.herokuapp.com/ssl-request?'+ new URLSearchParams({
          trip_id: tripId,
          seats: seatsString,
          user_id: user.uid,
          route_id: routeId,
          amount: locationRoute.fares * selectedSeats.length
      }));
      let json = await response.json();
      toast.show({description: "Please pay the bill!"});
      setLoadings(false);
      setSsl(json);
      setOpenSsl(true);
  }

  const handleClosePayment = () => {
    setOpenSsl(false);
    setSsl('');
    setCurrentTrip([]);
    setSeats([]);
    setSelectedSeats([]);
    fetchTrips();
  }

  return (
    <SafeAreaView>
        <ScrollView style={styles.container} h={'100%'}>
          {
            !openSsl && (
              <HStack flexWrap={'wrap'} justifyContent={'center'} py={3} mb={2}>
                <Badge bg={seatColor.available}>Available</Badge>
                <Badge bg={seatColor.selected}>Selected</Badge>
                <Badge bg={seatColor.booked}>Booked</Badge>
                <Badge bg={seatColor.disabled}>Disable</Badge>
              </HStack>
            )
          }
          
            {
                openSsl && ssl.length > 1 && (
                  <View mb={10} alignItems={'flex-end'}>
                    <Button width={110} mb={2} bg={'theme.500'} onPress={handleClosePayment}>Close</Button>
                    <Text mb={1}>{`Seats count: ${selectedSeats.length} Fares: ${locationRoute.fares * selectedSeats.length}`}</Text>
                    <HStack h={550}>
                      <WebView nestedScrollEnabled={true} source={{ uri: ssl }} />
                    </HStack>
                  </View>
              )
            }
            
            

          <View alignItems={'center'}>
            {
              (!openSsl && selectedSeats.length > 0) && ( 
                <Stack alignItems={'flex-end'}>
                  <Button w={150} mb={3} bg={'theme.button'} onPress={handleSubmit} isLoading={loadings} spinnerPlacement="end" isLoadingText={'Processing...'}> Pay and book </Button>
                </Stack>
              )
            }
          </View>
            
          {
            !openSsl && (
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
            )
          }
        </ScrollView>
      </SafeAreaView>
  );
}
