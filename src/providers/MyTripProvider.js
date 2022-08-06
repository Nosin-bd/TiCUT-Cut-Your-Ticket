import React, { createContext, useState } from 'react';

/**
 * This provider is created
 * to access user in whole app
 */

export const MyTripContext = createContext({});

export const MyTripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);

  return (
    <MyTripContext.Provider
      value={{
        trips,
        setTrips
      }}
    >
      {children}
    </MyTripContext.Provider>
  );
};
