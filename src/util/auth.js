import { redirect } from "react-router-dom";

export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiresIn');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export const getAuthToken = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const tokenDuration = getTokenDuration();

    console.log('tokenDuration', tokenDuration);

    if (tokenDuration < 0) {
        return 'EXPIRED';
    }

    return token;
}

export const tokenLoader = () => getAuthToken();

export const checkAuthLoader = () => {
    const token = getAuthToken();

    if (!token) {
        return redirect('/auth');
    }

    return null; // this is missing in the next lecture video and should be added by you
}