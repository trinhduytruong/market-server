import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
const app = express();
const port = 8889;
import userRoute from './routes/user-route.mjs'
import categoryRoute from './routes/category-route.mjs'
import foodRoute from './routes/food-route.mjs'
import familyGroupRoute from './routes/family-group-route.mjs'
dotenv.config()

app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.once("open", () => {
    console.log("MongoDB connected successfully!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/food' , foodRoute)
app.use('/api/familygroup' , familyGroupRoute)