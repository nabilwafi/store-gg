const {
  categoryValidation,
  categoryGuard,
} = require("../app/helpers/validation");
var express = require("express");
const categories = require("../app/controllers/CategoriesController");
var router = express.Router();
const { isNotLogin } = require("../app/middlewares/auth");

/* GET users listing. */
router.use(isNotLogin);
router.get("/", categories.index);
router.get("/create", categories.create);
router.post("/", categoryValidation, categoryGuard, categories.store);
router.get("/:id/edit", categories.edit);
router.put("/:id", categories.update);
router.delete("/:id", categories.delete);

module.exports = router;
