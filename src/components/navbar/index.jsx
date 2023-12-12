import { Link } from "@tanstack/react-router";
import { NAVIGATION } from "../../lib/constants";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userCredits, setUserCredits] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    // Retrieve user details from local storage
    const storedUserName = localStorage.getItem("user_name");
    const storedUserCredits = localStorage.getItem("user_credits");
    const storedUserAvatar = localStorage.getItem("user_avatar");

    if (storedUserName && storedUserCredits && storedUserAvatar) {
      setUserName(storedUserName);
      setUserCredits(storedUserCredits);
      setUserAvatar(storedUserAvatar);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        {/* Logo on the left */}
        <div>
          <Link
            to="/"
            className="text-white text-lg lg:text-3xl font-extrabold tracking-tight"
          >
            Auction House
          </Link>
        </div>

        {/* User Info and Avatar in the middle if logged in */}
        {userName && (
          <div className="hidden lg:flex items-center">
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <span className="text-white text-lg">{userName}</span>
              <div className="text-white text-sm">Credits: {userCredits}</div>
            </div>
          </div>
        )}

        {/* Hamburger icon for small screens on the right */}
        <div className="lg:hidden ml-auto">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none text-transparent"
          >
            <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </div>
          </button>
        </div>

        {/* Navbar links for larger screens and centered for small screens */}
        <div
          className={`lg:flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 ${
            isOpen ? "flex flex-col items-center" : "hidden"
          } justify-center mt-4 lg:mt-0`}
        >
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-white hover:text-blue-300 transition duration-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
