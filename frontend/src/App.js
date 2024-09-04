import "./App.css";
import Login from "./components/pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Backtest from "./components/pages/Backtest";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OHLCChart from "./components/OHLCChart";
import Home from "./components/Home";
import Header from "./components/Header";
import ChartsView from "./components/charts/ChartsView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/login"} exact element={<Login />} />
        {/* <Route exact path="/" element={<ProtectedRoute />}> */}
          <Route exact path="/" element={<Backtest />} />
          <Route exact path="/test" element={<ChartsView />} />
          <Route exact path="/test2" element={<Header />} />
          <Route exact path="/chart" element={<OHLCChart />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
