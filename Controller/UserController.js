const fs = require("fs");
const path = require("path");
const multer = require("multer");
const UserModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const uploadDir = path.join(__dirname, "../Uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Signup 
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const image = req.file ? req.file.filename : null;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      image,
    });

    console.log("Signup success", newUser);
    res.redirect("/user/login");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const renderSignUpPage = (req, res) => {
  res.render("signUP", { user: req.user });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "private-key",
      { expiresIn: "1h" }
    );

    console.log("Login successful");
    res.redirect("/blogs/create");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const renderLoginPage = (req, res) => {
  res.render("login", { user: req.user });
};

const renderCreatePage = (req, res) => {
  res.render("create", { user: req.user });
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    console.log("All user data", users);
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
const logout = async (req, res) => {
  try {
    const userId = req.user.id; 
    await UserModel.findByIdAndDelete(userId);
    res.clearCookie("token");

    console.log("User deleted and logout successful");

    res.redirect("/user/login");
  } catch (error) {
    console.error("Logout and delete error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};


module.exports = {
  signUp: [upload.single("image"), signUp],
  login,
  renderSignUpPage,
  renderLoginPage,
  renderCreatePage,
  getAllUsers,
  logout
};
