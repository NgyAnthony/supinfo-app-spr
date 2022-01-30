import '../styles/globals.css'
import {UserProvider} from "@auth0/nextjs-auth0";
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  return (
      <UserProvider>
          <ChakraProvider>
              <Head>
                  <title>Points XLIF - SUPINFO</title>
                  <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              </Head>
              <Component {...pageProps} />
          </ChakraProvider>
      </UserProvider>
  )
}

export default MyApp
