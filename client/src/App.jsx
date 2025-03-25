import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import PublicLayout from "./layouts/PublicLayout";
import MyRecipesPage from "./components/MyRecipesPage";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/my-recipes" element={<AuthLayout />}>
          <Route index element={<MyRecipesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
