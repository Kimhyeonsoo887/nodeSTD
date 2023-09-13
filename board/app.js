const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");
const { ObjectId } = require("mongodb");

let collection;
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.engine("handlebars", 
    handlebars.create({
        helpers: require("./configs/handlebars-helpers"),
    }).engine,
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || 1;
    try{
        const [posts, paginator] = await postService.list(collection, page, search);
        res.render("home", {title: "안녕하세요", search, paginator, posts});
    }catch(error){
        console.error(error);
    }

    
});

app.get("/write", (req, res) => {
    res.render("write", { title: "테스트 게시판", mode: "create"});
});

app.post("/write", async (req, res) => {

    const post = req.body;
    //글쓰기 후 결과 반환
    const result = await postService.writePost(collection, post);
    //생성된 도큐먼트의 _id를 사용해 상세페이지로 이동
    res.redirect(`/detail/${result.insertedId}`);
});

app.get("/detail/:id", async (req, res) => {

    console.log(req.params.id);
    const result = await postService.getDetailPost(collection, req.params.id);

    console.log(result.value);

    res.render("detail", {
        title: "테스트 게시판",
        post: result.value
    });

});

app.get("/modify/:id", async (req, res) => {
    const { id } = req.params.id;
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", { title: "테스트 게시판", mode: "modify", post});
    
});

app.post("/modify/", async (req, res) => {
    const { id, title, writer, password, content} = req.body;

    const post = {
        title,
        writer,
        password,
        content,
        createdDt : new Date().toISOString(),
    };

    const result = postService.updatePost(collection, id, post);
    res.redirect(`/detail/${id}`);

});


//id, password값을 가져옴
app.post("/check-password", async (req, res) => {
    const {id, password} = req.body;

    //postService의 getPostByIdAndPassword() 함수를 사용해 게시글 데이터 확인
    const post = await postService.getPostByIdAndPassword(collection, { id, password});

    //데이터가 있으면 isExist true, 없으면 isExist false
    if(!post) {
        return res.status(404).json({ isExist: false});
    }else{
        return res.json({ isExist: true });
    }
});

app.delete("/delete", async (req, res) => {
    const {id, password} = req.body;
    try{
        const result = await collection.deleteOne({ _id: ObjectId(id), password: password});

        if(result.deletedCount !== 1){
            console.log("삭제 실패");
            return res.json({ isSuccess: false});
        }
        return res.json({ isSuccess: true});
    }catch(Error){
        
    }
});
app.listen(3000, async() => {
    console.log("Server started");

    const mongoClient = await mongodbConnection();

    collection = mongoClient.db().collection("post");
    console.log("MongoDB connected");
});

