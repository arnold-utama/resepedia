import { Link } from "react-router";

export default function RecipeRow({ recipe, index, isEditable, handleDelete }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{recipe.name}</td>
      <td>{recipe.Region.name}</td>
      <td className="text-end">
        <Link to={`/recipes/${recipe.id}`} className="btn btn-sm btn-primary">
          View
        </Link>
        {isEditable && (
          <>
            <Link
              to={`/recipes/${recipe.id}/edit`}
              className="btn btn-sm btn-warning mx-2"
            >
              Edit
            </Link>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(recipe.id)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
