const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

router.get("/signup", userController.renderSignUpPage); 
router.post("/signup", userController.signUp); 
router.get("/login", userController.renderLoginPage);
router.post("/login", userController.login);
router.get("/blogs/create", userController.renderCreatePage);
router.get("/users", userController.getAllUsers); 
router.get("/logout", userController.logout); 

module.exports = router;
