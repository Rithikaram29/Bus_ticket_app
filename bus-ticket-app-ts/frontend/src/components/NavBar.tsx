import React, { useEffect, useState } from "react";
import BusticketLogo from "../assets/BusticketLogo.png";
import "./style/navbar.css";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  const handleAccountClick = () => {
    setOpen(!isOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // console.log(localStorage.getItem("authToken"))
        const res = await axios.get("http://localhost:4000/user/account", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if necessary
          },
        });

        let data = res.data[0];

        const currentUser = {
          name: data.userName,
          role: data.role,
        };
        setUser(currentUser); 
        // console.log(res.data);
      } catch (error: any) {
        console.log("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
    <nav className="navbar">
      <div className="navbar-left">
        <img src={BusticketLogo} alt="logo" className="logo" />
        {user && user.role === "admin" && <button>Admin Panel</button>}
        
      </div>
      <div className="navbar-right">
        <button onClick={handleAccountClick} className="account-button">
          <FontAwesomeIcon icon={faUser} />
          {user ? ` ${user.name}` : " Account"}
        </button>
        </div>

    </nav>
    {isOpen && (
          <ul className="dropdown-menu space-y-6">
            {user ? (
              <>
                <li>
                  <button onClick={()=>navigate("/")}>Profile</button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken"); // Clear token on logout
                      setUser(null);
                      navigate("/");
                      window.location.reload()
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => navigate('/login')}>
                  Login
                </button>
              </li>
            )}
          </ul>
        )}
    </>
  );
};

export default NavBar;