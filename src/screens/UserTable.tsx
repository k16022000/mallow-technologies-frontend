import React, { useState } from 'react';
import CustomDataTable from '../globals/components/CustomDataTable';
import Header from '../globals/components/header/Header';
import { Box, Button } from '@mui/material';
import Swal from 'sweetalert2';
import UserCard from './UserCard';
import NullDataReplacement from '../globals/components/NullDataReplacement';
import CreateUserFormDialog from './CreateUserFormDialog';
import { setOpen, setPage, setTotalCount, setUsers, setView, setSelectedUserId, resetInitialValues } from '../redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/store';


const UserTable: React.FC = () => {
  const dispatch = useDispatch();
  const { users, page, totalCount, open, view } = useSelector((state: RootState) => state.user);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const [forceRender, setForceRender] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchUsers = async (entriesPerPage: number, currentPage: number) => {
    const res = await fetch(
      `https://reqres.in/api/users?page=${currentPage}`,
      {
        headers: {
          'x-api-key': API_KEY || '',
          'Accept': 'application/json'
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Request failed - ${res.status}`);
    }

    const json = await res.json();
    dispatch(setUsers(json.data));
    dispatch(setTotalCount(json.total));
    setIsLoading(false)
  };

  const handleEdit = (id: number) => {
    dispatch(setSelectedUserId(id));
    dispatch(setOpen(true));
  }

  const handleDelete = async (userId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `https://reqres.in/api/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'x-api-key': API_KEY || '',
            'Accept': 'application/json'
          }
        }
      );

      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted successfully.',
        }).then(() => {
          setForceRender(forceRender + 1);
        });
        // Re-fetch or update users list here
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete user. Please try again later.',
        showConfirmButton: true
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const filteredUsers = users?.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tableData = {
    columns: [
      { content: '', accessor: 'avatar', align: 'center' as const },
      { content: 'Email', accessor: 'email', align: 'left' as const },
      { content: 'First Name', accessor: 'first_name', align: 'left' as const },
      { content: 'Last Name', accessor: 'last_name', align: 'left' as const },
      {
        content: 'Action',
        accessor: 'action',
        align: 'center' as const,
        width: '150px',
      },
    ],
    rows: filteredUsers?.map(user => ({
      ...user,
      avatar: (
        <img
          src={user.avatar}
          alt="Profile"
          // className={styles.avatar}
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      ),
      action: (
        <Box display="flex" alignItems="center" gap="1rem" justifyContent="center">
          <Button
            onClick={() => handleEdit(user.id)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#5f56ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(user.id)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#ff1844',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </Button>
        </Box>
      )
    }))
  };


  const onAdd = () => {
    dispatch(setOpen(true));
    dispatch(setSelectedUserId(null));
    dispatch(resetInitialValues())
  }

  const toggleView = (newView: string) => {
    dispatch(setView(newView));
  }

  const getTableReplacement = () => {
    if (view === 'list') return false;
    if (filteredUsers?.length === 0) return <NullDataReplacement text="No users added" />;
    return <UserCard users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} isLoading={isLoading} />;
  };

  return (
    <>
      <Header />
      <Box sx={{ padding: '5rem' }}>
        <CustomDataTable
          tableData={tableData}
          tableReplacement={getTableReplacement()}
          handleDataRefresh={fetchUsers}
          forceRender={forceRender}
          searchable={true}
          onSearch={handleSearch}
          customizableEntriesCount={true}
          totalCount={totalCount}
          tableTitle="Users"
          addUserLabel="Create User"
          onAdd={onAdd}
          view={view}
          toggleView={toggleView}
        />
      </Box>

      <CreateUserFormDialog open={open} onClose={() => dispatch(setOpen(false))} onSubmit={fetchUsers} />;
    </>
  );
};

export default UserTable;