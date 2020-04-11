const express = require('express')
const app = express()
const router = express.Router()
const userController = require('../controller/userController')

const postController = require("../controller/postController")
const validater = require("../validater/validater")

router.get("/",userController.requireSigin, postController.getPosts); // token
router.post("/post/:userId",validater.createPostValidator, postController.createPost);
router.get("/getPostByUser/:userId", postController.getPostById);
router.delete("/deletePost/:postId", postController.deletePost);
router.put("/post/like", userController.requireSigin, postController.likes);
router.put("/post/unlike", userController.requireSigin, postController.unlikes);
router.get("/post/getLikes", postController.getLikes);
router.post("/comment", userController.requireSigin, postController.comment);

router.param("userId", userController.userById);
router.param("postId", postController.postById);

module.exports = router