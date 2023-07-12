import axios from 'axios';
const BASE_URL = 'http://192.168.12.1:8000';

export const Axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivate = axios.create({

    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const URL = BASE_URL;