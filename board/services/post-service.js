async function writePost(collection, post){

    post.hits = 0;
    post.createDt = new Date().toISOString();
    return await collection.insertOne(post);
}

module.exports = {
    writePost,
}