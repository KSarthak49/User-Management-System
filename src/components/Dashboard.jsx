import { useState, useEffect } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { useAuth } from '../context/AuthContext.jsx'; 
import { PlusCircle, Search, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const Dashboard = () => {
  // 1. Get Auth Info
  const { logout, user } = useAuth(); 

  // --- PRELOADED DATA ---
  const initialData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@company.com", role: "User", status: "Inactive" },
    { id: 3, name: "Robert Fox", email: "robert@test.com", role: "Manager", status: "Active" },
    { id: 4, name: "Emily Blunt", email: "emily@movie.com", role: "User", status: "Active" },
    { id: 5, name: "Michael Scott", email: "michael@dunder.com", role: "Manager", status: "Active" },
  ];

  // 2. Initialize State (Load from LocalStorage OR use Preloaded Data)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('dashboard_users');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // 3. Save to LocalStorage whenever 'users' changes
  useEffect(() => {
    localStorage.setItem('dashboard_users', JSON.stringify(users));
  }, [users]);

  // --- CRUD OPERATIONS (Local Only) ---

  // CREATE
  const addUser = (userData) => {
    const newUser = { ...userData, id: Date.now() }; // Generate ID locally
    setUsers([...users, newUser]);
    setShowForm(false);
  };

  // UPDATE
  const updateUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setIsEditing(false);
    setShowForm(false);
    setCurrentUser(null);
  };

  // DELETE
  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // --- HANDLERS ---
  const handleEditClick = (userToEdit) => {
    setIsEditing(true);
    setCurrentUser(userToEdit);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setShowForm(true);
  };

  // --- SEARCH & PAGINATION ---
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* ROLE CHECK: Only Admin & Manager see "Add User" */}

            {(user?.role === 'Admin' || user?.role === 'Manager') && (
              <button className="btn-primary" onClick={handleAddClick}>
                <PlusCircle size={20} /> Add User
              </button>
            )}

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
              currentUserRole={user?.role} 
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