'use client'
import NavBar from '@/components/navbar/navbar'
import { Box, Button, Stack, TextField, Typography , Grid} from '@mui/material'
import Head from 'next/head'
import { useState } from 'react'
import '@/app/CSS/LandingPage.css'
import InfoCard from '@/components/infoCard/infoCard'
import DevicesIcon from "@mui/icons-material/Devices";
import TextsmsIcon from "@mui/icons-material/Textsms";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {

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
        <title>AStar Rate my exercise</title>
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
          
        </Box>
      </Box>
  );
}
