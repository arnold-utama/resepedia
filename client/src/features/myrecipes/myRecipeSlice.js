import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../helpers/http-client";

const access_token = localStorage.getItem("access_token");
const initialState = {
  list: {
    data: [],
    totalData: 0,
    totalPages: 0,
    currentPage: 1,
  },
};

const myRecipeSlice = createSlice({
  name: "myrecipe",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
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
      .addCase(fetchMyRecipes.pending, () => {
        console.log("Fetching recipes...");
      })
      .addCase(fetchMyRecipes.rejected, (state, action) => {
        console.log("Failed to fetch recipes", action.error);
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.list.data = state.list.data.filter(
          (recipe) => recipe.id !== action.meta.arg
        );
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        console.log("Failed to delete recipe", action.error);
      });
  },
});

export const fetchMyRecipes = createAsyncThunk(
  "myrecipe/fetchMyRecipes",
  async ({ search, selectedRegion, currentPage }) => {
    const { data } = await api.get("/my-recipes", {
      params: {
        q: search,
        regionId: selectedRegion,
        page: currentPage,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });    
    return data;
  }
);

export const deleteRecipe = createAsyncThunk(
  "myrecipe/deleteRecipe",
  async (id) => {
    await api.delete(`/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return id;
  }
);

export default myRecipeSlice.reducer;
