const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Debugging
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
      alert(
        "Unable to retrieve your location. Please check your location settings."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 15); // Start with a more general view

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Pranav",
}).addTo(map);

const markers = {};

// Handle receiving all users
socket.on("all-users", (users) => {
  for (const id in users) {
    const { latitude, longitude } = users[id];
    if (!markers[id]) {
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
  }
});

// Handle receiving location updates
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
  map.setView([latitude, longitude]); // Optionally focus map on latest location
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
