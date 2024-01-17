import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthData, authService } from "../services/authService";
import * as ApiService from "../services/auth";

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(data: any): Promise<void>;
  signOut(): void;
};

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);
type ContainerProps = {
  children: React.ReactNode; //👈 children prop typr
};
const AuthProvider = (props: ContainerProps) => {
  //👈 prop definition
  const [authData, setAuthData] = useState<AuthData>();

  //the AuthContext start with loading equals true
  //and stay like this, until the data be load from Async Storage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorage function.
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      //Try get the data from Async Storage
      const authDataSerialized = await localStorage.getItem("@AuthData");
      if (authDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      //loading finished
      setLoading(false);
    }
  }

  const signIn = async (data: any) => {
    //call the service passing credential (email and password).
    //In a real App this data will be provided by the user from some InputText components.
    const _authData = await authService.signIn(data);

    //Set the data in the context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(_authData);

    //Persist the data in the Async Storage
    //to be recovered in the next user session.
    localStorage.setItem("@AuthData", JSON.stringify(_authData));
  };

  const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(undefined);

    //Remove the data from Async Storage
    //to NOT be recoverede in next session.

    await localStorage.removeItem("@AuthData");
  };
  if (loading) {
    // You may want to render a loading spinner or some indicator here
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-blue opacity-75">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }
  <AuthContext.Provider
    value={{ authData, loading, signIn, signOut }}
  ></AuthContext.Provider>;
  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth };
