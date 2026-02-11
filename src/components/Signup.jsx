import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";


import bgImage from '../assets/background.jpg';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const result = signup(email, password);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate("/login"), 1500); 
    } else {
      setError(result.message);
    }
  };

  return (
    <div  className="login-container" 
          style={{ 
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }
        }
        >
      <div className="login-card">
        <h2>Create Account</h2>
        <p>Sign up to get started</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message" style={{
            color: '#166534', 
            background: '#dcfce7', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            textAlign: 'center', 
            marginBottom: '1rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary full-width">Sign Up</button>
        </form>

        <div className="auth-link">
  Already have an account? <Link to="/login">Login here</Link>
</div>
      </div>
    </div>
  );
};

export default Signup;