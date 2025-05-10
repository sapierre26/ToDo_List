const userURL = "http://localhost:8000/api/Users";

export const getUsers = async () => {
    try {
        const res = await fetch(userURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        const users = await res.json();
        console.log(users);
        return users;
    } catch (error) {
        console.error("Error:", error);
    }
};
