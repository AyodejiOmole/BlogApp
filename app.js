import express from "express";
import mongoose from "mongoose";
import router from "./routes/user.route";
import blogRouter from "./routes/blog.route";

const app = express();
app.use(express.json());
app.use("/api/user", router);
app.use("api/blog", blogRouter);

mongoose
    .connect("mongodb+srv://admin:4RNZSPX6L0w5qn3S@cluster0.phn2rgq.mongodb.net/?retryWrites=true&w=majority")
    .then(() => app.listen(5000))
    .then(() => console.log("Database has been connected and listening on local host 5000"))
    .catch((error) => {
        console.log(error);
    });

// 4RNZSPX6L0w5qn3S