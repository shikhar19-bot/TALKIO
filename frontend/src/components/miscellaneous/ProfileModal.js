import {useDisclosure} from '@chakra-ui/hooks';

import { IconButton,Modal,ModalOverlay,ModalContent,ModalHeader
  ,ModalCloseButton,ModalBody,ModalFooter,Button,Image ,Text} from '@chakra-ui/react'

import {ViewIcon} from'@chakra-ui/icons';

const ProfileModal = ({user,children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
     return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

            <Modal  size="lg" isOpen={isOpen} onClose={onClose}  isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
          fontSize="40px"
          fontfamily="Work sans"
          d="flex"
          justifyContent="center"
          > 
        {user.name}
        </ModalHeader>
          <ModalCloseButton />
          <ModalBody  
          d="flex"
          flexDir="column"
          alignItems={'center'}
          justifyContent="space-between"
          >
             <Image 
             borderRadius="full"
             boxSize="150px"
             src={user.pic}
             alt={user.name}
             
             />
             <Text 
             fontSize={{base:"28px" ,md:"30px"}}
             fontfamily="Work sans"
             >
              Email:{user.email}

             </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
         
          </ModalFooter>
        </ModalContent>
      </Modal>

      </>
      )
};

export default ProfileModal;