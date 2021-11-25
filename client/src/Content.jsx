import React from "react";
import { Box, Button, Grid, TextField, Typography, useMediaQuery } from "@mui/material";
import Map from "./Map";
import axios from "axios";
import { useSnackbar } from "notistack";

const Content = ({ home, setHome }) => {
  const md = useMediaQuery("(min-width:900px)");
  const [cord, setCord] = React.useState(null);
  const [locations, setLocations] = React.useState([]);
  const [route, setRoute] = React.useState([]);
  const [name, setName] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [lng, setLng] = React.useState("");
  const [err, setErr] = React.useState({ name: "", lat: "", lng: "" });
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (home) {
      setName("Home");
      setLat(home.latitude);
      setLng(home.longitude);
      setHome(null);
    }
  }, [home, setHome]);

  const handleAdd = () => {
    if (!name) setErr((prev) => ({ ...prev, name: "Enter a name" }));

    if (!lat) setErr((prev) => ({ ...prev, lat: "Enter a latitude" }));

    if (!lng) setErr((prev) => ({ ...prev, lng: "Enter a longitude" }));

    if (!name || !lat || !lng) return;

    if (locations.length >= 5) return;

    if (!cord) {
      setCord({ name, latitude: Number(lat), longitude: Number(lng) });
      setName("");
      setLat("");
      setLng("");
      setErr({ name: "", lat: "", lng: "" });
      return;
    }

    setLocations((prev) => [...prev, { name, lat, lng }]);

    setName("");
    setLat("");
    setLng("");
    setErr({ name: "", lat: "", lng: "" });
  };

  const handleRoute = async () => {
    try {
      let res;
      if (!localStorage.getItem("id")) {
        res = await axios.get(`https://map-99.herokuapp.com/${"new"}`);
        const { id } = res.data;

        localStorage.setItem("id", id);
      } else {
        res = await axios.get(`https://map-99.herokuapp.com/${localStorage.getItem("id")}`);
      }

      res.data.success &&
        setRoute([
          { lat: cord.latitude, lng: cord.longitude },
          ...locations.map((item) => ({ lat: Number(item.lat), lng: Number(item.lng) })),
        ]);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.errorMessage || "Server Error", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "150px",
          bgcolor: "#074770",
          display: "flex",
          alignItems: "center",
          borderRadius: "20px 20px 0 0",
          justifyContent: "space-between",
          p: { xs: 1, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, md: 4 },
            mr: { xs: 1, md: 0 },
          }}
        >
          <TextField
            sx={{ bgcolor: "rgba(255,255,255,0.8)", borderRadius: "8px 8px 0 0" }}
            variant="filled"
            label="Location Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(err.name)}
            helperText={err.name && err.name}
            size={md ? "medium" : "small"}
          />
          <TextField
            sx={{ bgcolor: "rgba(255,255,255,0.8)", borderRadius: "8px 8px 0 0" }}
            variant="filled"
            label="Enter Lattitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            error={Boolean(err.lat)}
            helperText={err.lat && err.lat}
            size={md ? "medium" : "small"}
          />
          <TextField
            sx={{ bgcolor: "rgba(255,255,255,0.8)", borderRadius: "8px 8px 0 0" }}
            variant="filled"
            label="Enter Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            error={Boolean(err.lng)}
            helperText={err.lng && err.lng}
            size={md ? "medium" : "small"}
          />
        </Box>
        <Button
          onClick={handleAdd}
          sx={{
            bgcolor: "#f2f2f2",
            color: "#074770",
            fontWeight: "600",
            borderRadius: 5,
            "&:hover": {
              bgcolor: "#aaa",
            },
          }}
          size={md ? "large" : "small"}
          variant="contained"
        >
          {cord ? "add" : "submit"}
        </Button>
      </Box>
      <Box sx={{ minHeight: "calc(100% - 150px)" }}>
        <Grid sx={{ height: "100%" }} container>
          <Grid sx={{ p: { xs: 1, md: 4 } }} item xs={7} md={6}>
            <Typography sx={{ color: "#074770" }} variant={md ? "h5" : "body1"}>
              ALL CO-ORDINATES:
            </Typography>
            <Grid sx={{ mt: 2 }} container>
              <Grid item xs={6}>
                <Typography sx={{ color: "#074770" }} variant={md ? "h6" : "caption"}>
                  My Co-ordinates
                </Typography>
                {new Array(5).fill(0).map((_, i) => (
                  <Typography sx={{ display: "block" }} key={i} variant={md ? "body1" : "caption"}>
                    {i + 1}) {locations[i] ? locations[i].name : "----------"}
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ color: "#074770" }} variant={md ? "h6" : "caption"}>
                  DEFAULT
                </Typography>
                {new Array(5).fill(0).map((_, i) => (
                  <Typography sx={{ display: "block" }} key={i} variant={md ? "body1" : "caption"}>
                    {locations[i] ? locations[i].lat : "----------"}
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ color: "#074770" }} variant={md ? "h6" : "caption"}>
                  DEFAULT
                </Typography>
                {new Array(5).fill(0).map((_, i) => (
                  <Typography sx={{ display: "block" }} key={i} variant={md ? "body1" : "caption"}>
                    {locations[i] ? locations[i].lng : "----------"}
                  </Typography>
                ))}
              </Grid>
            </Grid>
            <Button
              sx={{
                bgcolor: "#074770",
                borderRadius: 5,
                mt: { xs: 5, md: 10 },
                color: "#f2f2f2",
                "&:hover": {
                  bgcolor: "#074760",
                },
                "&:disabled": {
                  color: "#f2f2f2",
                  bgcolor: "#aaa",
                  cursor: "not-allowed",
                  pointerEvents: "auto",
                },
              }}
              disabled={!locations.length}
              fullWidth
              onClick={handleRoute}
            >
              show route
            </Button>
            <Button
              sx={{
                bgcolor: "#074770",
                borderRadius: 5,
                mt: 1,
                color: "#f2f2f2",
                "&:hover": {
                  bgcolor: "#074760",
                },
                "&:disabled": {
                  color: "#f2f2f2",
                  bgcolor: "#aaa",
                  cursor: "not-allowed",
                  pointerEvents: "auto",
                },
              }}
              disabled={!cord}
              fullWidth
              onClick={() => {
                setLocations([]);
                setRoute([]);
                setCord(null);
              }}
            >
              clear
            </Button>
          </Grid>
          <Grid item xs={5} md={6}>
            <Box sx={{ height: "100%" }}>
              <Map cord={cord} locations={locations} route={route} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Content;
