import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * LOAD USER
   */
  async function fetchUser() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      if (!response.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await response.json();

      setUser(data.user);
    } catch (error) {
      console.error("AUTH ERROR:", error);
      setUser(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * LOGOUT
   */
  async function logout() {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    setUser(null);

    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}