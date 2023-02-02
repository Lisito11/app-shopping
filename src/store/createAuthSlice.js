import authService from "../auth/services/auth.service";

export const createAuthSlice = (set) => ({
    isSignedIn: authService.isAuth(),
    user: authService.getCurrentUser(),
    getCurrentUser: () => set({user : authService.getCurrentUser()}),
    login: () => set({isSignedIn : authService.isAuth()}),
    logout: () => set({isSignedIn : authService.isAuth()}),
})