import { RefObject, useRef } from "react";
import { BiCoffee, BsFillChatRightTextFill } from "../assets";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const userIdRef = useRef();
  const passwordRef = useRef();

  const { login, authError } = useAuth();

  const formFields = [
    {
      type: "userId",
      placeholder: "Enter your email or username",
      ref: userIdRef,
    },

    {
      type: "password",
      placeholder: "Enter your password",
      ref: passwordRef,
    },
  ];

  // handle user login
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const user = {
      userId: userIdRef.current.value,
      password: passwordRef.current.value,
    };

    // login hook
    await login(user);
  };

  return (
    <div className="login w-full h-screen dark:bg-backgroundDark3 flex items-center justify-center">
      <div className="l-wrapper w-[400px] flex items-center flex-col gap-5">
        <div className=" flex items-center gap-3">
          <div className="text-primary">
            <BsFillChatRightTextFill />
          </div>
          <h1 className="text-2xl font-bold dark:text-slate-200">ZenChat</h1>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h3 className="font-medium text-xl dark:text-slate-200">Sign In</h3>
          <p className="text-slate-400 dark:text-slate-300">
            Sign in your account
          </p>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className=" dark:bg-backgroundDark2 flex max-w-fit flex-col items-center  p-5 rounded-lg bg-slate-100 container-shadow "
        >
          {authError && <p className="text-red-500 text-center">{authError}</p>}
          {formFields.map((field, index) => (
            <input
              type={field.type}
              required
              placeholder={field.placeholder}
              ref={field.ref}
              className="dark:bg-backgroundDark1 dark:text-white w-full mb-2 p-2 rounded-lg focus:outline-none"
            />
          ))}
          <div className="w-full mt-2 ">
            <button
              type="submit"
              className="w-full p-2 rounded-lg hover:scale-105 transition-transform focus:outline-none text-white bg-primary"
            >
              Sign In
            </button>
          </div>
        </form>

        <div>
          <p className="text-center dark:text-slate-300">
            Don't have an account!{" "}
            <Link
              className="text-primary cursor-pointer hover:underline"
              to={"/register"}
            >
              Sign Up
            </Link>
            <br />
            Crafted with ☕ by Ankit Kumar
          </p>
        </div>
      </div>
    </div>
  );
}
