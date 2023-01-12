import * as Joi from 'joi';
import configFactory from '../utils/factories/configFactory';

const appConfigSchema = Joi.object({
  node_env: Joi.string().valid(
    'development',
    'production',
    'test',
    'provision',
  ),
  port: Joi.number().integer().default(3000),
});

const appConfig = () => ({
  node_env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
});

export default configFactory('app', appConfig, appConfigSchema);
