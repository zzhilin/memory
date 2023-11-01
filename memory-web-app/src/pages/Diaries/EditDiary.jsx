import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import { updateDiary, getDiaryById } from "../../database";
import { useParams, useNavigate } from "react-router-dom";

const EditSingleDiary = () => {
  const { timelineId, diaryId, userId } = useParams();
  const [diary, setDiary] = useState(null);
  const navigate = useNavigate();
  const imageInputRef = useRef();

  useEffect(() => {
    let isMounted = true;

    const fetchDiaryById = async () => {
      const diaryData = await getDiaryById(diaryId);

      if (isMounted) {
        if (diaryData) {
          setDiary({
            ...diaryData,
            image: diaryData.image || "", // Set the initial image property
          });
        } else {
          console.error("Error: diary data is null");
        }
      }
    };

    fetchDiaryById();
    console.log("fetchDiaryById", diary);

    return () => {
      isMounted = false;
    };
  }, [diaryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiary((prevState) => ({ ...prevState, [name]: value }));
  };

  if (!diary) {
    return (
      <Box>
        <Text>Loading timeline or timeline not found...</Text>
      </Box>
    );
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const imageFile = imageInputRef.current.files[0]; // Get the selected image file
    const success = await updateDiary(diaryId, diary, imageFile); // Pass the diaryId, diary, and image file to the updateDiary function
    if (success) {
      // Redirect to display single diary page
      navigate(`/user/${userId}/timeline/${timelineId}/diaries`);
    }
  };

  return (
    <Box>
      <Navbar />
      <VStack mt="8">
        <Box maxW="600px" w="100%" p={8} borderWidth={1} borderRadius={8}>
          <form onSubmit={handleFormSubmit}>
            <FormControl id="title" mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={diary.title}
                onChange={handleInputChange}
              />
            </FormControl>
            {/* Add this input field to handle image upload */}
            <FormControl id="image" mb={4}>
              <FormLabel>Image</FormLabel>
              <Input type="file" accept="image/*" ref={imageInputRef} />
            </FormControl>
            <FormControl id="content" mb={4}>
              <FormLabel>Content</FormLabel>
              <Textarea
                type="text"
                name="content"
                value={diary.content}
                onChange={handleInputChange}
              />
            </FormControl>
            <Button colorScheme="purple" type="submit">
              Save Changes
            </Button>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default EditSingleDiary;
