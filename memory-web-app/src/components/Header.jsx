import React from "react";
import { Box, Flex, Heading, Link, Button } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box as="header" boxShadow="sm" bg="gray.50">
      <Flex
        px="6"
        py="4"
        justifyContent="space-between"
        alignItems="center"
        maxW="1200px"
        mx="auto"
      >
          <Box p="2">
            <Heading size="md">Memory</Heading>
          </Box>
          <Link to="/register">
        <Button colorScheme="purple">
          Register
        </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default Header;