import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/test' element={<h1>Testing</h1>} />
    </Routes>
  );
}

export default App;
