import express from 'express';
import {ENV} from './lib/env.js';
import path from "path"
import { connectDB } from './lib/db.js';
import cors from 'cors'; //Allows frontend to talk to backend.


const app = express();

const __dirname = path.resolve();//Because you’re using ES modules (type: module), Node doesn’t give __dirname automatically.
//So you manually define it.


//middleware
app.use(express.json());//to parse json data in request body
//credentials : true means server allows a browser to send cookies along with requests. Important for authentication.
app.use(cors({origin : "http://localhost:5173",credentials:true}));//allow requests from frontend running on port 5173
//This allows frontend (Vite) to call backend APIs.

app.use("/api/inngest",serve({client:inngest, functions}))


app.get('/health', (req, res) => {
  res.status(200).json({msg : "api is up and running"});
});

app.get('/books', (req, res) => {
  res.status(200).json({msg : "this is the books endpoint"});
});

//make our app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));//make dist folder your stativ assets

    //this below line shows, if user visits any other route other than /health and /books, 
    //then also we will send index.html file, so that react router can take care of routing in frontend
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));//index.html has out production ready code
    });
}


const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => 
  console.log(`Server running on port ${ENV.PORT}`)
);


    } catch (error) {
        console.error("Error starting server", error);
    }
};

startServer();