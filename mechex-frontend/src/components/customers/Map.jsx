import React, { useEffect, useState } from 'react';
//imports necessary components from the @react-google-maps/api library.
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

function Map() {
  //The mapContainerStyle object defines the width and height of the map container
  const mapContainerStyle = {
    width: '100%',
    height: '800px',
  };
//The center object defines the latitude and longitude coordinates of the center point of the map.
  const center = {
    lat: 6.5244, // Lagos latitude
    lng: 3.3792, // Lagos longitude
  };

//The mechanics array stores different mechanics with their  latitude, longitude, and name.
  const mechanics = [
    { lat: 6.5244, lng: 3.3792, name: 'Mechanic 6' },
    { lat: 6.48045, lng: 3.35098, name: 'Oyingbo Mechanic Village' },
    { lat: 6.4302959, lng: 3.4259789, name: 'Fast Repairs Auto Garage' },
    { lat: 6.521231, lng: 3.3795608, name: 'Nenis Auto Care' },
    { lat: 6.42979, lng: 3.4239399, name: 'Globe Motors' },
    { lat: 6.45306, lng: 3.39583, name: '3 Point Auto Tech Nig1' },
    { lat: 6.57491136, lng: 3.392802115, name: 'Volvo SMT ' },
    { lat: 6.44056077527, lng: 3.46126198769, name: 'D.T Autocafe' },
    { lat: 6.5245, lng: 3.3792, name: 'Mechanic 1' },
    { lat: 6.5246, lng: 3.3792, name: 'Mechanic 2' },
    { lat: 6.5249, lng: 3.3792, name: 'Mechanic 3' },
  ];
  
  //The selectedMechanic state variable is used to track the currently selected mechanic.
  const [selectedMechanic, setSelectedMechanic] = useState(null);


  const [map, setMap] = useState(null);

  // onLoad function is called when the Google Map component is loaded and sets the map reference in the map state variable.
  const onLoad = (map) => {
    setMap(map);
  };
  
  //The useEffect hook is used to create markers on the map for each mechanic in the mechanics array. It runs whenever the map or mechanics variables change.
  useEffect(() => {
    if (map) {
      mechanics.forEach((mechanic) => {
        new window.google.maps.Marker({
          position: { lat: mechanic.lat, lng: mechanic.lng },
          map: map,
          title: mechanic.name,
        });
      });
    }
  }, [map, mechanics]);

/**The LoadScript component loads the Google Maps JavaScript library by providing the API key
 * The GoogleMap component renders the map with container style, center coordinates, and initial zoom level
 * Inside the GoogleMap component, Marker components are rendered for each mechanic in the mechanics array. 
 * They are positioned using the mechanic's coordinates
 */
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCesJ17qITXGLfr2PLEPUFUwj9o3ie7GhU" // Replace with your actual Google Maps API key
    >

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
      >
        {mechanics.map((mechanic, index) => (
          <Marker
            key={`${mechanic.name}-${index}`}
            position={{ lat: mechanic.lat, lng: mechanic.lng }}
            onClick={() => setSelectedMechanic(mechanic)}
          />
        ))}

      </GoogleMap>



    </LoadScript>
  );
}

export default Map;
