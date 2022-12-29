import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number(),
  POSTGRES_PASSWORD: Joi.string(),
  POSTGRES_NAME: Joi.string(),
  POSTGRES_HOST: Joi.string(),
  POSTGRES_PORT: Joi.number(),
  POSTGRES_USERNAME: Joi.string(),
  DEFAULT_LIMIT: Joi.number().default(10),
  NODE_ENV: Joi.string().default('dev'),
});
