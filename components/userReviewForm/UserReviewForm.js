import {
  Box,
  FormControl,
  Button,
  TextField,
  Rating,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function UserReviewForm({ isLink }) {
  const [link, setLink] = useState("");

  const [stars, setStars] = useState(0);
  const [professor, setProfessor] = useState("");
  const [subject, setSubject] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const send_url = isLink
      ? "http://ec2-18-117-223-248.us-east-2.compute.amazonaws.com/scrapeAndUpsertReviews"
      : "/api/addSingleReview";

    const body_obj = isLink
      ? { url: link }
      : {
          professor: professor,
          stars: stars,
          subject: subject,
          review: review,
        };

    fetch(send_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body_obj),
    })
      .then((data) => data.text())
      .then((res) => console.log(res));
  };

  return isLink ? (
    <Box>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
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
