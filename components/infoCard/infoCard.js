import { Box, Grid, Typography } from "@mui/material";
import "./typewrite.css"

export default function InfoCard({ icon, title, subtitle }) {
  return (
    
    <Grid item xs={12} md={4}>
      <Box
        bgcolor={"black"}
        padding={5}
        borderRadius={5}
        minHeight={"60vh"}
        className="grow"
      >
        {icon}
        <Typography variant="h3" className="apply">{title}</Typography>
        <Typography fontSize={30} className="apply">{subtitle}</Typography>
      </Box>
    </Grid>
  );
}
