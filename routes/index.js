var express = require("express");
var router = express.Router();
const createrModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(new localStrategy(createrModel.authenticate()));

router.get("/home", isLoggedIn, function (req, res, next) {
  res.json({ message: "Your Posts" });
});
router.post("/create", function (req, res, next) {
  createrModel.findOne({ username: req.session.passport.user})
  .then((loginuser) => {
    postModel
      .create({
        post: req.body.post,
        image: req.body.image,
        tags: req.body.tags,
        desc: req.body.desc,
        userid: loginuser._id,
      })
      .then((post) => {
        loginuser.mypost.push(post._id);
        loginuser.save()
        .then((users) => {
          res.json({ message: "Post Created" });
          console.log(users)
        });
       
      })
      .catch((err) => {
        res.json({ message: err.message });
      });
  });
});

router.post("/register", function (req, res) {
  const newUser = new createrModel({
    user: req.body.user,
    username: req.body.username,
  });
  createrModel
    .register(newUser, req.body.password)
    .then(function (createdUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/home");
      });
    })
    .catch(function (err) {
      res.json({ message: err.message });
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.json({ message: "you are not logged in" });
  }
}

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  }),
  function (req, res, next) {}
);

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.json({ message: "you are logged out" });
});
module.exports = router;
