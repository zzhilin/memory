import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Spacer,
  Flex,
  Container,
  HStack,
  Heading,
  InputLeftElement,
  InputGroup,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState, logout } from "../database";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const user = useAuthState();
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      window.location.href = `/search?query=${searchTerm}`;
    }
  };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   navigate.push(`/search?query=${searchTerm}`);
  // };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box as="section">
      <Box as="nav" bg="bg-surface" boxShadow="sm">
        <Container
          py={{
            base: "4",
            lg: "8",
          }}
          minW="80%"
        >
          <Box spacing="10" justify="space-between">
            <Flex alignItems="center" gap="2">
              <Link to={userId ? `/user/${userId}/timeline` : "/login"}>
                <Box p="2">
                  <Heading size="md">Memory</Heading>
                </Box>
              </Link>
              <Spacer />
              <HStack gap="8">
                <InputGroup minW="80%">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                </InputGroup>

                {!user ? (
                  <ButtonGroup gap="2">
                    <Button as={Link} to="/login" colorScheme="purple">
                      Log in
                    </Button>
                  </ButtonGroup>
                ) : (
                  <Button
                    onClick={handleLogout}
                    colorScheme="purple"
                    minW="20%"
                  >
                    Logout
                  </Button>
                )}
              </HStack>
            </Flex>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Navbar;
