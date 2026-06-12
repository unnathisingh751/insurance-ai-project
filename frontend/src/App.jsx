import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import History from "./pages/History";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AIForm from "./pages/AIForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ModelEvaluation from "./pages/ModelEvaluation";

function App() {
  return (
    <BrowserRouter>

      <nav
  style={{
    background: "#0f172a",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  }}
>
  <h2
    style={{
      color: "white",
      margin: 0
    }}
  >
    🛡️ InsureVision
  </h2>

 <div>
  <Link
    to="/"
    style={{
      color: "white",
      marginRight: "20px",
      textDecoration: "none",
      fontWeight: "bold"
    }}
  >
    Home
  </Link>

  <Link
    to="/ai"
    style={{
      color: "white",
      marginRight: "20px",
      textDecoration: "none",
      fontWeight: "bold"
    }}
  >
    AI Predictor
  </Link>

  <Link
    to="/dashboard"
    style={{
      color: "white",
      marginRight: "20px",
      textDecoration: "none",
      fontWeight: "bold"
    }}
  >
    Dashboard
  </Link>

  <Link
    to="/model-evaluation"
    style={{
      color: "white",
      marginRight: "20px",
      textDecoration: "none",
      fontWeight: "bold"
    }}
  >
    Model Evaluation
  </Link>

  <Link
    to="/register"
    style={{
      color: "white",
      marginRight: "20px"
    }}
  >
    Register
  </Link>

  <Link
    to="/login"
    style={{
      color: "white"
    }}
  >
    Login
  </Link>
</div>
</nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AIForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
  path="/history"
  element={<History />}
/>
      <Route
  path="/login"
  element={<Login />}
/>
<Route
  path="/register"
  element={<Register />}
/>
<Route
  path="/model-evaluation"
  element={<ModelEvaluation />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;