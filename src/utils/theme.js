import { extendTheme } from 'native-base'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

const colors = {
  theme: {
    50: '#FFFFFF',
    100: '#000000',
    200: '#FEDEBE',
    300: '#FFAF42',
    400: '#FF8303',
    500: '#FE6E00',
    600: '#FD5602'
  }
}

export default extendTheme({ config, colors })
