const express = require("express");
const auth = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(auth.login);
router.route("/logout").post(auth.logout);

module.exports = router;
