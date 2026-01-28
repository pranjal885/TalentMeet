import express from 'express';
import {ENV} from './lib/env.js';


const app = express();

console.log(ENV.PORT); // To verify that env variables are loaded
console.log(ENV.DB_URL); // To verify that env variables are loaded

app.get('/health', (req, res) => {
  res.status(200).json({msg : "api is up and running"});
});

app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));