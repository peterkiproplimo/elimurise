import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthData, authService } from "../services/authService";
import * as ApiService from "../services/auth";
import { useNavigate } from "react-router-dom";
// type AuthData = {
//   user?: {
//     role?: {
//       permissions?: Record<string, any>;
//     };
//   };k
// };

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(data: any): Promise<void>;
  signOut(): void;
  permissions: Record<string, string[]>; // Add permissions to the context
  hasPermission(module: string, action: string): boolean; // Method to check permissions
};

//Create the Auth Context with the data type specified
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type ContainerProps = {
  children: React.ReactNode;
};

const AuthProvider = (props: ContainerProps) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const authDataSerialized = await localStorage.getItem("@AuthData");
      if (authDataSerialized) {
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (data: any) => {
    const _authData = await authService.signIn(data);
    setAuthData(_authData);
    localStorage.setItem("@AuthData", JSON.stringify(_authData));
  };

  const signOut = async () => {
    setAuthData(undefined);
    await localStorage.removeItem("@AuthData");
  };

  // Permissions logic
  const permissions: Record<string, any> =
    authData?.user?.role?.permissions || {};

  const hasPermission = (module: string, action: string): boolean => {
    if (!permissions[module]) return false;
    return permissions[module].includes(action);
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-blue opacity-75">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        signIn,
        signOut,
        permissions,
        hasPermission,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier context access
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth };
