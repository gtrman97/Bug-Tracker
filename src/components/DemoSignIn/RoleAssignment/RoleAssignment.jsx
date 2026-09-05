import React from "react";
import styles from "./RoleAssignment.module.css";
import AssignmentCard from "./AssignmentCard";

const ManageRoles = () => {
  const users = [
    "trevor strnad",
    "brian eschbach",
    "shannon lucas",
    "ryan knight",
    "brandon ellis",
    "vinnie moore",
    "jose silva",
    "napoleon hill",
    "lawrence perry",
    "john mcDougall",
    "mark morton",
    "john michael",
    "jimmy jones",
    "jack allen",
    "nathan thunderstone",
    "marcus aurelius",
    "john smith",
    "brian holt",
    "shad helmstetter"
  ];

  const roles = ["admin", "project manager", "developer", "submitter"];

  const personnel = [
    {
      name: "trevor strnad",
      email: "trevor@strnad.com",
      role: "project manager",
    },
    {
      name: "brian eschbach",
      email: "brian@eschbach.com",
      role: "project manager",
    },
    {
      name: "shannon lucas",
      email: "shannon@lucas.com",
      role: "submitter",
    },
    {
      name: "ryan knight",
      email: "ryan@knight.com",
      role: "developer",
    },
    {
      name: "brandon ellis",
      email: "brandon@ellis.com",
      role: "project manager",
    },
    {
      name: "vinnie moore",
      email: "vinnie@moore.com",
      role: "submitter",
    },
    {
      name: "jose silva",
      email: "jose@silva.com",
      role: "project manager",
    },
    {
      name: "napoleon hill",
      email: "napoleon@hill.com",
      role: "project manager",
    },
    {
      name: "lawrence perry",
      email: "lawrence@perry.com",
      role: "submitter",
    },
    {
      name: "john mcDougall",
      email: "john@mcdougall.com",
      role: "developer",
    },
    {
      name: "mark morton",
      email: "mark@morton.com",
      role: "submitter",
    },
    {
      name: "john michael",
      email: "john@michael.com",
      role: "developer",
    },
    {
      name: "jimmy jones",
      email: "jimmy@jones.com",
      role: "developer",
    },
    {
      name: "jack allen",
      email: "jack@allen.com",
      role: "developer",
    },
    {
      name: "nathan thunderstone",
      email: "nathan@thunderstone.com",
      role: "developer",
    },
    {
      name: "marcus aurelius",
      email: "marcus@aurelius.com",
      role: "developer",
    },
    {
      name: "john smith",
      email: "john@smith.com",
      role: "developer",
    },
    {
      name: "brian holt",
      email: "brian@holt.com",
      role: "developer",
    },
    {
      name: "shad helmstetter",
      email: "shad@helmstetter.com",
      role: "developer",
    },
    {
      name: "richard gran",
      email: "richard@gran.com",
      role: "project manager",
    },
    {
      name: "moby eric",
      email: "moby@eric.com",
      role: "submitter",
    }
  ];

  const personMap = {};
  for (let person of personnel) {
    personMap[person.name] = person.role;
  }

  const getPersonMap = () => {
    return personMap;
  }

  const selectedUsers = [];
  const toggleUser = (user) => {
    user = user.toLowerCase();
    if (!selectedUsers.includes(user)) {
      selectedUsers.push(user);
    } else {
      selectedUsers.splice(selectedUsers.indexOf(user), 1);
    }
    console.log(selectedUsers);
  };
  const getUsers = () => {
    return selectedUsers;
  }
  let selectedRole;
  const toggleRole = (role) => {
    if (role === null) console.log("you have not chosen a role");
    else {
      selectedRole = role;
      console.log(`you have chosen role ${role}`);
    }
  };
  const getRole = () => {
    return selectedRole;
  }

  const setRole = () => {
    console.log(`selectedUsers is ${selectedUsers} and selectedRole is ${selectedRole}`);
    if (selectedRole) {
      // console.log(`receiving users: ${selectedUsers}`);
      for (let user of selectedUsers) {
        console.log(`user is ${user}`);
        personMap[user] = selectedRole;
        for (let person of personnel) {
          if (person.name === user) {
            person.role = selectedRole;
            console.log(`changed ${selectedUsers} to ${selectedRole}`);
          }
        }
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.users}>
        <AssignmentCard
          rows={users}
          selection={"user"}
          color={"red"}
          title={"select 1 or more users"}
          toggleUser={toggleUser}
        />
      </div>
      <div className={styles.roles}>
        <AssignmentCard
          rows={roles}
          selection={"role"}
          color={"blue"}
          title={"select role to assign"}
          toggleRole={toggleRole}
        />
      </div>
      <div className={styles.personnel}>
        <AssignmentCard
          rows={personnel}
          getPersonMap={getPersonMap}
          selection={"person"}
          color={"green"}
          title={"your personnel"}
          getUsers={getUsers}
          getRole={getRole}
        />
      </div>
    </div>
  );
};

export default ManageRoles;
