async function postToX(post) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`\n🐦 [Mock X API] Successfully tweeted: "${post.caption.substring(0, 40)}..."`);
      if (post.imageUrl) {
         console.log(`   🖼️  Attached image: ${post.imageUrl}`);
      }
      resolve(true);
    }, 1000);
  });
}

module.exports = { postToX };
