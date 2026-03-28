import express from "express";
import "dotenv/config";
import cors from "cors";
import axios from "axios";
import chatRoute from "./routes/chat.js";
import mongoose from "mongoose";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
const API_KEY = process.env.API_KEY;

app.use("/api", chatRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB=async()=>{
  try{
    mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to the DB!");
  }catch(err){
    console.log("failed to connect to db ",err);
  }
}


// app.post("/test", async (req, res) => {
//   try {
//     const response=await axios({
//       url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
//       method: "post",
//       history: [
//       {
//         role: "user",
//         parts: [{ text: req.body.message }],
//       }
//     ],
//     });
//     console.log(response.data.candidates[0].content.parts[0].text);
//     res.json(response.data.candidates[0].content.parts[0].text);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [{ text: req.body.message }],
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
//       options,
//     );

//     const data = await response.json();

//     console.log(data.candidates[0].content.parts[0].text);

//     res.send(data.candidates[0].content.parts[0].text);
//   } catch (err) {
//     console.log(err);
//   }
// });
