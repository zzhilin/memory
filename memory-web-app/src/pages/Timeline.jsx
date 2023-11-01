import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Image,
  HStack,
  VStack,
  Flex,
  Tag,
  Heading,
  Text,
  Button,
  Center,
  Checkbox,
  SimpleGrid,
} from "@chakra-ui/react";
import { deleteTimeline, fetchUserTimelines } from "../database";
import Navbar from "../components/Navbar";

const Timeline = ({ onDeleteSelectedTimelines }) => {
  const [timelines, setTimelines] = useState([]);
  const [selectedTimelines, setSelectedTimelines] = useState([]);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  // const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchTimelines = async () => {
      const TimelinesData = await fetchUserTimelines(userId);
      setTimelines(TimelinesData);
    };

    fetchTimelines();
  }, []);

  const handleTimelineSelection = (timelineID, isChecked) => {
    if (isChecked) {
      setSelectedTimelines([...selectedTimelines, timelineID]);
      console.log("handletimeline selec", timelineID);
    } else {
      setSelectedTimelines(
        selectedTimelines.filter((item) => item !== timelineID)
      );
    }
  };

  const handleBulkDeleteTimelines = async () => {
    for (const timelineID of selectedTimelines) {
      const timeline = timelines.find((t) => t.timelineID === timelineID);
      if (timeline) {
        await deleteTimeline(timeline);
      }
    }

    onDeleteSelectedTimelines(selectedTimelines);
    setIsBulkDeleteMode(false);

    // Update the state of timelines after deletion
    const updatedTimelines = timelines.filter(
      (timeline) => !selectedTimelines.includes(timeline.timelineID)
    );
    setTimelines(updatedTimelines);
  };

  const toggleBulkDeleteMode = () => {
    setIsBulkDeleteMode(!isBulkDeleteMode);
    setSelectedTimelines([]); // Clear selected timelines when toggling bulk delete mode
  };

  return (
    <Box>
      <Navbar />
      <VStack as="section" spacing="6" minH="100vh" w="100%" px="4" py="8">
        <HStack spacing="4">
          <Link to={`/user/${userId}/new-timeline`}>
            <Button colorScheme="purple" variant="solid">
              Add timeline
            </Button>
          </Link>
          <Button
            colorScheme={isBulkDeleteMode ? "red" : "gray"}
            onClick={toggleBulkDeleteMode}
          >
            {isBulkDeleteMode ? "Cancel bulk delete" : "Bulk delete timelines"}
          </Button>
          {isBulkDeleteMode && (
            <Button colorScheme="red" onClick={handleBulkDeleteTimelines}>
              Delete selected timelines
            </Button>
          )}
        </HStack>
        <Flex
          as="section"
          minH="100vh"
          // bg="gray.100"
          alignItems="center"
          justifyContent="center"
          w="100%"
          pt="6"
          pb="6"
        >
          <SimpleGrid columns={[2, null, 3]} spacing="40px">
            {timelines.map((timeline) => (
              <Box
                key={timeline.timelineID}
                maxW="420px"
                bg="white"
                p="6"
                minH="400px"
              >
                {isBulkDeleteMode && (
                  <Checkbox
                    mb="4"
                    onChange={(e) =>
                      handleTimelineSelection(
                        timeline.timelineID,
                        e.target.checked
                      )
                    }
                  >
                    Select
                  </Checkbox>
                )}

                <Image
                  src={timeline.image || "https://via.placeholder.com/150"}
                  alt="Timeline Image"
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
                  <HStack spacing="4">
                    <Link
                      to={`/user/${userId}/timeline/${timeline.timelineID}/edit`}
                    >
                      <Button colorScheme="purple" variant="outline">
                        Edit Timeline
                      </Button>
                    </Link>
                    <Link
                      to={`/user/${userId}/timeline/${timeline.timelineID}/diaries`}
                    >
                      <Button colorScheme="purple" variant="solid">
                        Open Timeline
                      </Button>
                    </Link>
                  </HStack>
                </Center>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Timeline;
