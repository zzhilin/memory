import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  VStack,
  Container,
  Heading,
  Textarea,
  Select,
  Center,
  Spacer,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { createDiary } from "../../database";

const CreateDiary = ({ onDiaryCreated }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const { colorMode, toggleColorMode } = useColorMode();
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const { userId, timelineId } = useParams();
  console.log(timelineId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDiary = await createDiary(
        {
          title,
          date,
          content,
          visibility,
          timelineId,
        },
        imageFile
      );
      onDiaryCreated(newDiary);
      navigate(`/user/${userId}/timeline/${timelineId}/diaries`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container pt="6">
      <Center>
        <Heading size="lg">Create New Diary Entry</Heading>
      </Center>

      <Spacer />
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Button onClick={toggleColorMode} mt="8">
            Current Mode: {colorMode}
          </Button>
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
            <FormLabel htmlFor="image">Image</FormLabel>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
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

export default CreateDiary;
