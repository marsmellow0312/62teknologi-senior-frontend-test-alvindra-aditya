require ("dotenv").config();
const express = require("express");
const app = express();

app.get("/restoran",(req, res) => {
    console.log("semua data restoran")
    
});
//http://localhost:2023/2024/restoran

const port = process.env.port || 2024;
// NOTE : jika file env yang menyimpan alamat port tidak di temukan, maka akan membaca port sebagai 2024
app.listen(port, () => {
            console.log('terhubung ke server port ${port}');
    }
);