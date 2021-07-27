const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const passport = require("passport");

router.get("/check-routes", (req, res) => {
  res.send("Routes working");
});
router.post(
  "/login",
  passport.authenticate("local", {
    // successRedirect: '/',
    // failureRedirect: '/login',
    failureFlash: "Invalid username or password",
  }),
  AuthController.login
);

router.post("/register", AuthController.register);

router.delete("/logout", AuthController.logOut);

router.post("/token", AuthController.generateNewAccessToken);

module.exports = router;
