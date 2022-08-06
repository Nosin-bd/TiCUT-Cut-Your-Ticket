import { Stack, View, Text, HStack,Spinner,Heading } from 'native-base';
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';

export const BookByScreen = ({route, navigation}) => {
    const { user_id } = route.params;
    let [userDetails, setUserDetails] = useState(null);

    const fetchUser = async () => {
        const querySnapshot = await firestore().collection("users").doc(user_id).get();
        let data = querySnapshot.data();
        data['id'] = querySnapshot.id;
        setUserDetails(data);
    }

    useEffect(() => {
        fetchUser();
        return () => {
            setUserDetails(null);
        }
    }, [])

  return (
    <View p={15}>
        {
            userDetails && (
                <View>
                    <Stack>
                        <Text>{`Name: ${userDetails.name}`}</Text>
                        <Text>{`Department Id: ${userDetails.deptId}`}</Text>
                        <Text>{`Phone: ${userDetails.phone}`}</Text>
                        <Text>{`Email: ${userDetails.email}`}</Text>
                    </Stack>
                </View>
            )
        }

        {
            !userDetails && (
            <HStack mt={4} space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                <Heading color="primary.500" fontSize="md">
                Searching user...
                </Heading>
            </HStack>
            )
        }
    </View>
  )
}
