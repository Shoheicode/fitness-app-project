"use client";
import About from "@/components/AboutPage/about";
import NavBar from "@/components/navbar/navbar";
import UserReviewForm from "@/components/userform/userReviewForm";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, Fragment } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  let ranFirst = false;

  return (
    <Box>
        <NavBar />
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <About/>
      </Box>
    </Box>
  );
}