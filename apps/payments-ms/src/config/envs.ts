import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    DB_DIALECT: string;
    DB_PAYMENT_USERNAME: string;
    DB_PAYMENT_PASSWORD: string;
    CONNECTION_STRING: string;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    DB_DIALECT: joi.string().required(),
    DB_PAYMENT_USERNAME: joi.string().required(),
    DB_PAYMENT_PASSWORD: joi.string().required(),
    CONNECTION_STRING: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    dbDialect: envVars.DB_DIALECT,
    dbPaymentUsername: envVars.DB_PAYMENT_USERNAME,
    dbPaymentPassword: envVars.DB_PAYMENT_PASSWORD,
    connectionString: envVars.CONNECTION_STRING,
    natsServers: envVars.NATS_SERVERS,
}