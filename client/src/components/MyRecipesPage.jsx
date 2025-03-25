import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import RecipeRow from "./RecipeRow";
import { Link } from "react-router";

export default function MyRecipesPage() {
  const access_token = localStorage.getItem("access_token");
  const [myRecipes, setMyRecipes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const isEditable = true;

  useEffect(() => {
    async function fetchMyRecipes() {
      try {
        const { data } = await api.get(`/my-recipes`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            q: search,
            regionId: selectedRegion,
          },
        });
        setMyRecipes(data.recipes);
      } catch (error) {
        console.log("🚀 ~ fetchMyRecipes ~ error:", error);
      }
    }
    fetchMyRecipes();
  }, [search, selectedRegion]);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const { data } = await api.get("/regions");
        setRegions(data);
      } catch (error) {
        console.log("🚀 ~ fetchRegions ~ error:", error);
      }
    }
    fetchRegions();
  }, []);

  return (
    <div className="py-4 flex-grow-1">
      <div className="text-center">
        <h1>My Recipes</h1>
      </div>
      <div className="container mt-4">
        <div className="row g-3 mb-4">
          <div className="col-9">
            <input
              className="form-control"
              type="search"
              placeholder="Search menu"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-3">
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <Link to="/add-recipe" className="btn btn-primary">
            Add Recipe
          </Link>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="col-1">#</th>
              <th className="col-auto">Name</th>
              <th className="col-1">Region</th>
              <th className="col-3"></th>
            </tr>
          </thead>
          <tbody>
            {myRecipes.map((recipe, index) => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                index={index}
                isEditable={isEditable}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
