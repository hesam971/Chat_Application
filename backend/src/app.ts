import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { URL } from './database/congif';
import cors from 'cors';
import bodyParser from 'body-parser';
import  userInformation  from './database/schema'
import bcrypt from 'bcrypt';
import http from 'http'
import {Server} from 'socket.io'
import jwt from'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Create an Express application
const app = express();


app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
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
          if(err){
            res.status(400).json({message: 'token error'})
          }else{
            const token = jwt.sign({ id: user._id }, "YOUR_SECRET", { expiresIn: "1d"});
            
            console.log(req.cookies)
            // Set the token in an HTTP-only cookie
            //res.cookie("cookie", 'token', { httpOnly: true,maxAge: 3600000 });

            res.status(201).cookie("cookie", token, { httpOnly: true,maxAge: 3600000 })
            .json({message: 'login success', tokenId: token})
          }
      }
  });
  }
})



app.get('/dashboard', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  
  // Check if Authorization header is provided
  if ( !authHeader ) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }else{
    try {
      const decoded = jwt.verify(authHeader, "YOUR_SECRET");
      if (typeof decoded !== 'string' && 'id' in decoded) {

        const user = await userInformation.findById(decoded.id).select('username')
        if(!user){
          res.status(400).json({message:'user is not exist'})
        }else{
          res.status(201).json({message: 'login success', username:user.username})
        }
        
      }
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  }
})


// Listen for incoming socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

    // Emit a message back to the client
    socket.on('join_room', (data) => {
      socket.join(data.chatRoom)
      console.log(data)
    })

    socket.on("send_message", (data) => {
      socket.to(data.chatRoom).emit("receive_message", data);
      // io.to(data.chatRoom).emit("receive_message", data);
      console.log(data.chatRoom)
      console.log(data)
    });


    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    })  
});






// Specify the port number for the server
const port: number = 3000;

// Start the server and listen on the specified port
server.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});