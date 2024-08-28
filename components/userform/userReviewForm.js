import { database } from "@/app/firebase";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  FormControl,
  Button,
  TextField,
  Rating,
  Typography,
} from "@mui/material";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";

import { useState } from "react";

export default function UserReviewForm() {
  const [isLink, setIsLink] = useState(true);
  const [link, setLink] = useState("");

  const [stars, setStars] = useState(0);
  const { isLoaded, isSignedIn, user } = useUser();
  const [professor, setProfessor] = useState("");
  const [subject, setSubject] = useState("");
  const [review, setReview] = useState("");

  const saveReview = async () => {
    try {
      console.log("HIHIHIHI");
      const userDocRef = doc(collection(database, "reviews"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      console.log("HIHIHIHI");
      const batch = writeBatch(database);

      const reviewProf = {
        professor: professor,
        stars: stars,
        subject: subject,
        review: review,
      };

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log(userData.Review);

        if (!userData.Review.includes(professor)) {
          const updatedSets = [...(userData.Review || []), professor];
          batch.update(userDocRef, { Review: updatedSets });
        } else {
          batch.set(userDocRef, { Review: [professor] });
        }
      } else {
        console.log("HIHIHIHI");
        batch.set(userDocRef, { Review: [professor] });
      }
      console.log("PROFEJSKLJLFA");

      const setDocRef = doc(collection(userDocRef, "Professor"), professor);
      const setDocSnap = await getDoc(userDocRef);
      if (setDocSnap.exists()) {
        console.log("I EXIST! I AM INVINCIBLE");
      }
      batch.set(setDocRef, reviewProf);

      await batch.commit();

      alert("Flashcards saved successfully!");
      //handleCloseDialog()
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await saveReview();

    fetch("/api/addSingleReview", {
      method: "POST",
      body: JSON.stringify({
        professor: professor,
        stars: stars,
        subject: subject,
        review: review,
      }),
    });
  };

  const handleSubmitLink = async (event) => {
    event.preventDefault();

    fetch(
      "http://ec2-18-117-223-248.us-east-2.compute.amazonaws.com/scrapeAndUpsertReviews",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: link }),
      }
    )
      .then((data) => data.text())
      .then((res) => console.log(res));
  };

  return isLink ? (
    <Box>
      <form
        onSubmit={handleSubmitLink}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <Typography component="legend">
          Submit a Rate My Professor Link
        </Typography>
        <TextField
          id="outlined-basic"
          label="Link"
          variant="outlined"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </Box>
  ) : (
    <Box>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <div>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="simple-controlled"
            value={stars}
            onChange={(event, newValue) => {
              setStars(newValue);
            }}
          />
        </div>

        {/* <InputLabel htmlFor="my-input">Email address</InputLabel> */}
        <TextField
          id="outlined-basic"
          label="Professor"
          variant="outlined"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          required
        />
        <TextField
          id="outlined-basic"
          label="Subject"
          variant="outlined"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <TextField
          id="outlined-basic"
          label="Review"
          variant="outlined"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          multiline
        />
        {/* <Input id="my-input" aria-describedby="my-helper-text" /> */}
        {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </Box>
  );
}
