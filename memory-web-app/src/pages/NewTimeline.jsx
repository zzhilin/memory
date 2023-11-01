import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import { createTimeline } from "../database.js";

const NewTimeline = ({ userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id: timelineId, imageUrl } = await createTimeline(
        { title, description, visibility },
        imageFile
      );
      // Add the following line to update the image URL in the state
      setImageFile(imageUrl);
      navigate(`/user/${userId}/timeline`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container pt="6">
      <Center>
        <Heading size="lg">Create New Timeline</Heading>
      </Center>

      <Spacer />
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="image">Image</FormLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            Save Timeline
          </Button>
        </VStack>
      </form>
    </Container>
  );
};
export default NewTimeline;
