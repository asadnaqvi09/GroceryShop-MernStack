import React from 'react'
import MainRoutes from './routes/MainRoutes'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <MainRoutes />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}

export default App

