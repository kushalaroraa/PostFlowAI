const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// All routes are prefixed with /api/posts
router.post('/generate', postController.generatePost);
router.get('/', postController.getPosts);
router.put('/:id', postController.updatePost); // General update for edits and scheduling
router.post('/:id/publish', postController.publishToX);
router.delete('/:id', postController.deletePost);

module.exports = router;
