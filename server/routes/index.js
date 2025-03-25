const UserController = require("../Controllers/UserController");
const RecipeController = require("../Controllers/RecipeController");
const RegionController = require("../Controllers/RegionController");
const { authenticate } = require("../middlewares/auth");
const guardOwner = require("../middlewares/guardOwner");
const errorHandler = require("../middlewares/errorHandler");
const router = require("express").Router();

router.get("/", (req, res) => res.redirect("/recipes"));
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/recipes", RecipeController.getAll);
router.get("/recipes/:id", RecipeController.getById);
router.get("/recipes/:id/generate", RecipeController.generate);
router.get("/regions", RegionController.getAll);

router.use(authenticate);
router.post("/recipes", RecipeController.create);
router.put("/recipes/:id", guardOwner, RecipeController.update);
router.delete("/recipes/:id", guardOwner, RecipeController.delete);

router.use(errorHandler);

module.exports = router;
