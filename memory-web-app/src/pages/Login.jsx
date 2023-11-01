import { Box, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import Footer from "../components/Footer";
import Testimonials from '../components/Testimonials'

const Login = ({ uiConfig }) => (
  <Box height="100vh" width="100vw" overflowY="auto">
    <style>{`body { background-image: url("https://images.unsplash.com/photo-1531845116688-48819b3b68d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"); background-size: cover; }`}</style>
    <Flex
      height="100%"
      width="full"
      alignItems="center"
      px={["6", "16"]}
      py="16"
      justifyContent="center"
      flexDirection={["column", null, null, "row"]}
    >
      <Flex
        w={["full", null, null, "40%"]}
        mb={["6", null, null, "0"]}
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src="https://images.unsplash.com/photo-1531845116688-48819b3b68d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
          alt="memory-image"
          w="50%"
        />
      </Flex>
      <Spacer />

      <Flex
        w={["full", null, null, "60%"]}
        flexDirection="column"
        ml={["0", null, null, "7"]}
      >
        <Text color="#845cd4" fontSize={"7xl"} fontWeight="bold">
          memory
        </Text>

        <Text color="white" mb="6" opacity="0.8" fontSize="2xl">
          A timeline and diary platform that allows you to organize and
          <br />
          record significant events in your lives
        </Text>
      </Flex>
    </Flex>

    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
    >
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </Box>

    <Testimonials />

    <Footer/>
  </Box>
);

export default Login;
