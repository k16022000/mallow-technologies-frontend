import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ThemeMode, useThemeMode } from './ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { mode, setMode } = useThemeMode();

  return (
    <FormControl size="small">
      <InputLabel>Theme</InputLabel>
      <Select value={mode} onChange={(e) => setMode(e.target.value as ThemeMode)} label="Theme">
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
        <MenuItem value="system">System</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ThemeSwitcher;
