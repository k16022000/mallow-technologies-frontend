import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface userFormValues {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}


export interface UserState {
  users: User[];
  page: number;
  totalCount: number;
  open: boolean;
  view: string;
  selectedUserId: number | null;
  initialValues: userFormValues;
}


const initialState: UserState = {
  users: [],
  page: 1,
  totalCount: 0,
  open: false,
  view: 'cards',
  selectedUserId: null,
  initialValues: {
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
    id: ''
  }
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    upsertUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      } else {
        state.users.unshift(action.payload);
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setView: (state, action: PayloadAction<string>) => {
      state.view = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },
    setInitialValues: (state, action: PayloadAction<Partial<userFormValues>>) => {
      state.initialValues = { ...state.initialValues, ...action.payload, id: action.payload.id?.toString() || '' };
    },
    resetInitialValues: (state) => {
      state.initialValues = {
        id: '',
        email: '',
        first_name: '',
        last_name: '',
        avatar: ''
      };
    }
  }
});


export const {
  setUsers,
  upsertUser,
  deleteUser,
  setPage,
  setTotalCount,
  setOpen,
  setView,
  setSelectedUserId,
  setInitialValues,
  resetInitialValues
} = userSlice.actions;


export default userSlice.reducer;
