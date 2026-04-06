/**
 * Memory Agent
 * Stores and retrieves previously generated posts.
 * Uses in-memory cache + MongoDB for persistence.
 */

const Post = require('../server/models/Post');

// In-memory cache for quick access
let cache = [];

async function save(postData) {
  const post = new Post(postData);
  const saved = await post.save();
  cache.unshift(saved.toObject());
  // Keep cache size manageable
  if (cache.length > 50) cache = cache.slice(0, 50);
  return saved;
}

async function getAll() {
  const posts = await Post.find().sort({ createdAt: -1 });
  cache = posts.map(p => p.toObject());
  return posts;
}

async function getById(id) {
  // Check cache first
  const cached = cache.find(p => p._id.toString() === id);
  if (cached) return cached;
  
  const post = await Post.findById(id);
  return post;
}

async function deleteById(id) {
  cache = cache.filter(p => p._id.toString() !== id);
  return Post.findByIdAndDelete(id);
}

async function updateById(id, updates) {
  const updated = await Post.findByIdAndUpdate(id, updates, { new: true });
  if (updated) {
    cache = cache.map(p => p._id.toString() === id ? updated.toObject() : p);
  }
  return updated;
}

function getCachedPosts() {
  return cache;
}

module.exports = { save, getAll, getById, deleteById, updateById, getCachedPosts };
