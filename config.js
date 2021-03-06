require("dotenv").config();
const requiredEnvs = ["jwtSecret", "MongooseUri", "NewsAPIKey"];
const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);
if (missingEnvs.length) {
  throw new Error(`Missing required envs ${missingEnvs}`);
}
module.exports = {
  PORT: process.env.PORT || 4200,
  jwtSecret: process.env.jwtSecret,
  saltRound: process.env.saltRound || 8,
  MongooseUri: process.env.MongooseUri,
  NewsAPIKey: process.env.NewsAPIKey,
};
