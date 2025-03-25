import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import PublicLayout from "./layouts/PublicLayout";
import MyRecipesPage from "./components/MyRecipesPage";
import AuthLayout from "./layouts/AuthLayout";
import DetailPage from "./components/DetailPage";
import FormPage from "./components/FormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/recipes/:id" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/my-recipes" element={<MyRecipesPage />} />
          <Route path="/recipes/add" element={<FormPage />} />
          <Route path="/recipes/:id/edit" element={<FormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
