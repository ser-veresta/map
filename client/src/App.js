import React from "react";
import { CssBaseline, Box, Button, Slide, IconButton, useMediaQuery } from "@mui/material";
import Content from "./Content";
import { SnackbarProvider } from "notistack";
import { Close } from "@mui/icons-material";

function App() {
  const md = useMediaQuery("(min-width:900px)");
  const [home, setHome] = React.useState(null);
  const ref = React.useRef(null);

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition((p) => setHome(p.coords));
  };

  return (
    <>
      <SnackbarProvider
        ref={ref}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        maxSnack={1}
        TransitionComponent={Slide}
        action={
          <IconButton onClick={() => ref.current.closeSnackbar()}>
            <Close />
          </IconButton>
        }
        dense={!md}
      >
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#72A1BF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Button
            onClick={handleClick}
            variant="contained"
            sx={{
              position: "absolute",
              top: 15,
              left: 15,
              bgcolor: "#f2f2f2",
              color: "#074770",
              fontWeight: "600",
              "&:hover": {
                bgcolor: "#aaa",
              },
            }}
          >
            home
          </Button>
          <Box
            sx={{
              minHeight: { xs: "95%", md: "80%" },
              width: { xs: "95%", md: "80%" },
              bgcolor: "#ffff",
              borderRadius: 5,
            }}
          >
            <Content home={home} setHome={setHome} />
          </Box>
        </Box>
      </SnackbarProvider>
    </>
  );
}

export default App;
