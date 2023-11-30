import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { NAVIGATION } from "../../lib/constants";

export default function Navigation() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    console.log("Logged out");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-start">
        <div
          className={`dropdown ${
            isLargeScreen || isDropdownVisible ? "dropdown-open" : ""
          }`}
        >
          <label
            tabIndex={0}
            className={` cursor-pointer btn-circle ${
              isLargeScreen ? "hidden" : "block"
            }`}
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>{" "}
          </label>
          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box  ${
              isLargeScreen || isDropdownVisible ? "visible" : "hidden"
            } ${isDropdownVisible && !isLargeScreen ? "bg-secondary " : ""}`}
          >
            {NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to={"/login"} onClick={() => handleLogout()}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search here"
          className="input w-full max-w-xs"
        />
      </div>
      <div className="navbar-end"></div>
    </div>
  );
}
