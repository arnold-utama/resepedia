import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import RecipeRow from "./RecipeRow";
import InfiniteScroll from "react-infinite-scroll-component";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [pagination, setPagination] = useState({
    totalData: 0,
    totalPages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const { data } = await api.get(`/recipes`, {
          params: {
            q: search,
            regionId: selectedRegion,
            page: pagination.currentPage,
          },
        });
        if (pagination.currentPage === 1) {
          setRecipes(data.recipes);
        } else {
          setRecipes((prev) => [...prev, ...data.recipes]);
        }
        setPagination((prev) => ({
          ...prev,
          totalData: data.totalData,
          totalPages: data.totalPages,
        }));
      } catch (error) {
        console.log("🚀 ~ fetchRecipes ~ error:", error);
      }
    }
    fetchRecipes();
  }, [search, selectedRegion, pagination.currentPage]);

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
        <h1>Recipe List</h1>
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination({ totalData: 0, totalPages: 0, currentPage: 1 });
              }}
            />
          </div>
          <div className="col-3">
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setPagination({ totalData: 0, totalPages: 0, currentPage: 1 });
              }}
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
        <InfiniteScroll
          dataLength={recipes.length}
          scrollThreshold={1}
          next={() => {
            setTimeout(() => {
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
              }));
            }, 500);
          }}
          hasMore={pagination.currentPage < pagination.totalPages}
          loader={
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "3rem" }} // Adjust height as needed
            >
              <div
                className="spinner-border"
                role="status"
                style={{ height: "1.5rem", width: "1.5rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
          endMessage={
            <p className="text-center">
              <b>{recipes.length ? "" : "No data"}</b>
            </p>
          }
        >
          <table className="table table-striped mb-2">
            <thead>
              <tr>
                <th className="col-1">#</th>
                <th className="col-auto">Name</th>
                <th className="col-1">Region</th>
                <th className="col-3"></th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe, index) => (
                <RecipeRow key={recipe.id} recipe={recipe} index={index} />
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
