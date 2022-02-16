var express = require('express');
var auth = require("../middleware/auth")
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render("index", {
    title: "Express"
  });
});



module.exports = router;
