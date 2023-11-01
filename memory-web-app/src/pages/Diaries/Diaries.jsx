import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  SimpleGrid,
  Flex,
  HStack,
  Text,
  Checkbox,
  Heading,
  Image,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { deleteDiary, getDiariesByTimelineID } from "../../database";
import { saveAs } from "file-saver";
// import EditSingleDiary from "./EditDiary";

const Diaries = ({ onDeleteSelectedDiaries }) => {
  const [diaries, setDiaries] = useState([]);
  const [selectedDiaries, setSelectedDiaries] = useState([]);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const { userId, timelineId } = useParams();

  console.log("timelineId", timelineId);

  useEffect(() => {
    const fetchDiaries = async () => {
      const diariesData = await getDiariesByTimelineID(timelineId);
      setDiaries(diariesData);
    };

    fetchDiaries();
  }, []);

  const handleDiariesSelection = (id, isChecked) => {
    if (isChecked) {
      setSelectedDiaries([...selectedDiaries, id]);
    } else {
      setSelectedDiaries(selectedDiaries.filter((item) => item !== id));
    }
    console.log("Selected Diaries:", selectedDiaries);
  };

  const handleBulkDeletediaries = async () => {
    console.log(
      "Selected Diaries (in handleBulkDeletediaries):",
      selectedDiaries
    );
    console.log("All Diaries (in handleBulkDeletediaries):", diaries);
    const deletedDiaryIds = [];

    for (const diaryID of selectedDiaries) {
      const diary = diaries.find((t) => t.diaryID === diaryID);
      if (diary) {
        await deleteDiary(diary.diaryID);
        deletedDiaryIds.push(diary.diaryID);
      }
    }

    // Update the diaries state to remove the deleted diaries
    setDiaries(
      diaries.filter((diary) => !deletedDiaryIds.includes(diary.diaryID))
    );

    onDeleteSelectedDiaries(selectedDiaries);
    setIsBulkDeleteMode(false);
  };

  const toggleBulkDeleteMode = () => {
    setIsBulkDeleteMode(!isBulkDeleteMode);
    setSelectedDiaries([]); // Clear selected diaries when toggling bulk delete mode
  };

  // console.log("New print:", timelineId)
  const exportDiaries = async (timelineId) => {
    const diariesData = await getDiariesByTimelineID(timelineId);

    if (!diariesData) {
      console.error("No diaries found");
      return;
    }

    const fileContent = diariesData
      .map(
        (d) =>
          `${d.title}\n${new Date(d.date).toLocaleString()}\n${d.content}\n\n`
      )
      .join("");

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "diaries.txt");
  };

  return (
    <Box>
      <Navbar />
      <VStack mt="8">
        <HStack spacing="4">
          <Link to={`/user/${userId}/timeline/${timelineId}/diaries/new`}>
            <Button colorScheme="purple" variant="solid">
              Add new diary
            </Button>
          </Link>
          <Button
            colorScheme={isBulkDeleteMode ? "red" : "gray"}
            onClick={toggleBulkDeleteMode}
          >
            {isBulkDeleteMode ? "Cancel" : "Bulk delete diaries"}
          </Button>
          {isBulkDeleteMode && (
            <Button colorScheme="red" onClick={handleBulkDeletediaries}>
              Delete selected diaries
            </Button>
          )}
          <Button
            colorScheme="purple"
            variant="solid"
            onClick={() => exportDiaries(timelineId)}
          >
            Export
          </Button>
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
            {diaries.map((d, index) => (
              <Box key={d.title} maxW="420px" bg="white" p="6" minH="400px">
                {isBulkDeleteMode && (
                  <Checkbox
                    mb="4"
                    onChange={(e) =>
                      handleDiariesSelection(d.diaryID, e.target.checked)
                    }
                  >
                    Select
                  </Checkbox>
                )}
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
                  <HStack spacing="4">
                    <Link
                      to={`/user/${userId}/timeline/${timelineId}/diaries/${d.diaryID}/edit`}
                    >
                      <Button colorScheme="purple" variant="outline">
                        Edit Diary
                      </Button>
                    </Link>
                    <Link
                      to={`/user/${userId}/timeline/${timelineId}/diaries/${d.diaryID}`}
                    >
                      <Button colorScheme="purple" variant="solid">
                        Open Diary
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

export default Diaries;
