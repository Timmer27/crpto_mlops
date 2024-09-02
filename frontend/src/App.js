import "./App.css";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Backtest from "./pages/Backtest";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/login"} exact element={<Login />} />
        {/* <Route exact path="/" element={<ProtectedRoute />}> */}
          <Route exact path="/" element={<Backtest />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
