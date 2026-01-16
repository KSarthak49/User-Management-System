import { useState, useEffect } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { useAuth } from '../context/authContext'; // Import Auth
import { PlusCircle, Search, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { logout } = useAuth(); // Hook to handle logout

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // --- CRUD LOGIC ---
  const addUser = (user) => {
    const newUser = { ...user, id: Date.now() };
    setUsers([...users, newUser]);
    setShowForm(false);
  };

  const updateUser = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setIsEditing(false);
    setShowForm(false);
    setCurrentUser(null);
  };

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleEditClick = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setShowForm(true);
  };

  // --- SEARCH & PAGINATION LOGIC ---
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <header className="header">
        <h1>User Dashboard</h1>
        
        {/* Search Bar */}
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={handleAddClick}>
            <PlusCircle size={20} /> Add User
            </button>
            
            {/* NEW: Logout Button */}
            <button className="btn-secondary" onClick={logout} title="Logout">
             <LogOut size={20} />
            </button>
        </div>
      </header>

      <main>
        {showForm ? (
          <UserForm
            addUser={addUser}
            updateUser={updateUser}
            currentUser={currentUser}
            isEditing={isEditing}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            <UserList 
              users={currentUsers} 
              onEdit={handleEditClick} 
              onDelete={deleteUser} 
            />
            
            {/* Pagination Controls */}
            {filteredUsers.length > usersPerPage && (
              <div className="pagination">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="btn-secondary"
                >
                  <ChevronLeft size={18} /> Prev
                </button>
                
                <span>Page {currentPage} of {totalPages}</span>
                
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="btn-secondary"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;