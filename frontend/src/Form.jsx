import React, { useState } from "react";

function Form() {
    const [person, setPerson] = useState({
        task: "",
        status: ""
    });
}

function handleChange(event) {
    const { name, value } = event.target;
    if (name === "task")
        setPerson({ task: person["task"], status: value });
    else setPerson({ task: value, status: person["status"] });
}
export default Form;