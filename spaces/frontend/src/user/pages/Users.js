import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: 1,
      name: "John Doe",
      image: "https://source.unsplash.com/250x250/?nature",
      places: 12,
    },
    {
      id: 2,
      name: "John Smith",
      image: "https://source.unsplash.com/250x250/?books",
      places: 10,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
