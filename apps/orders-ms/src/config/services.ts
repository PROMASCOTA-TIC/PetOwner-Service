import axios from 'axios';

const NATS_SERVICE = 'NATS_SERVICE';

const HttpService = axios.create({
    baseURL: 'http://localhost:3001/api/',
    // baseURL: 'http://api-gateway:3001/api/', // Comentar si se usa local
    // timeout: 1000,
    // headers: { 'Content-Type': 'application/json' },
});

export {
    NATS_SERVICE,
    HttpService,
}