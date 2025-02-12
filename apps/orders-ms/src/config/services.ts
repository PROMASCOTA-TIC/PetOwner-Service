import axios from 'axios';

const NATS_SERVICE = 'NATS_SERVICE';

const HttpService = axios.create({
    baseURL: 'http://localhost:3001/api/',
    // timeout: 1000,
    // headers: { 'Content-Type': 'application/json' },
});

export {
    NATS_SERVICE,
    HttpService,
}