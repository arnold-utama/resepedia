export default function RecipeRow({ recipe, index, isEditable }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{recipe.name}</td>
      <td>{recipe.Region.name}</td>
      <td className="text-end">
        <button className="btn btn-sm btn-primary">View</button>
        {isEditable && (
          <>
            <button className="btn btn-sm btn-warning mx-2">Edit</button>
            <button className="btn btn-sm btn-danger">Delete</button>
          </>
        )}
      </td>
    </tr>
  );
}