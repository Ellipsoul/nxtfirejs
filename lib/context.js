import { createContext } from "react";

// Creating the context that will hold the user and username here, initialised to null
export const UserContext = createContext({user: null, username: null});
