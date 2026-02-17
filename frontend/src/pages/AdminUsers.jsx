import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
import { User, Mail, Calendar, Shield, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH ALL USERS ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        let usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by newest registered first (assuming you save a createdAt timestamp!)
        usersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Customer Data...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>Customer Directory</h1>
        <div className="total-badge" style={{ backgroundColor: '#bb86fc', color: '#000', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
          Total Users: {users.length}
        </div>
      </div>

      {/* USERS TABLE */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '16px', color: '#666' }}>Customer</th>
              <th style={{ padding: '16px', color: '#666' }}>Contact</th>
              <th style={{ padding: '16px', color: '#666', textAlign: 'right' }}>Role</th>
              <th style={{ padding: '16px', color: '#666' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  No users found in the database. Ensure your registration page is saving to the "users" collection!
                </td>
              </tr>
            ) : (
              users.map((user) => {
                // Quick check to see if this user is the Admin (You!)
                const isAdmin = user.role === 'admin' || user.email === 'ram@riti.com'; 

                return (
                  <tr key={user.id} className="user-row" style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
                    
                    {/* CUSTOMER NAME & AVATAR */}
                    <td className="td-customer" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: isAdmin ? '#bb86fc' : '#f0f0f0', color: isAdmin ? '#000' : '#888', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#333', fontSize: '15px' }}>
                          {user.name || 'Anonymous User'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                          ID: {user.id.slice(0, 10)}...
                        </div>
                      </div>
                    </td>

                    {/* CONTACT INFO */}
                    <td className="td-contact" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '14px' }}>
                        <Mail size={16} color="#888" /> {user.email}
                      </div>
                    </td>

                    {/* ROLE BADGE */}
                    <td className="td-role" style={{ padding: '16px', textAlign: 'right' }}>
                      {isAdmin ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f3e8ff', color: '#9333ea', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                          <ShieldCheck size={14} /> Admin
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f3f4f6', color: '#4b5563', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                          <Shield size={14} /> Customer
                        </div>
                      )}
                    </td>

                    {/* JOIN DATE */}
                    <td className="td-joined" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '14px' }}>
                        <Calendar size={16} color="#888" /> 
                        <span className="mobile-label" style={{ display: 'none', marginRight: '5px' }}>Joined:</span>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        .mobile-label {
          font-weight: bold;
          color: #888;
        }

        @media (max-width: 768px) {
          /* Stack the header */
          .admin-header-container {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 15px;
          }
          .total-badge {
            align-self: flex-start;
          }

          /* Force table to block layout */
          .users-table, 
          .users-table tbody, 
          .users-table tr, 
          .users-table td {
            display: block;
            width: 100%;
          }

          /* Hide table headers */
          .users-table thead {
            display: none;
          }

          /* Turn rows into cards */
          .user-row {
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid #eaeaea !important;
            border-radius: 12px;
            position: relative;
            background: #fff;
          }

          /* Adjust cells inside the card */
          .users-table td {
            padding: 8px 0 !important;
            border-bottom: none !important;
            text-align: left !important;
          }

          /* Anchor the Role badge to the top right of the card */
          .td-role {
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 0 !important;
            width: auto !important;
          }

          /* Prevent Customer Name from hiding underneath the role badge */
          .td-customer {
            padding-right: 120px !important;
            border-bottom: 1px dashed #eee !important;
            margin-bottom: 8px;
            padding-bottom: 12px !important;
          }

          /* Show mobile labels where needed */
          .mobile-label {
            display: inline-block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;