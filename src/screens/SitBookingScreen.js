import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Heading,View } from 'native-base';

export default function SitBookingScreen({navigation}) {

  let seat = [
    {
      _id: 1,
      seat_no: 'A1',
      user: 'shakil',
      gender: 'male',
      booked: 0  
    },
    {
      _id: 2,
      seat_no: 'A2',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 3,
      seat_no: 'A3',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 4,
      seat_no: 'A4',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 5,
      seat_no: 'B1',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 6,
      seat_no: 'B2',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 7,
      seat_no: 'B3',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 8,
      seat_no: 'B4',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 9,
      seat_no: 'C1',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 10,
      seat_no: 'C2',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 11,
      seat_no: 'C3',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 12,
      seat_no: 'C4',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 13,
      seat_no: 'D1',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 14,
      seat_no: 'D2',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 15,
      seat_no: 'D3',
      user: null,
      gender: 'male',
      booked: 0  
    },
    {
      _id: 16,
      seat_no: 'D4',
      user: null,
      gender: 'male',
      booked: 0  
    }
  ];

  const [sit, setSit] = useState(seat);

  useEffect(() => {
    console.log(seat);
    seat.map((i, s) => {
    })
  },[sit]);
  
  return (
    <View style={styles.container}>
      
      <View style={{ width: '100%'}}>
        <View style={styles.seatRow}>
          <View style={styles.seatLeft}>
            <Button m={2}>A1</Button>
            <Button m={2}>A2</Button>
          </View>
          <View style={styles.seatRight}>
            <Button m={2}>A1</Button>
            <Button m={2}>A2</Button>
          </View>
        </View>
      </View>
      
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
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  seatLeft: {
    flexDirection: 'row',
    paddingRight: 40
  },
  seatRight: {
    flexDirection: 'row'
  }
});
