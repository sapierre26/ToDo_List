import React from "react";
import ReactDOM from "react-dom";

// React Router Imports 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//----------login imports----------//
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";

//-------todo-list imports--------//
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import TodoList from "./components/todoList"; // <-- Import TodoList

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<App />} /> {/* Login page */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forget-password" element={<ForgotPasswordPage />} />
          
          {/* Homepage Routes */}
          <Route path="/home" element={<Dashboard />} /> {/* Homepage - todo, calendar */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Add the Todo List Route */}
          <Route path="/todo-list" element={<TodoList />} /> 
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  rootElement
);

reportWebVitals();
