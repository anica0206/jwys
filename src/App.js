// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                console.log(response.data); // ✅ 여기 추가
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-8">Users List</h1>
            <ul className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
                {users.map((user, index) => (
                    <li
                        key={index}
                        className="border-b last:border-none pb-2 text-gray-700 text-lg"
                    >
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default App;
