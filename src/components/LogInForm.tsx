// @ts-nocheck
import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

function LogInForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: ""
  });
  const [error, setError] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("https://chathub-backend-v3lv.onrender.com/users/login", {
        method: "POST",
        headers : { "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { token, user } = await response.json();

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      window.location.href = "/";
    } catch (error) {
      setError("Username and password does not exist");
    }
  };

  async function loginDummyAccount() {
    try {
      const response = await fetch("https://chathub-backend-v3lv.onrender.com/users/login", {
        method: "POST",
        headers : { "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "dummyaccount",
          password: "password123"
        })
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { token, user } = await response.json();

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      window.location.href = "/";
    } catch (error) {
      setError("Username and password does not exist");
    }
  }

  return (
    <div className="phone:max-w-80 shadow-xl rounded-lg text-white flex phone:flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center p-8 gap-4">
        <h1 className="text-3xl font-bold text-center mb-2">Log In</h1>
        <div className="flex flex-col">
          <label htmlFor="username" className="font-bold">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-80 phone:w-72 bg-neutral-600 border border-solid rounded border-neutral-700 h-8 p-2 outline outline-offset-0 outline-none focus:outline-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="font-bold">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-80 phone:w-72 bg-neutral-600 border border-solid rounded border-neutral-700 h-8 p-2 outline outline-offset-0 outline-none focus:outline-indigo-500"
          />
        </div>
        {(formData.username && formData.password) ?
          (<button type="submit" className="bg-indigo-500 w-full font-bold text-white p-2 rounded">Log In</button>) :
          (<button className="bg-indigo-400 w-full font-bold text-white p-2 rounded hover:cursor-default">Log In</button>)
        }
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-center text-gray-300">Don't have an account?</h3>
          <Link to="/signup" className="w-fit font-bold text-center text-indigo-400 hover:text-indigo-500">Sign Up</Link>
          <p onClick={loginDummyAccount} className="text-xs text-neutral-400 hover:text-white hover:cursor-pointer">or use a dummy account</p>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
      </form>
      <div className="w-0.5 h-72 bg-black opacity-15 phone:w-72 phone:h-0.5">
      </div>
      <div className="flex flex-col p-10 rounded-tr-lg rounded-br-lg items-center justify-center max-w-64 group">
        <h1 className="text-7xl font-bold text-indigo-300 group-hover:text-indigo-400 transition-colors duration-100 hover:cursor-default phone:text-indigo-400">CHAT</h1>
        <h1 className="text-7xl font-bold text-indigo-300 mb-4 group-hover:text-indigo-400 transition-colors duration-150 hover:cursor-default phone:text-indigo-400">HUB</h1>
        <p className="text-center hover:cursor-default">Chat Hub is a messaging app connecting you effortlessly with friends and other users.</p>
      </div>
    </div>
  )
}

export default LogInForm;
