const express = require("express");
const usersRouter = express.Router();
const passport = require("passport");
const User = require("../models/users.model");
const sendMail = require("../mail/mail");
usersRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log("no user");
      return res.json({ msg: info });
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      res.redirect("/");
    });
  })(req, res, next);
});

usersRouter.post("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

usersRouter.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    //email sending
    sendMail("wolframs@naver.com", "Kim do hyun", "welcome");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
});

usersRouter.get("/google", passport.authenticate("google"));

usersRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);

usersRouter.get("/kakao", passport.authenticate("kakao"));
usersRouter.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);
module.exports = usersRouter;
