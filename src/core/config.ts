import "dotenv/config";
import Joi from "joi";
import { Configuration } from "types/app";

const schema = Joi.object({
	NODE_ENV: Joi.string()
		.valid(...["development", "production", "test"])
		.required(),
	PORT: Joi.number().required().description("API Port"),
	MONGO_URL_DEV: Joi.string()
		.required()
		.description("Mongo DB url for development"),
	MONGO_URL_PROD: Joi.string()
		.required()
		.description("Mongo DB url for production"),
})
	.unknown()
	.required();

const { error, value: envVars } = schema.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const CONFIG: Configuration = {
	env: envVars.NODE_ENV,

	server: {
		port: envVars.PORT,
		mongoUrl:
			envVars.NODE_ENV === "development"
				? envVars.MONGO_URL_DEV
				: envVars.MONGO_URL_PROD,
	},
};

export default CONFIG;
