const express = require("express");
const http = require("http");
const path = require("path");

const app = express();

const socket = require("socket.io");

const server = http.createServer(app);

const io = socket(server);

app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const users = {}; // To store users and their locations

io.on("connection", (socket) => {
  console.log("User connected");

  // Send the list of all users to the newly connected user
  socket.emit("all-users", users);

  socket.on("send-location", (data) => {
    users[socket.id] = data;
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user-disconnected", socket.id);
    console.log("User disconnected");
  });
});

// Route to render index.ejs
app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("listening on Port 3000");
});
