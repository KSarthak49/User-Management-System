import { Edit, Trash2 } from 'lucide-react';

const UserList = ({ users, onEdit, onDelete, currentUserRole }) => {
  if (users.length === 0) {
    return <div className="empty-state">No users found.</div>;
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
            {/* Hide Actions column for basic Users */}
            {currentUserRole !== 'User' && <th>Actions</th>}
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
              
              {/* Conditional Rendering for Actions */}
              {currentUserRole !== 'User' && (
                <td className="actions">
                  
                  {/* EDIT: Admin & Manager */}
                  {(currentUserRole === 'Admin' || currentUserRole === 'Manager') && (
                    <button onClick={() => onEdit(user)} className="btn-icon edit" title="Edit">
                      <Edit size={18} />
                    </button>
                  )}

                  {/* DELETE: ONLY Admin */}
                  {currentUserRole === 'Admin' && (
                    <button onClick={() => onDelete(user.id)} className="btn-icon delete" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  )}

                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;