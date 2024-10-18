import { useRef, useState } from "react";
import "./register.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";

const Register = ({ setShowRegister, setShowLogin, currentUser }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
      setShowLogin(true);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <FaMapMarkerAlt size={30} />
        NYPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="register">Register</button>
      </form>
      {success && (
        <span className="success">Successful. You can login now!</span>
      )}
      {error && <span className="failure ">Something went wrong!</span>}
      <MdOutlineCancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
