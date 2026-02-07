import express from 'express';
import {ENV} from './lib/env.js';
import path from "path"


const app = express();

const __dirname = path.resolve();


app.get('/health', (req, res) => {
  res.status(200).json({msg : "api is up and running"});
});

app.get('/books', (req, res) => {
  res.status(200).json({msg : "this is the books endpoint"});
});

//make our app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));//make dist folder your stativc assets

    //this below line shows, if user visits any other route other than /health and /books, then also we will send index.html file, so that react router can take care of routing in frontend
    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname, "..frontend","dist","index.html"));//index.html has out production ready code
    })
}

app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));