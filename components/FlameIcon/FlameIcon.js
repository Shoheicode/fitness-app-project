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
  const { user, isSignedIn } = useUser();
  const [streakCount, setStreakCount] = useState(0);

//   useEffect(() => {
//     async function fetchAndUpdateStreak() {
//       const response = fetch("/api/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userID: user.id,
//           offset: new Date().getTimezoneOffset(),
//         }),
//       })
//         .then((res) => console.log(res))
//         .then((data) => setStreakCount(data.streak))
//         .catch((error) => console.log(error));
//     }
//     fetchAndUpdateStreak();
//   }, [user.id]);
    useEffect(()=>{
        async function getData(){
            if(!isSignedIn){
                return;
            }
            const userID = user.id;
        
            const userDocRef = doc(collection(database, "users"), userID);
            const userDocSnap = await getDoc(userDocRef);
            const batch = writeBatch(database);
        
            let streak = 0;
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const lastLoggedIn = new Date(userData.lastLoggedIn);
        
                const userOffset = new Date().getTimezoneOffset();
                const userLocaleLastLogInTime = new Date(lastLoggedIn - userOffset * 60000);
        
                const currentUserTime = new Date(new Date() - userOffset * 60000);
        
                // for testing streak artificially
                // currentUserTime.setHours(userLocaleLastLogInTime.getHours() + 12);
        
                // Calculate window for when the user can next log in to increase streak
                const tmp = new Date(userLocaleLastLogInTime);
                tmp.setHours(tmp.getHours() + 24);
        
                const start = new Date(tmp.toDateString());
        
                tmp.setHours(tmp.getHours() + 24);
        
                const end = new Date(tmp.toDateString());
        
                // calculate streak and return it
                streak = userData.streak;
                if (start <= currentUserTime && currentUserTime <= end) {
                streak += 1;
                } else if (currentUserTime > end) {
                streak = 0;
                }
        
                batch.update(userDocRef, {
                streak: streak,
                lastLoggedIn: new Date().toUTCString(),
                });
            } else {
                batch.set(userDocRef, {
                streak: 0,
                lastLoggedIn: new Date().toUTCString(),
                });
            }
        
            await batch.commit();
        }
    })

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