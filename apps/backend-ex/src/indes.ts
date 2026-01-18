import express from 'express'
import userRouter from "./routes/signin";
const app = express();
app.use(express.json());

app.use("/v1", userRouter)
app.listen(3000, () => {
    console.log("hii there ")
})