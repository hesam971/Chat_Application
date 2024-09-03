import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { URL } from './database/congif';
import cors from 'cors';
import bodyParser from 'body-parser';
import  userInformation  from './database/schema'
import bcrypt from 'bcrypt';
import http from 'http'
import {Server} from 'socket.io'


// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


type UserInfo = {
  username: string;
  lastname: string;
  email: string;
  password: string;
};




// Connect to the database
mongoose.connect(URL)
.then(() => {
  // Log a message when the connection is successful
  console.log('Connected to the database');
}).catch((error) => {
  // Log an error message if there is an error connecting to the database
  console.log('Error connecting to the database: ', error);
})


app.post('/register', async (req: Request, res: Response) => {
  const {username, lastname, email, password}: UserInfo = req.body

  try{
    const user = await userInformation.findOne({email})
    if(user){
      res.status(400).json({message:'user is already exist'})
    }else{
      bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in your password DB.
        if(err){
          console.log(err)
        }else{
          const newUser = new userInformation({
            username,
            lastname,
            email,
            password:hash
          })
          newUser.save()
          res.status(201).json({message:'user is created'})
        }
    });

    }
  }catch(error){
    res.status(400).json({message:error})
  }
})


app.post('/login', async (req: Request, res: Response) => {
  const {email, password}: Omit<UserInfo, 'username' | 'lastname'> = req.body

  const user = await userInformation.findOne({email})

  if(!user){
    res.status(400).json({message:'user is not exist'})
  }else{
    bcrypt.compare(password, user.password, function(err, result: boolean) {
      if(!result){
        res.status(400).json({message: 'password incorrect'})
      }else{
        res.status(201).json({message: 'login success', userId:user._id})
      }
  });
  }
})


app.get('/dashboard/:id', async (req: Request, res: Response) => {
  const userId = req.params.id
  const user = await userInformation.findById(userId).select('username')
  if(!user){
    res.status(400).json({message:'user is not exist'})
  }else{
    res.status(201).json({message: 'login success', username:user.username})
  }
})


// Listen for incoming socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // Handle incoming messages from the client
  socket.emit('message', {message: 'Hello world'})
  socket.on('requestMessage', (data) => {
    console.log('that is the data', data)
  })
});


// Specify the port number for the server
const port: number = 3000;

// Start the server and listen on the specified port
server.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});