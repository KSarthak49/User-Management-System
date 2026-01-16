import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, SetUser] = useState(null);

  // 1. Check if user is already logged in 
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      SetUser(JSON.parse(storedUser));
    }
  }, []);

  // 2.a Signup Logic (NEW)
  const signup = (email, password) => {
    // Get existing registered users or empty array
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    
    // b.Check if email already exists
    if (existingUsers.find((u) => u.email === email)) {
      return { success: false, message: "Email already exists!" };
    }

    // c.Save new user
    const newUser = { email, password };
    existingUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
  
    return { success: true, message: "Account created! Please login." };
  };

  // 3. Login Logic (UPDATED)
  const login = (email, password) => {
    // a.Special Admin Backdoor 
    if (email === "admin@demo.com" && password === "123456") {
      const userData = { email, token: "admin-token" };
      SetUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      return { success: true };
    }

    // b.Check against registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const validUser = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (validUser) {
      const userData = { email, token: "user-token-" + Date.now() };
      SetUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    SetUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);