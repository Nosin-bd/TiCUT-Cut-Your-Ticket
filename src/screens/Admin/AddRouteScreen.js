import React, { useState } from 'react';
import { FormControl, Input, Stack, WarningOutlineIcon, Box, ScrollView, Button, View } from 'native-base';
import styles from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'native-base';
import firestore from '@react-native-firebase/firestore';

export const AddRouteScreen = () => {
    const toast = useToast();
    const [ route, setRoute ] = useState({
        from: '',
        to: '',
        fares: ''
    });
    const [ loading, setLoading ] = useState(false);
    const [ validation, setValidation ] = useState(false);

    const updateInput = (name, value) => {
        setRoute({
          ...route,
          [name]: value,
        })
    }

    const handleSubmit = ()=> {
        setValidation(true);
        if( route.from.length && route.to.length && route.fares.length ){
            setLoading(true);
            firestore()
            .collection('routes')
            .add({
                from: route.from,
                to: route.to,
                fares: route.fares
            })
            .then(() => {
                setLoading(false);
                toast.show({description: "Route added successfully!"});
            });
        }
    }


    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
            <Box w="100%">
                <FormControl isRequired>
                    <Stack mx="4" mb={3}>
                        <FormControl.Label>From</FormControl.Label>
                        <Input type="text" placeholder="Location" onChangeText={(value) => updateInput('from', value)} value={route.from || ''} />
                        <FormControl.ErrorMessage isInvalid={ !route.from.length && validation } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                    </Stack>
                    <Stack mx="4" mb={3}>
                        <FormControl.Label>Destination</FormControl.Label>
                        <Input type="text" placeholder="Destination" onChangeText={(value) => updateInput('to', value)} value={route.to || ''} />
                        <FormControl.ErrorMessage isInvalid={ !route.to.length && validation } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                    </Stack>
                    <Stack mx="4" mb={3}>
                        <FormControl.Label>Fares</FormControl.Label>
                        <Input type="number" placeholder="Fares in TK." onChangeText={(value) => updateInput('fares', value)} value={route.fares || ''} />
                        <FormControl.ErrorMessage isInvalid={ !route.fares.length && validation } leftIcon={<WarningOutlineIcon size="xs" />}>This field is required.</FormControl.ErrorMessage>
                    </Stack>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} pr={4} mt={6}>
                        <Button bg={'theme.500'} onPress={handleSubmit} w={120} flex={1} isLoading={loading} spinnerPlacement="end" isLoadingText="Adding">Add Route</Button>
                    </View>
                </FormControl>
            </Box>
            </ScrollView>
        </SafeAreaView>
    )
}
