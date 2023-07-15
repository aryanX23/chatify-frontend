import axios from 'axios';
const BASE_URL = "https://chatify-app-qhgp.onrender.com/api";

export const Axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivate = axios.create({

    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const URL = BASE_URL ;