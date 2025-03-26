import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import RecipeRow from "./RecipeRow";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router";

export default function MyRecipesPage() {
  const access_token = localStorage.getItem("access_token");
  const [myRecipes, setMyRecipes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [pagination, setPagination] = useState({
    totalData: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const isEditable = true;

  async function fetchMyRecipes() {
    try {
      const { data } = await api.get(`/my-recipes`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          q: search,
          regionId: selectedRegion,
          page: pagination.currentPage,
        },
      });
      if (pagination.currentPage === 1) {
        setMyRecipes(data.recipes);
      } else {
        setMyRecipes((prev) => [...prev, ...data.recipes]);
      }
      setPagination((prev) => ({
        ...prev,
        totalData: data.totalData,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.log("🚀 ~ fetchMyRecipes ~ error:", error);
    }
  }

  useEffect(() => {
    fetchMyRecipes();
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

  async function handleDelete(id) {
    window.Swal.fire({
      title: "Are you sure you want to delete this recipe?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/recipes/${id}`, {
            headers: { Authorization: `Bearer ${access_token}` },
          });
          window.Swal.fire({
            title: "Success!",
            text: `${response.data.message}`,
            icon: "success",
          });
          fetchMyRecipes();
        } catch (error) {
          console.log("🚀 ~ handleDelete ~ error:", error);
          if (error.response?.data?.message) {
            window.Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `${error.response.data.message}`,
            });
          }
        }
      }
    });
  }

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
        <div className="mb-4">
          <Link to="/recipes/add" className="btn btn-primary">
            Add Recipe
          </Link>
        </div>
        <InfiniteScroll
          dataLength={myRecipes.length}
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
              style={{ height: "3rem" }}
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
              <b>{myRecipes.length ? "" : "No data"}</b>
            </p>
          }
        >
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
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
