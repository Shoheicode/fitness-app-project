import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";

import fireIcon from "@/public/flame.svg";
import "./flameIcon.css";

const popperStyles = {
color:"white",
  marginTop: 1.5,
  border: 1,
  p: 1,
  bgcolor: "background.paper",
};

export default function FlameIcon() {
  const { user } = useUser();
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    async function fetchAndUpdateStreak() {
      fetch("/api/updateAndGetStreak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user.id,
          offset: new Date().getTimezoneOffset(),
        }),
      })
        .then((res) => res.json())
        .then((data) => setStreakCount(data.streak));
    }
    fetchAndUpdateStreak();
  }, [user.id]);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  const handleIconEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleIconExit = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(false);
  };

  return (
    <div>
      <Image
        id="flame"
        src={fireIcon}
        alt="Flame Icon"
        onMouseEnter={handleIconEnter}
        onMouseLeave={handleIconExit}
      />
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box sx={popperStyles}>Your current streak: {streakCount}</Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
}