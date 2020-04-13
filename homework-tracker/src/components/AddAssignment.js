import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "./authentication/firebase";

export default function AddAssignment() {
  const [errorMessage, setErrorMesage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const createAssignment = async (event) => {
    event.preventDefault();
    const { title, description, date } = event.target.elements;

    // Validation
    if (title.value === "" || date.value === "") {
      setErrorMesage("Error: Please fill all required fields");
    } else {
      setErrorMesage("");

      // POST request
      let JWTtoken = await (
        await firebase.auth().currentUser.getIdTokenResult()
      ).token;
      if (JWTtoken !== null) {
        const result = await fetch(API_URL + "assignments", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${JWTtoken}`,
          },
          body: JSON.stringify({
            title: title.value,
            description: description.value,
            date: date.value,
          }),
        });
        if (result.status === 201) {
          window.location.href = "/";
        } else {
          alert("ERROR: Something went wrong. Please try again");
        }
      }
    }
    document.getElementById("add-assignment-form").reset();
  };

  const clearForm = (event) => {
    event.preventDefault();
    document.getElementById("add-assignment-form").reset();
    setErrorMesage("");
  };
  useEffect(() => {}, [errorMessage]);

  return (
    <div>
      <div className="header">
        <div className="brand">
          <Link to="/">
            <img alt="Logo" src={Logo} />
          </Link>
          <h1>Add Assignment</h1>
        </div>
      </div>
      <div className="Card">
        <form
          onSubmit={createAssignment}
          id="add-assignment-form"
          className="addAssignmentForm"
        >
          <p style={{ color: "red", fontSize: 12 }}>{errorMessage}</p>
          <input name="title" type="text" placeholder="Title" />
          <input
            name="description"
            type="text"
            placeholder="Description (optional)"
          />
          <div className="dueDate">
            <input name="date" type="date" placeholder="Due Date" />
            <FontAwesomeIcon className="calendar" icon={faCalendar} />
          </div>
          <div className="buttons">
            <button className="cancel" onClick={clearForm}>
              Cancel
            </button>
            <button className="submit" variant="" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
