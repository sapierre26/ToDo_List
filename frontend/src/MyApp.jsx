// src/MyApp.jsx
import React, { useState } from "react";
import Table from "./Table";

const characters = [
    {
        task: "Assignment 4",
        status: "incomplete"
    },
    {
        task: "walk the dog",
        status: "incomplete"
    }
]

function MyApp() {
    const [characters, setCharacters] = useState([])

    function removeOneCharacter(index) {
        const updated = characters.filter((charater, i) => {
            return i !== index;
        });
        setCharacters(updated);
    }
    return (
        <div>
            <h1> className="container" </h1>
            <Table 
            characterData = {characters}
                removeCharacter={removeOneCharacter}
                />
        </div>
    );
}

export default MyApp;
