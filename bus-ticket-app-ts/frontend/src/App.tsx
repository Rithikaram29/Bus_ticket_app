import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddBusPage from "./pages/AddBusPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/addbus" element={<AddBusPage/>}/>
      </Routes>
    </>
  );
}

export default App;
