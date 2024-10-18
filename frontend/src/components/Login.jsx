import { useRef, useState } from "react";
import "./login.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();

  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <FaMapMarkerAlt size={30} />
        NYPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />

        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="login">Login</button>
      </form>

      {error && <span className="failure ">Something went wrong!</span>}
      <MdOutlineCancel
        className="loginCancel"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
};

export default Login;
