const { MongoClient } = require("mongodb");


const uri = "mongodb+srv://rlagustn8705:158wjddkwn@cluster0.sdjyqkm.mongodb.net/test";

module.exports = function(callback){
    return MongoClient.connect(uri,callback);
}