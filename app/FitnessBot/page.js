"use client";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState, Fragment } from "react";
import { database } from "../firebase";
import { collection, deleteDoc, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import NavBar from "@/components/navbar/navbar";
import '@/app/CSS/MovingBackground.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import styled from 'styled-components';

export default function Home() {

  const CardContainer = styled.div`
  width: 300px;
  height: 150px;
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

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the AStar Fitness support assistant. How can I help you today?`,
    },
  ]);
  const { isLoaded, isSignedIn, user } = useUser()
  const [message, setMessage] = useState("");
  const [firstMessage, setFirstMessage] = useState(null);
  let ranFirst = false;
  const [likedMessages, setLikes] = useState([])

  const sendMessage = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader.read().then(async function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });

        if (!ranFirst) {
          console.log("I AM RUNNING INIHIHIHol")
          console.log(text)
          let string = text.substring(0, text.lastIndexOf("}")+1)
          //Right here, we have to figure out if the professors are saved in the firebase
          console.log("I AM THIS STRING:")
          console.log(string)
          let lis = [];
          ranFirst = true;
          for (var i = 0; i < JSON.parse(string).data.length; i++) {
            try {
              console.log("HIHIHIIHI")
              
              const userDocRef = doc(collection(database, "users"), user.id);
              //setDoc(cityRef, { capital: true }, { merge: true });
              const userDocSnap = await getDoc(userDocRef);

              const batch = writeBatch(database);

              if (userDocSnap.exists()) {
                console.log("EXISTS")
                const userData = userDocSnap.data();
                if (
                  !userData.Exercises.includes(
                    JSON.parse(string).data[i].exerciseName
                  )
                ) {
                  lis.push(false);
                } else {
                  lis.push(true);
                }
              } else {
                await setDoc(doc(database, "users", user.id), {
                  Exercises: []
                });
                //batch.set(userDocRef, { Exercises: [] });
                lis = [false, false, false];
              }
            } catch (error) {
              console.error("Error saving exercises:", error);
              alert(
                "An error occurred while saving exercises. Please try again."
              );
            }
          }
          setLikes(lis);
          setFirstMessage(JSON.parse(string));
          console.log(JSON.parse(string));
        } else {
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
        }

        return reader.read().then(processText);
      });
    });
  };

  const saveExercise = async (exercise) => {

    try {
      const userDocRef = doc(collection(database, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
  
      const batch = writeBatch(database)
      
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        if (!userData.Exercises.includes(exercise['exerciseName'])){
          //console.log("HIHIHI AM RUNNING HHOHOHOHO")
          const updatedSets = [...(userData.Exercises || []), exercise['exerciseName'] ]
          batch.update(userDocRef, { Exercises: updatedSets })
        }
        
      } else {
        batch.set(userDocRef, { Exercises: [exercise['exerciseName']] })
      }
  
      const setDocRef = doc(collection(userDocRef, 'Exercises'), exercise['exerciseName'])
      await setDoc(setDocRef, exercise)
  
      await batch.commit()
      //handleCloseDialog()

    } catch (error) {
      console.error('Error saving exercises:', error)
      alert('An error occurred while saving exercises. Please try again.')
    }

  };

  const removeExercise = async (exercise) => {

    try {
      const name = exercise['exerciseName']
      const userDocRef = doc(collection(database, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
      const deletingDocument = doc(collection(userDocRef, 'Exercises'), name)

      //const batch = writeBatch(database)

      await deleteDoc(deletingDocument);

      // const batch = writeBatch(database)
      
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
          if (userData.Exercises.includes(name)){
            const index = userData.Exercises.indexOf(name);
            userData.Exercises.splice(index, 1);
            let exer = userData.Exercises
            await setDoc(userDocRef, {Exercises: exer})
          }
      }

    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }

  };

  const handleClick = (prof, index) => {
    if (!likedMessages[index]) {
      saveExercise(prof)
    } else {
      removeExercise(prof);
    }
    setLikes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  };


  return (
    <Box>
      <NavBar />
      <Box
        min-width="100vw"
        min-height="100vh"
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        paddingTop={10}
        
      >
        <Stack
          className="moving-background-chatbot"
          direction={"column"}
          width="500px"
          height="700px"
          border="1px solid black"
          p={2}
          spacing={3}
        >
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main"
                  }
                  color="white"
                  borderRadius={10}
                  p={3}
                >
                  {message.content.split("\n").map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              sx={
                {
                  backgroundColor: "white!important",
                  borderRadius: "5px"
                }
              }
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" 
                onClick={sendMessage}
            >
              Send
            </Button>
          </Stack>
        </Stack>
        {firstMessage && <Box>
            {firstMessage.data.map((jsonFile, index) => (
              <Box
                key={index}
              >
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={index}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
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
                          <CardTitle>{jsonFile["exerciseName"]}</CardTitle>
                          <Button
                          onClick={() => handleClick(jsonFile, index)}
                          >
                            {
                              likedMessages[index] ? <FavoriteIcon/> : <FavoriteBorderIcon/>
                            }
                          </Button>
                        </Box>
                        <CardDescription>
                          {jsonFile["target"]}
                          
                        </CardDescription>
                        {/* <CardButton>Learn More</CardButton> */}
                      </Stack>
                    </CardContent>
                  </CardContainer>
                </Grid>
              </Box>
            ))
            }
          </Box>
        }
      </Box>
    </Box>
  );
}