import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../helpers/http-client";

const initialState = {
  list: {
    data: [],
    totalData: 0,
    totalPages: 0,
    currentPage: 1,
  },
  detail: {},
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        const { recipes, totalData, totalPages, currentPage } = action.payload;
        if (currentPage === 1) {
          state.list.data = recipes;
        } else {
          state.list.data = [...state.list.data, ...recipes];
        }
        state.list.totalData = totalData;
        state.list.totalPages = totalPages;
        state.list.currentPage = currentPage;
      })
      .addCase(fetchRecipes.pending, () => {
        console.log("Fetching recipes...");
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        console.log("Failed to fetch recipes", action.error);
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.detail = action.payload;
      })
      .addCase(fetchRecipeById.pending, () => {
        console.log("Fetching recipe...");
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        console.log("Failed to fetch recipe", action.error);
      });
  },
});

export const fetchRecipes = createAsyncThunk(
  "recipe/fetchRecipes",
  async ({ search, selectedRegion, currentPage }) => {    
    const { data } = await api.get("/recipes", {
      params: {
        q: search,
        regionId: selectedRegion,
        page: currentPage,
      },
    });    
    return data;
  }
);

export const fetchRecipeById = createAsyncThunk(
  "recipe/fetchRecipeById",
  async (id) => {
    const { data } = await api.get(`/recipes/${id}`);
    return data;
  }
);

export default recipeSlice.reducer;
