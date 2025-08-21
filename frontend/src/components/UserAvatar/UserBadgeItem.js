
import {CloseIcon} from '@chakra-ui/icons'
import { Box } from "@chakra-ui/layout";
import React from 'react'


const UserBadgeItem = ({user,handleFunction}) => {



  return (
    <Box
    px={2}
    py={1}
    borderRadius={'lg'}
    m={2}
    variant='solid'
    fontSize={12}

    backgroundColor='purple'
    color={'white'}
    cursor={'pointer'}
    onClick={handleFunction}
    >
        {user.name} 
        <CloseIcon p={1} />

    </Box>
  )
}

export default UserBadgeItem