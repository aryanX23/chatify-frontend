import { defaultConfig } from 'vite';
import React from '@vitejs/plugin-react';

export default defaultConfig({
    server: {
        proxy: {
            '/api' : 'http://localhost:8000'
        }
    },
    plugins : [react()]
})