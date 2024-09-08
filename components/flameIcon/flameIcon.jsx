import { useState } from "react";
import Image from "next/image";
import Box from '@mui/material/Box';
import Popper from "@mui/material/Popper";
import Fade from '@mui/material/Fade';

import fireIcon from "@/public/flame.svg";
import "./flameIcon.css";

export default function FlameIcon() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleEnter = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleExit = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(false);
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'transition-popper' : undefined;

    return (
        <div>
            <Image id="flame" src={fireIcon} alt="Flame Icon" onMouseEnter={handleEnter} onMouseLeave={handleExit} />
            <Popper id={id} open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box sx={{ marginTop: 2, border: 1, p: 1, bgcolor: 'background.paper' }}>
                            Your current streak: 1
                        </Box>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}