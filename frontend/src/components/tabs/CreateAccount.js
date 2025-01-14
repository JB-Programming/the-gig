import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Switch } from '@mui/material';
import axios from 'axios';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_staff: false,
    is_superuser: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        is_staff: formData.is_staff,
        is_superuser: formData.is_superuser
      };
      
      const response = await axios.post('http://localhost:8000/api/create-user/', 
        userData,
        {
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response:', response.data);
      alert('Account created successfully!');
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      alert(`Failed to create account: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Create New Account</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Username"
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <TextField
            fullWidth
            required
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <TextField
            fullWidth
            required
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
          />
          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>User Role</InputLabel>
            <Select
              value={formData.is_superuser ? "superuser" : formData.is_staff ? "staff" : "user"}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  is_staff: value === "staff" || value === "superuser",
                  is_superuser: value === "superuser"
                });
              }}
            >
              <MenuItem value="user">Regular User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="superuser">Superuser</MenuItem>
            </Select>
          </FormControl>
          <Button 
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Account
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateAccount;