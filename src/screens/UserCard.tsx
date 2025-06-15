import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './styles/UserCard.module.scss';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  avatar: string;
}

interface UserCardProps {
  users: User[];
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
  isLoading?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ users = [], onEdit, onDelete, isLoading = false }) => {
  if (isLoading) {
    return (
      <Grid container spacing={2} margin={3}>
        {[1, 2, 3].map((item) => (
          <Grid size={{ xs: 12, sm: 4, md: 4 }} key={item}>
            <Box className={styles.cardWrapper}>
              <Card className={styles.userCard}>
                <CardContent className={styles.cardContent}>
                  <Skeleton variant="circular" width={80} height={80} className={styles.avatar} />
                  <Skeleton variant="text" width="60%" height={30} className={styles.name} />
                  <Skeleton variant="text" width="70%" height={20} className={styles.email} />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} margin={3}>
      {users.map((user) => (
        <Grid size={{ xs: 12, sm: 4, md: 4 }} key={user.id}>
          <Box className={styles.cardWrapper}>
            <Card className={styles.userCard}>
              <CardContent className={styles.cardContent}>
                <img src={user.avatar} alt="Profile" className={styles.avatar} />
                <Typography className={styles.name}>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography className={styles.email}>
                  {user.email}
                </Typography>
              </CardContent>
              <Box className={styles.overlay}>
                <IconButton className={styles.editBtn} onClick={() => onEdit(user.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton className={styles.deleteBtn} onClick={() => onDelete(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserCard;

