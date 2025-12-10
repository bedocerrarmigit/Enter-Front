import api from './api';

export const loginRequest = (username, password) => {
  return api.post('/auth/login', {
    username,
    password,
  });
};
