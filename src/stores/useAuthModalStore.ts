
import { create } from 'zustand';

interface AuthModalState {
  isSignupOpen: boolean;
  isLoginOpen: boolean;
  openSignup: () => void;
  openLogin: () => void;
  closeAll: () => void;
}

const useAuthModalStore = create<AuthModalState>((set) => ({
  isSignupOpen: false,
  isLoginOpen: false,
  openSignup: () => set({ isSignupOpen: true, isLoginOpen: false }),
  openLogin: () => set({ isLoginOpen: true, isSignupOpen: false }),
  closeAll: () => set({ isSignupOpen: false, isLoginOpen: false }),
}));

export default useAuthModalStore;
