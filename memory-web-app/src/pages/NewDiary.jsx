import React from "react";
import { Button, Heading, useColorMode, VStack } from "@chakra-ui/react";
import { RichTextBlock } from "../components/RichTextBlock";

const NewDiary = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <VStack spacing="16px" pt="8" pb="8">
      <Heading pb="8">Add New Diary</Heading>

      <Button onClick={toggleColorMode}>Current Mode: {colorMode}</Button>
      <RichTextBlock />
    </VStack>
  );
};

export default NewDiary;
