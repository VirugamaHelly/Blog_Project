const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/db");
const BlogRoutes = require("./Routes/BlogRoutes"); // Blog routes
const UserRoutes = require("./Routes/UserRoutes"); // User routes

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser()); // Cookie parsing middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/uploads', express.static('uploads'));





// Routes
app.use("/blogs", BlogRoutes); // Blog-related routes
app.use("/user", UserRoutes); // User-related routes

app.get("/", (req, res) => {
  const user = null; 
  res.render("Navbar", { user });
});
app.get("/user", (req, res) => {
  const user = null; 
  res.render("Navbar", { user });
});

// MongoDB Connection

// Start the server
app.listen(7688, () => {
  console.log(`Server running on http://localhost:7688`);
});
