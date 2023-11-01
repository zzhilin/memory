import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { searchDiaries, searchTimelines } from "../database";
import {
  Box,
  Button,
  Center,
  SimpleGrid,
  HStack,
  Text,
  Heading,
  Image,
  Tag,
  VStack,
} from "@chakra-ui/react";

const SearchResults = ({ user }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
  const { userId } = useParams();

  const [diaries, setDiaries] = useState([]);
  const [timelines, setTimelines] = useState([]);

  useEffect(() => {
    if (query && user) {
      (async () => {
        const diaryResults = await searchDiaries(query, user.uid);
        setDiaries(diaryResults);

        const timelineResults = await searchTimelines(query, user.uid);
        setTimelines(timelineResults);

        console.log("diary search results:", diaries);
      })();
    }
  }, [query, user.uid]);

  useEffect(() => {
    console.log("diary search results in useEffect:", diaries);
    console.log("Current user:", user.uid);
  }, [diaries]);

  return (
    <Box>
      <Heading as="h2" size="xl" textAlign="center" mt="8">
        Search Results for "{query}"
      </Heading>
      <VStack spacing={8} my={8}>
        <Box>
          <Heading as="h3" size="lg">
            Timelines
          </Heading>
          <SimpleGrid columns={[2, null, 3]} spacing="40px">
            {/* Render your timeline cards here */}
            {timelines.map((timeline) => {
              console.log("Timeline Image URL:", timeline.image); // Added console.log
              return (
                <Box
                  key={timeline.timelineID}
                  maxW="420px"
                  bg="white"
                  p="6"
                  minH="400px"
                >
                  <Image
                    src={timeline.image || "https://via.placeholder.com/150"}
                    alt={timeline.title}
                    borderRadius="md"
                    objectFit="cover"
                    mx="auto"
                  />
                  <HStack mt="5" spacing="3">
                    <Tag key={timeline.visibility}>{timeline.visibility}</Tag>
                  </HStack>
                  <Heading my="4" size="lg">
                    {timeline.title}
                  </Heading>
                  <Text>{timeline.description}</Text>
                  <Center my="6">
                    <Link to={`/user/${user.uid}/timeline/${timeline.timelineID}/diaries`}>
                      <Button colorScheme="purple" variant="solid">
                        Open Timeline
                      </Button>
                    </Link>
                  </Center>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
        <Box>
          <Heading as="h3" size="lg">
            Diaries
          </Heading>
          <SimpleGrid columns={[2, null, 3]} spacing="40px">
            {/* Render your diary cards here */}
            {diaries.map((d, index) => (
              <Box key={d.title} maxW="420px" bg="white" p="6" minH="400px">
                <Image
                  src={d.image || "https://via.placeholder.com/150"}
                  alt={d.title}
                  borderRadius="md"
                  objectFit="cover"
                  mx="auto"
                />
                <HStack mt="5" spacing="3">
                  <Tag key={d.visibility}>{d.visibility}</Tag>
                </HStack>
                <Heading my="4" size="lg">
                  {d.title}
                </Heading>
                <Text>{d.content}</Text>
                <Center my="6">
                  <Link to={`/user/${user.uid}/timeline/${d.timelineId}/diaries/${d.diaryID}`}>
                    <Button colorScheme="purple" variant="solid">
                      Open Diary
                    </Button>
                  </Link>
                </Center>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default SearchResults;
