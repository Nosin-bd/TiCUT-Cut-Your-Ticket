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
    600: '#FD5602',
    button: '#a396e3',
    second: '#96b0e3',
    third: '#d2ddf3',
    fourth: '#e396b0',
    fifth: '#5ad3aa',
    sixth: '#e3c996',
    color: '#FFFFFF'
  }
}

export default extendTheme({ config, colors })
