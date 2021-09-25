import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Simple check to see if a user is authenticated
// Component's children only shown to logged-in users

export default function AuthCheck(props) {
  const { username } = useContext(UserContext);  // Grab the username if the user is logged in

  // Return the children of component if authenticated, otherwise route to some fallback or a default behaviour
  return username
    ? props.children
    : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
