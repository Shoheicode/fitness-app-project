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

  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  const sendPerson = () =>{
    if(isSignedIn){
      router.push(`/ChatBot`)
    }else{
      router.push("/sign-in")
    }
  }

  return (
    <Box>
      <Head>
        <title>AStar Rate my Professor</title>
        <meta name="description" content="AStar Rate my Professor" />
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
            AStar Fitness
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom className="apply">
            The easiest way to start figuring out what exercise would fit you the most!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 2 }}
            onClick={sendPerson}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ mt: 2 }}
            href="/learnmore"
          >
            Learn More
          </Button>
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
          <Grid container spacing={4}>
            {/* Feature items */}
            <InfoCard
              
              icon={<TextsmsIcon />}
              title="Text to Fitness Exercises in Seconds"
              subtitle="Ask for your subject and professor and our chat-bot will take it away!"
            />
            <InfoCard
              icon={<DevicesIcon />}
              title="Easy Access"
              subtitle="Your saved exercises will be able to be accessed from anywhere and be easy to save"
            />
            <InfoCard
              icon={<AutoAwesomeIcon />}
              title="Harness Artificial Intelligence"
              subtitle="Watch AI search to find the exercises that fits you the best"
            />
          </Grid>
        </Box>
      </Box>
  );
}
