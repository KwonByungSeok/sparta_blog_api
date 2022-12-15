const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

const Post = require("../schemas/Post");

router.get("/", async (req, res) => {
  try {
    // find() -> 모든 데이터 가져오기
    const posts = await Post.find().sort({ "_id": -1 });
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

// 게시물 작성
router.post("/", async (req, res) => {
  const post = new Post({
    user: req.body.user,
    password: req.body.password,
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const savedPost = await post.save();
    res.json({ "message": "게시글을 생성하였습니다." });
  } catch (err) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

// 포스트 한개만 가져오기
router.get("/:postId", async (req, res) => {
  try {
    // find() -> 모든 데이터 가져오기
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (err) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

// 포스트 한개만 업데이트하기
router.patch("/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  console.log(req.body.user);
  if (post.password == req.body.password) {
    if (req.body.user && req.body.title && req.body.content) {
      try {
        const updatedPost = await Post.updateOne(
          { _id: req.params.postId },
          {
            $set: {
              user: req.body.user,
              title: req.body.title,
              content: req.body.content,
            },
          }
        );
        res.status(200).json({ "message": "게시글을 수정하였습니다." });
      } catch (err) {
        res.status(404).send({
          message: "게시글 조회에 실패하였습니다.",
        });
      }
    } else {
      return res.status(400).send({
        message: "데이터 형식이 올바르지 않습니다.",
      });
    }
  } else {
    return res.status(404).send({
      message: "비밀번호가 다릅니다.",
    });
  }
});

// 포스트 한개 삭제하기
router.delete("/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (post.password == req.body.password) {
    try {
      const removePost = await Post.remove({ _id: req.params.postId });
      res.json(removePost);
    } catch (err) {
      res.json({ message: err });
    }
  } else {
    res.status(404).send({
      message: "비밀번호가 다릅니다.",
    });
  }
});

module.exports = router;
