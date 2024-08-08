import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct named import
import Select from 'react-select';


function BookList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [editingCell, setEditingCell] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('ROOOOLE', decodedToken.role);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('An error occurred while fetching users.');
        }
    };

    const handleCellClick = (userId, columnName) => {
        setEditingCell({ userId, columnName });
    };

    const handleInputChange = (newValue, user, columnName) => {
        console.log(`Before update: ${columnName} for user ${user.id}:`, user[columnName]);
    
        setUsers(prevUsers =>
            prevUsers.map(u =>
                u.id === user.id ? { ...u, [columnName]: newValue } : u
            )
        );
    
        console.log(`After update: ${columnName} for user ${user.id}:`, newValue);
    };

    const handleUpdate = async (user) => {
        const token = localStorage.getItem('token');
        console.log('User data to update:', user);
    
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
    
            const responseData = await response.json();
            console.log('Server response data:', responseData);
    
            await fetchUsers();
            setEditingCell(null);
        } catch (error) {
            console.error('Update error:', error);
            setError('An error occurred while updating user.');
        }
    };

    const affectationOptions = [
        { value: '12', label: '12' },
        { value: '13', label: '13' },
        { value: '16N', label: '16N' },
        { value: '16S', label: '16S' },
        { value: '10', label: '10' },
        { value: 'Elevateur', label: 'Elevateur' },
        { value: 'Camion/Chargeuse', label: 'Camion/Chargeuse' },
        { value: 'Arriére', label: 'Arriére' },
        { value: 'PB', label: 'PB' },
        { value: 'R. Hebdo', label: 'R. Hebdo' },
        { value: 'C. de maladie', label: 'C. de maladie' },
        { value: 'C. annuels', label: 'C. annuels' },
        { value: 'C. Administ', label: 'C. Administ' }
    ];

    return (
        <div className="p-5">
            <div className="flex flex-wrap justify-between shadow-lg">
                <div className="w-full lg:w-full">
                    <div className="bg-white p-5 rounded-lg mb-5">
                        <div className="cardHeader mb-5">
                            <h2 className="text-4xl text-gray-500 font-bold my-14">AFFECTATION DES MOYENS HUMAINS</h2>
                        </div>
                        <div className="overflow-auto" style={{ maxHeight: '500px' }}>
                            {error ? (
                                <div className="text-red-500 text-center">{error}</div>
                            ) : (
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="px-6 py-3 font-bold text-lg text-left text-gray-500 uppercase tracking-wider">MLE</th>
                                            <th className="px-6 py-3 font-bold text-lg text-left text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 font-bold text-lg text-left text-gray-500 uppercase tracking-wider">fonction</th>
                                            <th className="px-6 py-3 font-bold text-lg text-left text-gray-500 uppercase tracking-wider">Affectation Initiale</th>
                                            <th className="px-6 py-3 font-bold text-lg text-left text-gray-500 uppercase tracking-wider">Affectation Finale</th>
                                            <th className="px-6 py-3 font-bold text-lg text-left text-gray-500 uppercase tracking-wider">Observation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.MLE}>
                                                <td className="px-6 py-6 border-t border-gray-200">{user.MLE}</td>
                                                <td className="px-6 py-3 border-t border-gray-200">
                                                    {editingCell && editingCell.userId === user.id && editingCell.columnName === 'Name' ? (
                                                        <input
                                                            type="text"
                                                            value={user.Name}
                                                            onChange={(e) => handleInputChange(e.target.value, user, 'Name')}
                                                            onBlur={() => handleUpdate(user)}
                                                            autoFocus
                                                            className="w-full border px-3 py-2 rounded"
                                                        />
                                                    ) : (
                                                        <span onClick={() => handleCellClick(user.id, 'Name')}>{user.Name}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 border-t border-gray-200">
                                                    {editingCell && editingCell.userId === user.id && editingCell.columnName === 'fonction' ? (
                                                        <input
                                                            type="text"
                                                            value={user.fonction}
                                                            onChange={(e) => handleInputChange(e.target.value, user, 'fonction')}
                                                            onBlur={() => handleUpdate(user)}
                                                            autoFocus
                                                            className="w-full border px-3 py-2 rounded"
                                                        />
                                                    ) : (
                                                        <span onClick={() => handleCellClick(user.id, 'fonction')}>{user.fonction}</span>
                                                    )}
                                                </td>
                                                <td className="w-22 px-4 py-3 border-t border-gray-200" style={{ minWidth: '150px', minHeight: '30px' }}>
                                                    {editingCell && editingCell.userId === user.id && editingCell.columnName === 'Affectation_Initiale' ? (
                                                        <Select
                                                            isMulti
                                                            value={user.Affectation_Initiale ? user.Affectation_Initiale.split(' - ').map(value => affectationOptions.find(option => option.value === value)) : []}
                                                            options={affectationOptions}
                                                            onChange={(selectedOptions) => handleInputChange(selectedOptions.map(option => option.value).join(' - '), user, 'Affectation_Initiale')}
                                                            onBlur={() => handleUpdate(user)}
                                                            autoFocus
                                                            className="w-full"
                                                        />
                                                    ) : (
                                                        <span
                                                            onClick={() => handleCellClick(user.id, 'Affectation_Initiale')}
                                                            className="inline-block w-full h-full cursor-pointer"
                                                            style={{ minWidth: '50px', minHeight: '30px' }}
                                                        >
                                                            {user.Affectation_Initiale || 'Choisir'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="w-22 px-4 py-3 border-t border-gray-200" style={{ minWidth: '150px', minHeight: '30px' }}>
                                                    {editingCell && editingCell.userId === user.id && editingCell.columnName === 'Affectation_Finale' ? (
                                                        <Select
                                                            isMulti
                                                            value={user.Affectation_Finale ? user.Affectation_Finale.split(' - ').map(value => affectationOptions.find(option => option.value === value)) : []}
                                                            options={affectationOptions}
                                                            onChange={(selectedOptions) => handleInputChange(selectedOptions.map(option => option.value).join(' - '), user, 'Affectation_Finale')}
                                                            onBlur={() => handleUpdate(user)}
                                                            autoFocus
                                                            className="w-full"
                                                        />
                                                    ) : (
                                                        <span
                                                            onClick={() => handleCellClick(user.id, 'Affectation_Finale')}
                                                            className="inline-block w-full h-full cursor-pointer"
                                                            style={{ minWidth: '50px', minHeight: '30px' }}
                                                        >
                                                            {user.Affectation_Finale || 'Choisir'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 border-t border-gray-200">
                                                    {editingCell && editingCell.userId === user.id && editingCell.columnName === 'Observation' ? (
                                                        <input
                                                            type="text"
                                                            value={user.Observation}
                                                            onChange={(e) => handleInputChange(e.target.value, user, 'Observation')}
                                                            onBlur={() => handleUpdate(user)}
                                                            autoFocus
                                                            className="w-full border px-3 py-2 rounded"
                                                        />
                                                    ) : (
                                                        <span onClick={() => handleCellClick(user.id, 'Observation')}>{user.Observation}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookList;