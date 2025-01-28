import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  firstName: null,
  lastName: null,
  role: null,
  isAuthenticated: false,

  // Funkcja logowania
  login: (token, firstName, lastName, role) =>
    set({
      token,
      firstName,
      lastName,
      role,
      isAuthenticated: true,
    }),

  // Funkcja wylogowania
  logout: () =>
    set({
      token: null,
      firstName: null,
      lastName: null,
      role: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
