import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "John Doe",
      image: "https://source.unsplash.com/250x250/?nature",
      places: 12,
    },
    {
      id: "u2",
      name: "John Smith",
      image: "https://source.unsplash.com/250x250/?books",
      places: 10,
    },
    {
      id: "u3",
      name: "Jack Shun",
      image: "https://source.unsplash.com/250x250/?cars",
      places: 5,
    },
    {
      id: "u4",
      name: "Jack Doup",
      image: "https://source.unsplash.com/250x250/?places",
      places: 7,
    },
    {
      id: "u5",
      name: "Ken Tucky",
      image: "https://source.unsplash.com/250x250/?animals",
      places: 3,
    },
    {
      id: "u6",
      name: "Ken Oaky",
      image: "https://source.unsplash.com/250x250/?tech",
      places: 9,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
