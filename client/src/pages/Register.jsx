import { RefObject, useRef } from "react";
import { BiCoffee, BsFillChatRightTextFill } from "../assets";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();

  // use the AuthHook for registration funciton
  const { register, authError } = useAuth();

  const formFields = [
    {
      type: "email",
      placeholder: "Enter your email",
      ref: emailRef,
    },
    {
      type: "text",
      placeholder: "Enter your username",
      ref: usernameRef,
    },
    {
      type: "password",
      placeholder: "Enter your password",
      ref: passwordRef,
    },
  ];

  // handle the user registration
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: emailRef.current.value,
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    await register(user);
  };

  return (
    <div className="login w-full h-screen dark:bg-backgroundDark3 flex items-center justify-center">
      <div className="l-wrapper w-[400px] flex items-center flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <BsFillChatRightTextFill />
          </div>
          <h1 className="text-2xl font-bold dark:text-slate-200">ZenChat</h1>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h3 className="font-medium text-xl dark:text-slate-200">Sign Up</h3>
          <p className="text-slate-400 dark:text-slate-300">
            Welcome to zenchat, create an account
          </p>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex max-w-fit dark:bg-backgroundDark2 dark:text-white flex-col items-center  p-5 rounded-lg bg-slate-100 container-shadow "
        >
          {authError && <p className="text-red-500 text-center">{authError}</p>}
          {formFields.map((field, index) => (
            <input
              type={field.type}
              required
              placeholder={field.placeholder}
              ref={field.ref}
              className="w-full dark:bg-backgroundDark1 mb-2 p-2 rounded-lg focus:outline-none"
            />
          ))}
          <div className="w-full mt-2 ">
            <button
              type="submit"
              className="w-full p-2 rounded-lg hover:scale-105 transition-transform focus:outline-none text-white bg-primary"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div>
          <p className="text-center dark:text-slate-300">
            Have an account already ?{" "}
            <Link
              className="text-primary cursor-pointer hover:underline"
              to={"/login"}
            >
              Sign In
            </Link>
            <br />
            Crafted with ☕ by Ankit Kumar
          </p>
        </div>
      </div>
    </div>
  );
}
