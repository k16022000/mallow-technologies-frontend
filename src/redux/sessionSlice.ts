import { createSlice } from '@reduxjs/toolkit';
import { UserSession } from '@utils/types';

const initialState: UserSession = {
  id: undefined,
  isAuth: false,
  roleId: undefined,
  roleName: undefined,
  name: undefined,
  maxAge: 0,
  profileURL: null,
  email: undefined,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionData: (state, action) => {
      state.id = action.payload._id;
      state.isAuth = action.payload.isAuth || false;
      state.roleId = action.payload.role_id;
      state.roleName = action.payload.role_name;
      state.name = action.payload.name;
      state.maxAge = action.payload.max_age;
      state.email = action.payload.email;
      state.profileURL = action.payload.profile_url;
    },
    clearSessionData: (state) => {
      state.id = undefined;
      state.isAuth = false;
      state.roleId = undefined;
      state.roleName = undefined;
      state.name = undefined;
      state.maxAge = 0;
      state.email = undefined;
      state.profileURL = null;
    }
  },
});

export const { setSessionData, clearSessionData } = sessionSlice.actions;

export default sessionSlice.reducer;
