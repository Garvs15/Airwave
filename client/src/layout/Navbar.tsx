import { UserCircleIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import { logout } from "../redux/user/userSlice";
import gsap from "gsap";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [token, setToken] = useState<string>("");
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const handleNavigation = () => {
    token ? navigate("/history") : navigate("/auth");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsProfileOpen(false);
    dispatch(logout());
    window.location.reload();
  };

  const animateNavbar = () => {
    gsap.fromTo(
      itemsRef.current,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "ease.in",
        stagger: 0.2,
      }
    );
  };

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    setToken(tokenFromCookie || "");
    animateNavbar();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="nav flex justify-between items-center bg-white px-4 md:px-8 h-[75px] border-b"
    >
      <div
        className="text-black font-bold text-xl md:text-2xl ml-4 cursor-pointer"
        onClick={() => navigate("/home")}
        ref={(el) => (itemsRef.current[0] = el!)}
      >
        Airwave
      </div>
      <div className="flex gap-4 items-center">
        <div
          className="flex items-center space-x-4 text-blue mr-4 cursor-pointer"
          onClick={handleNavigation}
          ref={(el) => (itemsRef.current[1] = el!)}
        >
          {token ? "History" : "Login/SignUp"}
        </div>

        {token && (
          <div
            className="relative"
            ref={(el) => (itemsRef.current[2] = el!)}
          >
            <UserCircleIcon
              className="h-6 w-6 hover:text-gray-600 cursor-pointer"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            />
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
                <ul>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
