import { Image, Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';

export default function WithLargeQuote() {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Box>
        <Stack
          px={8}
          spacing={{ base: 8, md: 10 }}
          align={'center'}
          direction={'column'}>
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            textAlign={'center'}
            maxW={'3xl'}>
            Woof woof! I just had the most paw-some experience with this timeline and diary platform! As a loyal companion, I've been a part of my family's life for many years and have witnessed so many special moments. But now, with <Text as="span" color="purple.500">memory</Text>, my family can organize and record those moments in a way that truly does them justice. It's been so easy to use, and it's made us all feel more connected and grateful for the memories we've shared. I give this platform two paws up!
          </Text>
          <Box textAlign={'center'}>
            <Image
              src='https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTczOTQ1NTY2MTM5OTE3NjE5/dog-breeds-the-akita.jpg'
              alt={'An Avid Akita'}
              w="15%"
              borderRadius="full"
              style={{ display: "block", margin: "auto" }}
            />
            <Text mt={4} fontSize={'2xl'} fontWeight={600}>Kohaku</Text>
            <Text mt={1}
              fontSize={'1xl'}
              color={useColorModeValue('gray.400', 'gray.400')}>
              An Avid Akita
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

