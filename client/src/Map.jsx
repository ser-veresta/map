import React from "react";
import { Circle, GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

const Map = ({ cord, locations, route }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
  });
  const [map, setMap] = React.useState(null);

  React.useEffect(() => {
    cord &&
      map?.panTo({
        lat: cord.latitude,
        lng: cord.longitude,
      });
    map?.setZoom(6);
  }, [cord, map]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
      }}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {cord && (
        <Circle
          center={{
            lat: cord.latitude,
            lng: cord.longitude,
          }}
          options={{
            strokeColor: "#f2f2f2",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: "#2970E8",
            fillOpacity: 1,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 14000,
            zIndex: 1,
          }}
        />
      )}
      {locations &&
        locations?.map((loc, i) => <Marker key={i} position={{ lat: Number(loc.lat), lng: Number(loc.lng) }} />)}

      {route && (
        <Polyline
          path={route}
          options={{
            strokeColor: "#000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#000",
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            paths: route,
            zIndex: 1,
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
