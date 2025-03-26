const UserController = require("../Controllers/UserController");
const RecipeController = require("../Controllers/RecipeController");
const RegionController = require("../Controllers/RegionController");
const { authenticate } = require("../middlewares/auth");
const guardOwner = require("../middlewares/guardOwner");
const errorHandler = require("../middlewares/errorHandler");
const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res) => res.redirect("/recipes"));
router.post("/login", UserController.login);
router.post('/auth/google', UserController.googleLogin);
router.post("/register", UserController.register);
router.get("/recipes", RecipeController.getAll);
router.get("/recipes/:id", RecipeController.getById);
router.get("/recipes/:id/generate", RecipeController.generate);
router.get("/regions", RegionController.getAll);

router.use(authenticate);
router.get("/my-recipes", RecipeController.getMyRecipes);
router.post("/recipes", upload.single("file"), RecipeController.create);
router.put("/recipes/:id", upload.single("file"), guardOwner, RecipeController.update);
router.delete("/recipes/:id", guardOwner, RecipeController.delete);

router.use(errorHandler);

module.exports = router;
