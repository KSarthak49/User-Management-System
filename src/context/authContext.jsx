import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // SIGNUP Default new users to 'User' role
    const signup = (email, password, role = 'User') => {
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    
    if (existingUsers.find((u) => u.email === email)) {
      return { success: false, message: "Email already exists!" };
    }

    const newUser = { email, password, role }; 
    existingUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
    
    return { success: true, message: "Account created! Please login." };
  };

  // --- LOGIN With Role Logic 
  const login = (email, password) => {
    
    // 1. HARDCODED ROLES FOR TESTING
    if (email === "admin@test.com" && password === "123456") {
      const userData = { email, role: 'Admin', token: "admin-token" };
      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      return { success: true };
    }
    
    if (email === "manager@test.com" && password === "123456") {
      const userData = { email, role: 'Manager', token: "manager-token" };
      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      return { success: true };
    }

    if (email === "user@test.com" && password === "123456") {
      const userData = { email, role: 'User', token: "user-token" };
      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      return { success: true };
    }

    // 2. Check registered users from Signup
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const validUser = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (validUser) {
      const userData = { email, role: validUser.role || 'User', token: "jwt-token" };
      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);