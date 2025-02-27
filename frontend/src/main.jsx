// srv/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import "./main.css";

// container 
const container = document.getElementById("root");

// root
const root = ReactDOMClient.createRoot(container);

// initial render
root.render(<MyApp />);
