import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  VStack,
  Container,
  Textarea,
  Select,
  Spacer,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { getDiaryById, updateDiary } from "../../database";

const DisplaySingleDiary = () => {
  const [diary, setDiary] = useState(null);
  const { diaryId } = useParams();
  // console.log(diaryId);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const { colorMode, toggleColorMode } = useColorMode();
  const [imageURL, setImageURL] = useState(""); // Add new state variable for image URL

  const navigate = useNavigate();

  const { userId, timelineId } = useParams();

  useEffect(() => {
    const fetchDiary = async () => {
      const diaryData = await getDiaryById(diaryId);
      setDiary(diaryData);
      setTitle(diaryData.title);
      setDate(diaryData.date);
      setContent(diaryData.content);
      setVisibility(diaryData.visibility);
      setImageURL(diaryData.image); // Set the image URL state
    };

    fetchDiary();
  }, [diaryId]);

  if (!diary) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedDiary = {
        title,
        date,
        content,
        visibility,
      };

      // Update the diary in the database using the Firestore-assigned ID
      await updateDiary(diaryId, updatedDiary);

      // Navigate back to the diaries page
      navigate(`/user/${userId}/timeline/${timelineId}/diaries`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container pt="6">
      <Spacer />
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Button onClick={toggleColorMode} mt="8">
            Current Mode: {colorMode}
          </Button>
          {/* Display the image */}
          {imageURL && <img src={imageURL} alt="Uploaded diary entry" />}
          <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="date">Date</FormLabel>
            <Input
              type="date"
              id="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="content">Content</FormLabel>
            <Textarea
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="visibility">Visibility</FormLabel>
            <Stack spacing={3}>
              <Select
                size="md"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option>public</option>
                <option>private</option>
              </Select>
            </Stack>
          </FormControl>
          <Button type="submit" colorScheme="purple" variant="solid">
            Save Diary Entry
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default DisplaySingleDiary;
