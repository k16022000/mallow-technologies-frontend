import React from 'react';
import * as Yup from 'yup';
import { Box, Button, Checkbox, FormControlLabel, Typography, Paper, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import { Lock, PermIdentity } from '@mui/icons-material';
import CustomFormik from '../globals/components/Customformik';
import { Form, FormField } from '../globals/components/CustomFormComponents';
import { setLogin } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid Email')
      .required('Required field'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required field'),
    remember: Yup.boolean(),
  });


  const initialValues = {
    email: '',
    password: '',
    remember: false,
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    console.log('Login values', values);

    try {
      const res = await fetch(`https://reqres.in/api/login`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          showConfirmButton: true
        }).then(() => {
          dispatch(setLogin(true));
          navigate("/home");
        });
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Something went wrong. Please try again later.',
        showConfirmButton: true
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ddd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 350, borderRadius: 2 }}>
        <CustomFormik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Box display="flex" alignItems="center" mb={2}>
                {/* <Mail sx={{ mr: 1, color: '#666' }} /> */}
                <FormField
                  fullWidth
                  id="email"
                  name="email"
                  placeholder='Email'
                  size="small"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermIdentity sx={{ mr: 1, color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <FormField
                  fullWidth
                  id="password"
                  name="password"
                  placeholder='Password'
                  type="password"
                  size="small"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  // InputProps={{ style: { backgroundColor: '#f5f7ff' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ mr: 1, color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={values.remember}
                    onChange={handleChange}
                    sx={{ color: '#6366f1' }}
                  />
                }
                label={<Typography fontSize={14}>Remember Me</Typography>}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#6366f1',
                  mt: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                  }
                }}
              >
                Login
              </Button>
            </Form>
          )}
        </CustomFormik>
      </Paper>
    </Box>
  );
};

export default LoginForm;