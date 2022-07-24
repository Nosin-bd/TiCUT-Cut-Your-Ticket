import React from 'react';
import Providers from './src/navigation';
import { NativeBaseProvider} from 'native-base';
import theme from './src/utils/theme';

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <Providers />
    </NativeBaseProvider>
  );
}
