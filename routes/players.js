var express = require("express");
const players = require("../app/controllers/PlayersController");
var router = express.Router();

/* GET users listing. */
router.get("/landing-page", players.landingpage);
router.get("/:id/detail", players.detailPage);
router.get("/categories", players.getCategories);

module.exports = router;
