import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../helpers/http-client";

export default function FormPage() {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);

  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    ingredients: Array(20).fill(""),
    measurements: Array(20).fill(""),
    instructions: "",
    RegionId: "",
    file: null,
  });

  useEffect(() => {
    if (id) {
      async function fetchRecipe() {
        try {
          const { data } = await api.get(`/recipes/${id}`);
          setFormData({
            name: data.name,
            ingredients: Array.from(
              { length: 20 },
              (_, i) => data[`ingredient${i + 1}`] || ""
            ),
            measurements: Array.from(
              { length: 20 },
              (_, i) => data[`measurement${i + 1}`] || ""
            ),
            instructions: data.instructions,
            RegionId: data.RegionId,
          });
        } catch (error) {
          console.log("🚀 ~ fetchRecipe ~ error:", error);
        }
      }
      fetchRecipe();
    }
  }, [id]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("ingredient") || name.startsWith("measurement")) {
      const index = parseInt(name.match(/\d+/)[0]) - 1;
      const key = name.startsWith("ingredient")
        ? "ingredients"
        : "measurements";
      const updatedArray = [...formData[key]];
      updatedArray[index] = value;
      setFormData({ ...formData, [key]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("instructions", formData.instructions);
      formDataToSend.append("RegionId", formData.RegionId);
      if (formData.file) {
        window.Swal.fire({
          title: "Please wait...",
          text: "Processing your request",
          allowOutsideClick: false,
          didOpen: () => {
            window.Swal.showLoading();
          },
        });
        formDataToSend.append("file", formData.file);
      }
      formData.ingredients.forEach((ingredient, index) => {
        formDataToSend.append(`ingredient${index + 1}`, ingredient);
      });
      formData.measurements.forEach((measurement, index) => {
        formDataToSend.append(`measurement${index + 1}`, measurement);
      });

      let response = null;
      if (id) {
        response = await api.put(`/recipes/${id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post(`/recipes`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      window.Swal.fire({
        title: "Success!",
        text: `Recipe "${response.data.name}" ${id ? "updated" : "created"}!`,
        icon: "success",
      });
      return navigate("/my-recipes");
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      if (error.response?.data?.message) {
        window.Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.message}`,
        });
      }
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">{id ? "Update Recipe" : "Add Recipe"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="row">
          {Array.from({ length: 20 }).map((_, index) => (
            <div className="row mb-3" key={index}>
              <div className="col-md-6">
                <label
                  htmlFor={`measurement${index + 1}`}
                  className="form-label"
                >
                  Measurement {index + 1}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`measurement${index + 1}`}
                  name={`measurement${index + 1}`}
                  value={formData.measurements[index]}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor={`ingredient${index + 1}`}
                  className="form-label"
                >
                  Ingredient {index + 1}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`ingredient${index + 1}`}
                  name={`ingredient${index + 1}`}
                  value={formData.ingredients[index]}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label htmlFor="instructions" className="form-label">
            Instructions
          </label>
          <textarea
            className="form-control"
            id="instructions"
            name="instructions"
            rows="10"
            value={formData.instructions}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="RegionId" className="form-label">
            Region
          </label>
          <select
            className="form-select"
            id="RegionId"
            name="RegionId"
            value={formData.RegionId}
            onChange={handleInputChange}
          >
            {id || (
              <option value="" disabled>
                ---SELECT---
              </option>
            )}
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
