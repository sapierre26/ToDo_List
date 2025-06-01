import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./createAccount.module.css";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    form: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      form: "",
    };

    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "This field is required.";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "This field is required.";
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "This field is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "This field is required.";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "This field is required.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      form: "",
    });

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          username: formData.username,
          pwd: formData.password,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage(data.message || "Account created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.accountcontainer}>
      <h3>Create an account</h3>
      {errors.form && <p className={styles.errorMessage}>{errors.form}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{errors.firstName}</p>
        </div>

        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{errors.lastName}</p>
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{errors.username}</p>
        </div>

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{errors.email}</p>
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{errors.password}</p>
        </div>

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
        <div className={styles.linkContainer}>
          <Link to="/login" className={styles.link}>
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
