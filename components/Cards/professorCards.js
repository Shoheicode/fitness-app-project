import { Box, Button, Rating, Stack } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import '@/app/CSS/MovingBackground.css'

const CardContainer = styled.div`
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
  }
`;

const CardContent = styled.div`
  padding: 20px;
  color: white;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardButton = styled.button`
  background-color: white;
  color: #ff6b6b;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CoolCard = ({name, review, subject}) => {

  const removeProfessor = async (professor) => {
    try {
      const name = professor['professor']
      const userDocRef = doc(collection(database, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
      const deletingDocument = doc(collection(userDocRef, 'Professor'), name)

      //const batch = writeBatch(database)

      await deleteDoc(deletingDocument);



      // const batch = writeBatch(database)
      
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
          console.log(userData.Professor)
          console.log("Name: " + name)
          if (userData.Professor.includes(name)){
            const index = userData.Professor.indexOf(name);
            console.log(index)
            userData.Professor.splice(index, 1);
            let profs = userData.Professor
            await setDoc(userDocRef, {Professor: profs})
          }
      }

    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }

  };

  return (
    <CardContainer>
      {/* <CardImage src="https://picsum.photos/300/200" alt="Random" /> */}
      <CardContent>
        <Stack
          gap={3}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
          >
            <CardTitle>{name}</CardTitle>
            <Button
              variant='contained'
              color='error'
              className='buttonColor'
              onClick={removeProfessor()}
            >
              X
            </Button>
          </Box>
          <CardDescription>
            {subject}
          </CardDescription>
          {console.log(review)}
          <Rating name="read-only" value={review} readOnly />
          <CardButton>Learn More</CardButton>
        </Stack>
      </CardContent>
    </CardContainer>
  );
};

export default CoolCard;