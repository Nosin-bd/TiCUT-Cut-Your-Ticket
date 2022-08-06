import React, { useEffect, useState } from 'react';
import { FormControl, Input, Stack, WarningOutlineIcon, Box, ScrollView, Button, View, HStack, Heading, Text, Spinner } from 'native-base';
import styles from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'native-base';
import firestore from '@react-native-firebase/firestore';

export const RecordScreen = () => {
    const toast = useToast();
    const [ record, setRecord ] = useState({
        deptId: '',
        email: ''
    });
    const [ loading, setLoading ] = useState(false);
    const [ delLoading, setDelLoading ] = useState(false);
    const [ validation, setValidation ] = useState(false);
    const [ records, setRecords ] = useState([]);

    useEffect(() => {
        fetchRecords();
        return () => {
            setRecords([]);
            setLoading(false);
        }
      }, []);
    
    async function fetchRecords() {
        setLoading(true);
        const data = []
        const querySnapshot = await firestore().collection("records").orderBy('date_time','desc').get();
        const snapshot = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        snapshot.forEach((doc) => {
            data.push(doc);
        });
        setRecords(data);
        setLoading(false);
    }

    const updateInput = (name, value) => {
        setRecord({
          ...record,
          [name]: value,
        })
    }

    const deleteData = async(id) => {
        console.log(id);
        setDelLoading(true);
        await firestore().collection('records').doc(id).delete().then(() => {
            setRecords([]);
            fetchRecords();
            setDelLoading(false);
            toast.show({description: "Record deleted successfully!"});
        });
    }

    const handleSubmit = ()=> {
        setValidation(true);
        if( record.deptId.length && record.email.length ){
            setLoading(true);
            firestore()
            .collection('records')
            .add({
                deptId: record.deptId,
                email: record.email,
                date_time: new Date().getTime()
            })
            .then(() => {
                setRecords([]);
                setRecord({
                    deptId: '',
                    email: ''
                });
                setValidation(false);
                fetchRecords();
                toast.show({description: "Record added successfully!"});
            });
        }
    }


    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <Box w="100%">
                    <FormControl isRequired>
                        <Stack mx="4" mb={3}>
                            <FormControl.Label>Department Id</FormControl.Label>
                            <Input type="text" placeholder="Department Id" onChangeText={(value) => updateInput('deptId', value)} value={record.deptId || ''} />
                            <FormControl.ErrorMessage isInvalid={ validation && !record.deptId.length } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                        </Stack>
                        <Stack mx="4" mb={3}>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input type="text" placeholder="Email" onChangeText={(value) => updateInput('email', value)} value={record.email || ''} />
                            <FormControl.ErrorMessage isInvalid={ validation && !record.email.length } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                        </Stack>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} pr={4} mt={6}>
                            <Button bg={'theme.500'} onPress={handleSubmit} w={120} flex={1} isLoading={loading} spinnerPlacement="end" isLoadingText="Adding">Add Record</Button>
                        </View>
                    </FormControl>
                </Box>
                <View my={5}>
                {
                    records.map((r,index) => {
                        return (
                            <Box my={3} key={index} alignItems="center">
                                <Box w={'100%'} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                                    borderColor: "coolGray.600",
                                    backgroundColor: "gray.700"
                                    }} _web={{
                                    shadow: 2,
                                    borderWidth: 0
                                    }} _light={{
                                    backgroundColor: "gray.50"
                                    }}>
                                    <Stack p="4" space={3}>
                                    <Stack space={2}>
                                        <Heading size="md" ml="-1">{`Email: ${r.email}`}</Heading>
                                        <Text fontSize="xs" _light={{
                                            color: "violet.500"
                                        }} _dark={{
                                            color: "violet.400"
                                        }} fontWeight="500" ml="-0.5" mt="-1">
                                        Department Id: {r.deptId}
                                        </Text>
                                    </Stack>
                                    </Stack>
                                    <HStack alignItems="flex-end" p={3} justifyContent="flex-end">
                                        <Button isLoading={delLoading} isLoadingText={'Deleting'} onPress={() => deleteData(r.id)} ml={3}>Delete</Button>
                                    </HStack>
                                </Box>
                            </Box>
                        );
                    })
                }
                </View>


            {
              records.length < 1 && (
                <HStack mt={4} space={2} justifyContent="center">
                  <Spinner accessibilityLabel="Loading posts" />
                  <Heading color="primary.500" fontSize="md">
                    Fetching records...
                  </Heading>
                </HStack>
              )
            }


            </ScrollView>
        </SafeAreaView>
    )
}
