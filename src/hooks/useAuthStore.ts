import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

interface loginCredential {
    name?: string;
    email: string,
    password: string
}

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector((state: any) => state.auth)
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }: loginCredential) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime().toString());
            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error: any) {
            dispatch(onLogout('Credenciales incorrectas'))
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10)
        }
    }

    const startRegister = async ({ name, email, password }: loginCredential) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth/new', { name, email, password })
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime().toString());
            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error: any) {
            dispatch(onLogout(error.response?.data?.msg || '--'))
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10)
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout('No hay token disponible'));

        try {
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime().toString());
            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error: any) {
            localStorage.clear();
            dispatch(onLogout('Token inválido o expirado'));
        }

        //const { data } = await calendarApi.post('/auth/new', { name, email, password })
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogoutCalendar())
        dispatch(onLogout(''));
    }

    return {
        //*Propiedades
        status,
        user,
        errorMessage,

        //*Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
}