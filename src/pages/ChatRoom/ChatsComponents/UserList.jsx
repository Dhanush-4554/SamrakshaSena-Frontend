import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../../context/ChatProvider";

const UserListItem = ({handleFunction,Name,Email}) => {
  const { CurrentUser } = ChatState();
  //console.log(Name,Email);
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={Name}
      />
      <Box>
        <Text>{Name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {Email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;