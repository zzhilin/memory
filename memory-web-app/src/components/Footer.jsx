import React from "react";
import { Box, Flex, Text, } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" mt="auto" bg="gray.100">
      <Flex
        py="4"
        justifyContent="center"
        alignItems="center"
        maxW="1200px"
        mx="auto"
      >
        <Box>
        <Text textAlign="center" mt={2}>&copy; 2023 Memory.</Text>
        <Text textAlign="center" mt={2}>Created by Zhilin & Jingjing.</Text>
        <Text textAlign="center" mt={2}>All rights reserved.</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Footer;