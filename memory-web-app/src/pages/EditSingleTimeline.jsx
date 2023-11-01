import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Text,
  Select,
} from "@chakra-ui/react";
import {
  updateTimeline,
  getTimelineById,
  uploadTimelineImage,
  deleteTimelineImage,
} from "../database";
import { useParams, useNavigate } from "react-router-dom";

const EditSingleTimeline = () => {
  const { userId, timelineId } = useParams();
  const [timeline, setTimeline] = useState({
    title: "",
    description: "",
    visibility: "",
    image: "",
  });
  const navigate = useNavigate();

  console.log("timelineId from useParams:", timelineId);

  useEffect(() => {
    let isMounted = true; // Add this line

    const fetchTimelineById = async () => {
      console.log("Calling getTimelineById");
      const timelineData = await getTimelineById(timelineId);

      if (isMounted) {
        // Add this line
        if (timelineData) {
          setTimeline({
            ...timelineData,
            image: timelineData.image || "", // Set the initial image property
          });
        } else {
          console.error("Error: Timeline data is null");
        }
      }
    };

    fetchTimelineById();
    console.log("fetchTimelineById", timeline);

    return () => {
      isMounted = false; // Add this line
    };
  }, [timelineId]);

  if (!timeline) {
    return (
      <Box>
        <Text>Loading timeline or timeline not found...</Text>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimeline((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await updateTimeline(timeline);
    if (success) {
      navigate(`/user/${userId}/timeline`);
    }
  };

  const handleImageUpload = async (id, e) => {
    const file = e.target.files[0];
    const imageUrl = await uploadTimelineImage(id, file);

    // Delete the old image if it exists and the new image URL is valid
    if (timeline.image && imageUrl && imageUrl !== timeline.image) {
      try {
        await deleteTimelineImage(timeline.image);
      } catch (error) {
        console.error("Error deleting timeline image:", error);
      }
    }

    if (imageUrl) {
      setTimeline((prevState) => ({ ...prevState, image: imageUrl }));
    } else {
      console.error("Error: Image URL is undefined");
    }
  };
  return (
    <Box>
      <VStack mt="8">
        <Box maxW="600px" w="100%" p={8} borderWidth={1} borderRadius={8}>
          {/* Add an image preview */}
          {timeline.image && (
            <Box mb={4}>
              <img
                src={timeline.image}
                alt="Uploaded timeline"
                style={{ maxWidth: "100%" }}
              />
            </Box>
          )}
          <form onSubmit={handleFormSubmit}>
            {timeline && (
              <FormControl id="title" mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={timeline.title}
                  onChange={handleInputChange}
                />
              </FormControl>
            )}
            <FormControl id="image" mb={4}>
              <FormLabel>Image</FormLabel>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(timeline.timelineId, e)}
              />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                type="text"
                name="description"
                value={timeline.description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="visibility" mb={4}>
              <FormLabel>Visibility</FormLabel>
              <Select
                name="visibility"
                value={timeline.visibility}
                onChange={handleInputChange}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="center">
              <Button colorScheme="purple" type="submit">
                Save Changes
              </Button>
            </Box>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default EditSingleTimeline;
