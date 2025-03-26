import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../helpers/http-client";

export default function DetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [alternatives, setAlternatives] = useState({});

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const { data } = await api.get(`/recipes/${id}`);
        setRecipe(data);
      } catch (error) {
        console.log("🚀 ~ fetchRecipe ~ error:", error);
      }
    }
    fetchRecipe();
  }, []);

  const generateAlternatives = async () => {
    try {
      window.Swal.fire({
        title: "Please wait...",
        text: "Processing your request",
        allowOutsideClick: false,
        didOpen: () => {
          window.Swal.showLoading();
        },
      });
      const { data } = await api.get(`/recipes/${id}/generate`);
      const formattedAlternatives = {};
      data.forEach((item) => {
        const [key, values] = Object.entries(item)[0];
        formattedAlternatives[key] = values;
      });
      setAlternatives(formattedAlternatives);
      window.Swal.close();
    } catch (error) {
      console.log("🚀 ~ generateAlternatives ~ error:", error);
      if (error.response?.data?.message) {
        window.Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message + ". Please try again.",
        });
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="text-center">
        <h1 className="mb-4">{recipe.name}</h1>
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="img-fluid rounded mb-4"
          style={{ width: "30%" }}
        />
      </div>
      <div className="mb-4">
        <h2 className="h4">Region</h2>
        <p className="text-muted">{recipe.Region?.name}</p>
      </div>
      <div className="mb-4">
        <h2 className="h4">Ingredients</h2>
        <button className="btn btn-outline-info mb-3" onClick={generateAlternatives}>
          Generate Alternatives
        </button>
        <table
          className="table table-bordered"
          style={{
            width: Object.keys(alternatives).length > 0 ? "100%" : "50%",
          }}
        >
          <thead>
            <tr>
              <th scope="col" style={{ whiteSpace: "nowrap" }}>
                Measurement
              </th>
              <th scope="col" style={{ whiteSpace: "nowrap" }}>
                Ingredient
              </th>
              {Object.keys(alternatives).length > 0 && (
                <th scope="col" style={{ width: "50%" }}>
                  Alternative Ingredients 
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {[...Array(20)].map((_, index) => {
              const ingredient = recipe[`ingredient${index + 1}`];
              const measurement = recipe[`measurement${index + 1}`];
              const alternative = alternatives[ingredient];
              if (ingredient && measurement) {
                return (
                  <tr key={index}>
                    <td style={{ whiteSpace: "nowrap" }}>{measurement}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{ingredient}</td>
                    {Object.keys(alternatives).length > 0 && (
                      <td>
                        {alternative ? (
                          <ul>
                            {alternative.map((alt, i) => (
                              <li key={i}>{alt}</li>
                            ))}
                          </ul>
                        ) : (
                          ""
                        )}
                      </td>
                    )}
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="h4">Instructions</h2>
        {recipe.instructions?.split("\n").map((sentence, index) => (
          <p key={index} className="text-justify">
            {sentence.trim()}
          </p>
        ))}
      </div>
    </div>
  );
}
