import "dotenv/config";
import express from 'express'
import userRouter from "./routes/signin";
import cors from "cors"
import cookieParser from "cookie-parser";

// in server.ts

const app = express();
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
    "http://localhost:3000",
    "https://sketch-pad-web.vercel.app"
];
app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps, curl, Postman)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use("/v1", userRouter)
app.listen(3001, () => {
    console.log("hii there ")
});

