import * as React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import {AppProps} from 'next/app';
import theme from "@/styles/theme";


function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
  );
}

export default MyApp;
