import React, { useEffect, useState } from 'react';
import { ScrollView, Stack, Heading,Box, Text, View, HStack, Button } from 'native-base';
import styles from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

export const ViewRouteScreen = () => {

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchRoutes() {
      const data = []
      const querySnapshot = await firestore().collection("routes").get();
      querySnapshot.forEach((doc) => {
          data.push(doc.data());
      });
      if(isMounted){
        setRoutes(data);
      }
    }
    fetchRoutes();
    return () => {
      isMounted = false;
    }
  }, [routes]);

  return (
    <SafeAreaView>
        <ScrollView style={styles.container} bg={'red'} w={'100%'}>
        <View>
          {
            routes.map((r,index) => {
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
                    <Stack p="4" space={3}>
                      <Stack space={2}>
                        <Heading size="md" ml="-1">{r.from} - {r.to}</Heading>
                        <Text fontSize="xs" _light={{
                            color: "violet.500"
                          }} _dark={{
                            color: "violet.400"
                          }} fontWeight="500" ml="-0.5" mt="-1">
                          Fares: {r.fares} Tk.
                        </Text>
                      </Stack>
                    </Stack>
                    <HStack alignItems="flex-end" p={3} justifyContent="flex-end">
                        <Button ml={3}>Edit</Button>
                        <Button ml={3}>Delete</Button>
                    </HStack>
                </Box>
              </Box>
              );
            })
          }
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}
