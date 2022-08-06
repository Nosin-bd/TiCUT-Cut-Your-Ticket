import React, { createContext, useState } from 'react';

/**
 * This provider is created
 * to access user in whole app
 */

export const BookingContext = createContext({});

export const BookingProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [seats, setSeats] = useState([]);
  const [locationRoute, setLocationRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loadings, setLoadings] = useState(false);

  return (
    <BookingContext.Provider
      value={{
        trips,
        setTrips,
        currentTrip,
        seats,
        locationRoute,
        selectedSeats,
        loadings,
        setCurrentTrip,
        setSeats,
        setLocationRoute,
        setSelectedSeats,
        setLoadings,
        // login: async (email, password) => {
        //   try {
        //     await auth().signInWithEmailAndPassword(email, password);
        //   } catch (e) {
        //     console.log(e);
        //   }
        // }
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
