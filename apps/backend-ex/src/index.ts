import "dotenv/config";
import express from 'express'
import userRouter from "./routes/signin";
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use("/v1", userRouter)
app.listen(3001, () => {
    console.log("hii there ")
})