import React, { useEffect, useState } from 'react';
import { ScrollView, Stack, Heading,Box, Text, View, HStack, Button, Row, Modal, FormControl, Input, Switch } from 'native-base';
import styles from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'native-base';
import firestore from '@react-native-firebase/firestore';

export const DefaultSeatScreen = () => {
    // const allSeats = [
    //     {name: 'A1', disabled: false, visible: true },
    //     {name: 'A2', disabled: false, visible: true },
    //     {name: 'A3', disabled: false, visible: true },
    //     {name: 'A4', disabled: false, visible: true },
    //     {name: 'B1', disabled: false, visible: true },
    //     {name: 'B2', disabled: false, visible: true },
    //     {name: 'B3', disabled: false, visible: true },
    //     {name: 'B4', disabled: false, visible: true },
    //     {name: 'C1', disabled: false, visible: true },
    //     {name: 'C2', disabled: false, visible: true },
    //     {name: 'C3', disabled: false, visible: true },
    //     {name: 'C4', disabled: false, visible: true },
    //     {name: 'D1', disabled: false, visible: true },
    //     {name: 'D2', disabled: false, visible: true },
    //     {name: 'D3', disabled: false, visible: true },
    //     {name: 'D4', disabled: false, visible: true },
    //     {name: 'E1', disabled: false, visible: true },
    //     {name: 'E2', disabled: false, visible: true },
    //     {name: 'E3', disabled: false, visible: true },
    //     {name: 'E4', disabled: false, visible: true },
    //     {name: 'F1', disabled: false, visible: true },
    //     {name: 'F2', disabled: false, visible: true },
    //     {name: 'F3', disabled: false, visible: true },
    //     {name: 'F4', disabled: false, visible: true },
    //     {name: 'G1', disabled: false, visible: true },
    //     {name: 'G2', disabled: false, visible: true },
    //     {name: 'G3', disabled: false, visible: true },
    //     {name: 'G4', disabled: false, visible: true },
    //     {name: 'H1', disabled: false, visible: true },
    //     {name: 'H2', disabled: false, visible: true },
    //     {name: 'H3', disabled: false, visible: true },
    //     {name: 'H4', disabled: false, visible: true },
    //     {name: 'I1', disabled: false, visible: true },
    //     {name: 'I2', disabled: false, visible: true },
    //     {name: 'I3', disabled: false, visible: true },
    //     {name: 'I4', disabled: false, visible: true }
    // ];

    const [seats, setSeats] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const toast = useToast();
    const [ newSeat, setNewSeat ] = useState({
        name: '',
        disabled: false,
        visible: true
    });
    const [ loading, setLoading ] = useState(false);
    const [ validation, setValidation ] = useState(false);

    const updateInput = (name, value) => {
        setNewSeat({
          ...newSeat,
          [name]: value,
        })
    }

    const handleSubmit = ()=> {
        setValidation(true);
        if( newSeat.name.length ){
            setLoading(true);
            firestore()
            .collection('default_seats')
            .add({
                name: newSeat.name,
                disabled: newSeat.disabled,
                visible: newSeat.visible,
                date_time: new Date().getTime()
            })
            .then(() => {
                fetchSeats();
                setLoading(false);
                setShowModal(false);
                toast.show({description: "Seat added successfully!"});
            });
        }
    }

    async function fetchSeats() {
        let data = []
        const querySnapshot = await firestore().collection("default_seats").orderBy('date_time', 'asc').get();
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        let map_seat = [];
        let temp = [];
        data.forEach((s, i) => {
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
        console.log('map seat', map_seat);
        setSeats(map_seat);
    }

    useEffect( () => {
        fetchSeats();
    },[])

  return (
    <SafeAreaView>
        <ScrollView style={styles.container} bg={'red'} w={'100%'}>
            <View mb={6} alignItems={'center'}>
                <Button onPress={() => setShowModal(true)} bg={'red.800'} w={160}> Add Seat </Button>
            </View>
            <View alignItems={'center'}>
                {

                    seats.map((seat,index) => {
                        return (
                            <Row key={index} justifyContent={'space-between'} w={'90%'}>
                                <Row>
                                    { seat[0] && seat[0].visible && <Button minW={45} m={3}>{ seat[0].name }</Button> }
                                    { seat[1] && seat[1].visible && <Button minW={45} m={3}>{ seat[1].name }</Button> }
                                </Row>
                                <Row>
                                    { seat[2] && seat[2].visible && <Button minW={45} m={3}>{ seat[2].name }</Button> }
                                    { seat[3] && seat[3].visible && <Button minW={45} m={3}>{ seat[3].name }</Button> }
                                </Row>
                            </Row>
                        );
                    })
                }
            </View>

            

            {/* Add Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Contact Us</Modal.Header>
                <Modal.Body>
                    <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input type="text" placeholder="Seat Name" onChangeText={(value) => updateInput('name', value)} value={newSeat.name || ''} />
                    </FormControl>
                    <FormControl mt="3">
                    <HStack alignItems="center" space={4}>
                        <FormControl.Label>Is Disable?</FormControl.Label>
                        <Switch onToggle={(value) => updateInput('disabled', value)} size="sm" isChecked={newSeat.disabled || false} />
                    </HStack>
                    <HStack alignItems="center" space={4}>
                        <FormControl.Label>Is Visible?</FormControl.Label>
                        <Switch onToggle={(value) => updateInput('visible', value)} size="sm" isChecked={newSeat.visible || true} />
                    </HStack>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                    setShowModal(false);
                    }}>
                        Cancel
                    </Button>
                    <Button onPress={handleSubmit} isLoading={loading} spinnerPlacement="end" isLoadingText="Adding">
                        Save
                    </Button>
                    </Button.Group>
                </Modal.Footer>
                </Modal.Content>
            </Modal>


      </ScrollView>
    </SafeAreaView>
  )
}
