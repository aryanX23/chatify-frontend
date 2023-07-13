import axios from 'axios';
const BASE_URL = "http://13.235.23.197:3000";

export const Axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivate = axios.create({

    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const URL = BASE_URL;