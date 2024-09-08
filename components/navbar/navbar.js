import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  createTheme,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import * as React from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import FolderIcon from "@mui/icons-material/Folder";
import HelpIcon from "@mui/icons-material/Help";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import "@/app/CSS/LandingPage.css";
import FlameIcon from "../flameIcon/flameIcon";

export default function NavBar() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const { isLoaded, isSignedIn, user } = useUser();

  const [userName, setUsername] = React.useState("");

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key={"AStar Fitness"} disablePadding>
          <ListItemButton href="/">
            <ListItemIcon>
              <HomeIcon></HomeIcon>
            </ListItemIcon>
            <Typography className="apply">AStar Fitness</Typography>
          </ListItemButton>
        </ListItem>
        <ListItem key={"Fitness Bot"} disablePadding>
          <ListItemButton href="/FitnessBot">
            <ListItemIcon>
              <SmartToyIcon></SmartToyIcon>
            </ListItemIcon>
            <Typography className="apply">Fitness Bot</Typography>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Stack
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        padding={4}
      >
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Typography fontSize={20}>
          {isLoaded && isSignedIn && user.fullName}
        </Typography>
      </Stack>
    </Box>
  );

  if (!isLoaded || !isSignedIn) {
    console.log("HIHIHII");
    return (
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color={"secondary"}>
          <Toolbar>
            <Link href={"/"} style={{ flexGrow: 1 }}>
              <Typography variant="h6">AStar Rate my Professor</Typography>
            </Link>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        {/* <Drawer
                    open={open} onClose={toggleDrawer(false)}
                  >
                    {EmptyDrawerList}
              </Drawer> */}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static" color={"secondary"}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
            }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon></MenuIcon>
          </IconButton>
          <Link href={"/"} style={{ flexGrow: 1 }}>
            <Typography variant="h6" className="apply">
              AStar Rate my Professor
            </Typography>
          </Link>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>

          <SignedIn>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FlameIcon />
              <UserButton />
            </Box>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </ThemeProvider>
  );
}
