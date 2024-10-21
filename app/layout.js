import './globals.css' 
import { ChakraProvider } from '@chakra-ui/react'
import Footer from './components/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <main>
            {children}
          </main>
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  )
}
