const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

const Comment = require("../schemas/Comment");
const Post = require("../schemas/Post");

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // find() -> 모든 데이터 가져오기
    const comments = await Comment.find({ postId: postId }).sort({ "_id": -1 });
    res.json(comments);
  } catch (err) {
    res.json({ message: err });
  }
});

// 댓글 생성
router.post("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, password, content } = req.body;

    if (Object.keys(req.body).length > 0) {
      if (content.length == 0) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      }

      const post = await Post.findOne({ _id: postId }).exec(); // 해당 게시글 확인
      if (!post) {
        return res
          .status(404)
          .json({ message: "게시글 조회에 실패하였습니다." });
      } else {
        await Comment.create({ postId: postId, user, password, content });
        return res.status(201).json({ message: "댓글을 생성하였습니다." });
      }
    } else {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 포스트 한개만 가져오기
router.get("/:commentId", async (req, res) => {
  try {
    // find() -> 모든 데이터 가져오기
    const comment = await Comment.findById(req.params.commentId);
    res.json(comment);
  } catch (err) {
    res.json({ message: err });
  }
});

// 포스트 한개만 업데이트하기
router.patch("/:commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    console.log(req.params);
    const { password, content } = req.body;

    if (Object.keys(req.body).length > 0) {
      if (content.length == 0) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      }

      const comment = await Comment.findOne({ postid: _commentId }).exec();
      if (!comment) {
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      } else {
        if (password !== comment.password) {
          // 비밀번호 체크
          return res
            .status(401)
            .json({ message: "댓글 수정 권한이 없습니다." });
        } else {
          await Comment.updateOne(
            { postid: _commentId },
            { $set: { content: content } }
          );
          return res.status(200).json({ message: "댓글을 수정하였습니다." });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 포스트 한개 삭제하기
router.delete("/:commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    console.log(req.params);
    const { password } = req.body;

    if (Object.keys(req.body).length > 0) {
      const comment = await Comment.findOne({ postid: _commentId }).exec();
      if (!comment) {
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      } else {
        if (password !== comment.password) {
          // 비밀번호 체크
          return res
            .status(401)
            .json({ message: "댓글 삭제 권한이 없습니다." });
        } else {
          await Comment.deleteOne({ postid: _commentId });
          return res.status(200).json({ message: "댓글을 삭제하였습니다." });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
