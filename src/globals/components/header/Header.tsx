import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './Header.module.scss';
import { Icon, IconButton, Tooltip } from '@mui/material';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.name}>Kaviarasu N.</div>
      <Tooltip title="Logout">
        <IconButton className={styles.logoutBtn} onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </header>
  );
};

export default Header;
