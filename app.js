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

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
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
