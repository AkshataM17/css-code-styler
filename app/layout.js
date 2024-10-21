import './globals.css' 
import { ChakraProvider } from '@chakra-ui/react'
import Footer from './components/Footer'  // Adjust the import path based on where your Footer component is located

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