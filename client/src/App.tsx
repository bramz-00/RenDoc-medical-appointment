import { Button } from "@mui/material"
import LoginPage from "./pages/LoginPage"
import { Route, Routes } from "react-router-dom"


function App() {

  return (

    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* <Route path="/about" element={<AboutPage />} /> */}
      {/* <Route path="/contact" element={<ContactPage />} /> */}
      {/* Add more routes as needed */}
    </Routes>
  )
}

export default App
