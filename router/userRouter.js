const express = require('express')
const router = express.Router();

const userController = require('../controller/userController')
const validator = require('../validater/validater')

router.post("/signUp", validator.userSignUpValidation, userController.signupUser)
router.post("/signin", userController.signin)
router.get("/signOut", userController.signOut)
router.get("/allUsers", userController.getAllUsers);
router.get("/getUserId/:userId", userController.getUser);
router.put("/updateUser/:userId", validator.userSignUpValidation, userController.updateUser);
router.delete("/deletUser/:userId", validator.userSignUpValidation, userController.deleteUser);
router.put("/user/follow", userController.requireSigin, userController.addFollowing, userController.addFollower);
router.put("/user/unfollow", userController.requireSigin, userController.removeFollowing, userController.removeFollower);


router.param("userId", userController.userById);

module.exports = router