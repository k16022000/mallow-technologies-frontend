import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material';
import CustomFormik from '../globals/components/Customformik';
import Swal from 'sweetalert2';
import { Form, FormField } from '../globals/components/CustomFormComponents';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialValues } from '../redux/userSlice';
import { RootState } from '@redux/store';

interface CreateUserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  id: string;
};

const CreateUserFormDialog: React.FC<CreateUserFormDialogProps> = ({ open, onClose, onSubmit }) => {
  const API_KEY = process.env.REACT_APP_API_KEY || '';
  const dispatch = useDispatch();
  const { selectedUserId, initialValues } = useSelector((state: RootState) => state.user);


  const validationSchema = Yup.object({
    first_name: Yup.string().required('Required field'),
    last_name: Yup.string().required('Required field'),
    email: Yup.string().email('Invalid Email').required('Required field'),
    avatar: Yup.string().url('Invalid URL').required('Required field'),
  });


  const handleSubmit = async (values: FormValues) => {
    const payload = {
      name: `${values.first_name} ${values.last_name}`,
      job: values.avatar || 'zion resident'
    };

    const isUpdate = !!values.id;
    const method = isUpdate ? 'PUT' : 'POST';
    const endpoint = isUpdate
      ? `https://reqres.in/api/users/${values.id}`
      : 'https://reqres.in/api/users';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} user`);
      }

      const data = await response.json();
      console.log(`${isUpdate ? 'User updated' : 'User created'}:`, data);

      Swal.fire({
        icon: 'success',
        title: isUpdate ? 'User Updated' : 'User Created',
        text: `User ${data.name || values.first_name} has been successfully ${isUpdate ? 'updated' : 'created'}.`,
        showConfirmButton: true
      }).then(() => {
        onSubmit();
      });

      onClose();

    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} user:`, error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${isUpdate ? 'update' : 'create'} user. Please try again later.`,
        showConfirmButton: true
      });
    }
  };

  const handleEdit = async () => {
    const res = await fetch(
      `https://reqres.in/api/users/${selectedUserId}`,
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
    dispatch(setInitialValues(json.data));
  };

  useEffect(() => {
    if (selectedUserId !== null) {
      handleEdit();
    }
  }, [selectedUserId])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedUserId ? 'Edit User' : 'Create New User'}</DialogTitle>
      <DialogContent dividers>
        <CustomFormik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Box mt={1} mb={2}>
                <FormField
                  fullWidth
                  required
                  id="first_name"
                  name="first_name"
                  placeholder="First Name"
                  label="First Name"
                  size="small"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.first_name && errors.first_name}
                />
              </Box>

              <Box mb={2}>
                <FormField
                  fullWidth
                  required
                  id="last_name"
                  name="last_name"
                  placeholder="Last Name"
                  label="Last Name"
                  size="small"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.last_name && errors.last_name}
                />
              </Box>

              <Box mb={2}>
                <FormField
                  fullWidth
                  required
                  id="email"
                  name="email"
                  placeholder="Email"
                  label="Email"
                  size="small"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />
              </Box>

              <Box mb={1}>
                <FormField
                  fullWidth
                  required
                  id="avatar"
                  name="avatar"
                  placeholder="Profile Image URL"
                  label="Profile Image URL"
                  size="small"
                  value={values.avatar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.avatar && errors.avatar}
                />
              </Box>

              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={onClose} color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: '#6366f1' }}>
                  {selectedUserId ? 'Update User' : 'Create User'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </CustomFormik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserFormDialog;
