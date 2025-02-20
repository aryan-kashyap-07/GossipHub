const express = require('express');
const connectDb = require('./config/database')
const authRoutes = require('./routes/auth.routes')
const messageRoutes = require('./routes/message.routes')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const { app, server } = require('./config/socket');
const path = require('path')

// const app = express();

dotenv.config();
const PORT = process.env.PORT;
__dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


connectDb().then(() => {
    console.log("Db connected");
    server.listen(PORT, () => {
        console.log("running on " + PORT)
    });
}).catch((err) => {
    console.log("Maa chud gyi");
})

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


