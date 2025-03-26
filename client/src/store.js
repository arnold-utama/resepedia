import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./features/recipes/recipeSlice";
import regionReducer from "./features/regions/regionSlice";
import myRecipeReducer from "./features/myrecipes/myRecipeSlice";

const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    region: regionReducer,
    myRecipe: myRecipeReducer,
  },
});

export default store;
