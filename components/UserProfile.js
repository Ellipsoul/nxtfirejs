import React from "react";
import Image from "next/image";

// Header for the user profile page, with photo, username and display name
export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <div className="google-image">
        <Image
          src={user ? user.photoURL : "/hacker.png"}
          className="card-img-center"
          alt="Profile Picture Missing"
          layout='fill'
        />
      </div>

      <p>
        <i>@{user ? user.username : "Anon"}</i>
      </p>

      <h1>{user ? user.displayName : "Anonymous User"}</h1>
    </div>
  );
}
