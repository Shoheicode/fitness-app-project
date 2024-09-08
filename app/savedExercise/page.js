'use client'
import NavBar from '@/components/navbar/navbar'
import { Box, Button, Stack, TextField, Typography , Grid} from '@mui/material'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import '@/app/CSS/LandingPage.css'
import InfoCard from '@/components/infoCard/infoCard'
import DevicesIcon from "@mui/icons-material/Devices";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { database } from '../firebase'
import TextsmsIcon from "@mui/icons-material/Textsms";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useUser } from '@clerk/nextjs'
import styled from 'styled-components';
import { useRouter } from 'next/navigation'

export default function ExercisesSaved() {

  const CardContainer = styled.div`
      width: 600px;
      min-height: 300px;
      max-height: 800px;
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

  //const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  const sendPerson = () =>{
    if(isSignedIn){
      router.push(`/ChatBot`)
    }else{
      router.push("/sign-in")
    }
  }

  const { isLoaded, isSignedIn, user } = useUser()
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
      async function getExercises() {
        if (!user) return
        
        const collectReference = collection(doc(collection(database, 'users'), user.id), 'Exercises')
        const docy = await getDocs(collectReference)

        let list = []

        docy.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push(doc.data())
        });

        setExercises(list)
      }
      getExercises()
    }, [user])

    const removeExercise = async (exercise) => {

    try {
      const name = exercise['exerciseName']
      const userDocRef = doc(collection(database, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
      const deletingDocument = doc(collection(userDocRef, 'Exercises'), name)

      //const batch = writeBatch(database)

      await deleteDoc(deletingDocument);

      const collectReference = collection(doc(collection(database, 'users'), user.id), 'Exercises')
      const docy = await getDocs(collectReference)

      let list = []

      docy.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        list.push(doc.data())
      });

      setexercises(list)
  
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
      console.error('Error removing exercises:', error)
      alert('An error occurred while removing flashcards. Please try again.')
    }

    };


  return (
    <Box>
      <Head>
        <title>AStar Exercises</title>
        <meta name="description" content="AStar Rate my exercise" />
      </Head>

      <NavBar />
      <Box 
          width={"100%"}
          min-height={"100vh"}
          sx={{ textAlign: "center" }}
          bgcolor={"black"}  
          color={"white"}
          margin={"0px"}
          padding={10}
        >
          <Typography variant="h4" component="h1" gutterBottom id='generateText'>
            Saved Exercieses
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom className="apply">
            We have all your exercises saved right here!
          </Typography>
        </Box>

        <Box 
          // sx={{ my: 6 }}
          sx={
            {
              background: 'linear-gradient(70deg, rgba(255,77,0,1) 0%, rgba(255,249,2,1) 100%)',
            }
          }
          padding={10}  
          bgcolor={"darkblue"}
          color={"white"}
          min-height={"100vh"}
        >
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            className="apply">
            Features
          </Typography>
          {exercises.length > 0 && <Box>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {exercises.map((val, index) => (
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
                          <CardTitle>{val["exerciseName"]}</CardTitle>
                          <Button
                            variant='contained'
                            color='error'
                            className='buttonColor'
                            onClick={() => removeProfessor(val)}
                          >
                            X
                          </Button>
                        </Box>
                        <CardDescription>
                          {val["bodyPart"]}
                        </CardDescription>
                        {/* <Rating name="read-only" value={parseInt(val["stars"])} readOnly /> */}
                        <CardDescription>
                          {val["instructions"].map((val, index)=>(
                            <Typography>{(index+1) + ". " + val} </Typography>
                          ))}
                        </CardDescription>
                      </Stack>
                    </CardContent>
                  </CardContainer>
                </Grid>
            ))}
          </Grid>
          </Box>}
        </Box>
      </Box>
  );
}
