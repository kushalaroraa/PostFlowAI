const Post = require('../models/Post');
const memory = require('../../agent/memory');
const { generatePost: generateAiPost } = require('../../agent/executor');
const { postToX } = require('../integrations/x');
const { logAiCall } = require('../../agent/logger');

exports.generatePost = async (req, res) => {
  try {
    const { topic, persona, tone, style, keywords } = req.body;
    
    // Call Gemini Agent
    const aiData = await generateAiPost({ 
      topic, 
      persona, 
      tone: tone || 'Professional', 
      style: style || 'Engaging', 
      keywords: keywords || [] 
    });
    
    // Combine AI results with user input
    const finalPost = {
      ...aiData,
      status: 'draft',
      platform: 'None',
      isAiGenerated: true,
      aiGeneratedAt: new Date()
    };

    const saved = await memory.save(finalPost);
    logAiCall('GENERATE_POST_WITH_TIMING', { topic, persona, id: saved._id });

    res.status(201).json({
      message: 'Post generated successfully',
      post: saved
    });
  } catch (error) {
    if (error.message.includes('AI generation failed')) {
      console.error('🤖 AI Generation Error:', error.message);
      return res.status(500).json({ error: 'AI failed to generate content. Please try again later.' });
    }
    
    console.error('💾 Database/Server Error:', error.message);
    res.status(500).json({ error: 'Failed to save or process post. Check database connection.' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.schedulePost = async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        scheduledAt,
        status: 'scheduled'
      },
      { new: true }
    );
    res.json({ message: 'Post scheduled successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule post' });
  }
};

exports.publishToX = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const result = await postToX(post);
    
    post.status = 'posted';
    post.platform = 'X';
    await post.save();

    res.json({ message: 'Posted to X successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish to X' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
