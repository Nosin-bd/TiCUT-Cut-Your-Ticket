import React, { useEffect, useState } from 'react';
import { ScrollView, View, HStack, Button, Row, Modal, FormControl, Input, Switch, Heading, Spinner } from 'native-base';
import styles from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'native-base';
import firestore from '@react-native-firebase/firestore';

export const DefaultSeatScreen = () => {

    const [seats, setSeats] = useState([]);
    const [defaultSeats, setDefaultSeats] = useState([]);
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
        fetchSeats();
        setValidation(true);
        let check = defaultSeats.some((s) => {
            return s.name == newSeat.name;
        })
        if( newSeat.name.length && !check ){
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
                setNewSeat({
                    name: '',
                    disabled: false,
                    visible: true
                });
                toast.show({description: "Seat added successfully!"});
            });
        }else{
            toast.show({description: "You must need to add an unique seat Name!"});
        }
    }

    async function fetchSeats() {
        let data = []
        const querySnapshot = await firestore().collection("default_seats").orderBy('date_time', 'asc').get();
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setDefaultSeats(data);
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
        setSeats(map_seat);
    }

    useEffect( () => {
        fetchSeats();
        return () => {
            setDefaultSeats([]);
            setSeats([]);
        }
    },[])

  return (
    <SafeAreaView>
        <ScrollView style={styles.container} bg={'red'} w={'100%'}>
            <View mb={6} alignItems={'center'}>
                <Button onPress={() => setShowModal(true)} bg={'red.800'} w={160}> Add Seat </Button>
            </View>
            <View mb={6} alignItems={'center'}>
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
