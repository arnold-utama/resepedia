const UserController = require('../Controllers/UserController');
const RecipeController = require('../Controllers/RecipeController');
const RegionController = require('../Controllers/RegionController');
const { authenticate } = require('../middlewares/auth');
const guardOwner = require('../middlewares/guardOwner');
const router = require('express').Router();

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/recipes", RecipeController.getAll);
router.get("/recipes/:id", RecipeController.getById);
router.get("/regions", RegionController.getAll);

router.use(authenticate);
router.post("/recipes", RecipeController.create);
router.put("/recipes/:id", guardOwner, RecipeController.update);
router.delete("/recipes/:id", guardOwner, RecipeController.delete);

module.exports = router;