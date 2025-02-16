import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    DB_DIALECT: string;
    DB_ORDER_USERNAME: string;
    DB_ORDER_PASSWORD: string;
    CONNECTION_STRING: string;
    ORDER_INITIAL_STATUS: number;
    ORDER_DELIVERY_COST: number;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    DB_DIALECT: joi.string().required(),
    DB_ORDER_USERNAME: joi.string().required(),
    DB_ORDER_PASSWORD: joi.string().required(),
    CONNECTION_STRING: joi.string().required(),
    ORDER_INITIAL_STATUS: joi.number().required(),
    ORDER_DELIVERY_COST: joi.number().required(),
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
    dbOrderUsername: envVars.DB_ORDER_USERNAME,
    dbOrderPassword: envVars.DB_ORDER_PASSWORD,
    connectionString: envVars.CONNECTION_STRING,
    orderInitialStatus: envVars.ORDER_INITIAL_STATUS,
    orderDeliveryCost: envVars.ORDER_DELIVERY_COST,
    natsServers: envVars.NATS_SERVERS,
}