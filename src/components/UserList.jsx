import { Edit, Trash2 } from 'lucide-react';

const UserList = ({ users, onEdit, onDelete }) => {
  if (users.length === 0) {
    return <div className="empty-state">No users found. Add one to get started!</div>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
             <span className={`status-badge ${(user.status || 'Active').toLowerCase()}`}>
  {user.status || 'Active'}
</span> 
              </td>
              <td className="actions">
                <button onClick={() => onEdit(user)} className="btn-icon edit">
                  <Edit size={18} />
                </button>
                <button onClick={() => onDelete(user.id)} className="btn-icon delete">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;