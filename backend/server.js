require ("dotenv").config();

const express = require("express");
const app = express();
const db = require("./db");
const morgan = require("morgan");

app.use(express.json());

app.get("/api/v1/restoran", async (req, res) => {
    try {
      //select tabel restoran
      //const results = await db.query("select * from restoran");
    
      const restoranRatingsData = await db.query(
        "select * from restoran left join (select restoran_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restoran_id) reviews on restoran.id = reviews.restoran_id;"
      );
      res.status(200).json({
        status: "success",
        results: restoranRatingsData.rows.length,
        data: {
          restoran: restoranRatingsData.rows,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

  //Menampilkan gabungan beberapa table data restoran
app.get("/api/v1/restoran/:id", async (req, res) => {
    console.log(req.params.id);
  
    try {
      const restoran = await db.query(
        "select * from restoran left join (select restoran_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restoran_id) reviews on restoran.id = reviews.restoran_id where id = req.params.id",
        [req.params.id]
      );
      // select * from restoran wehre id = req.params.id
  
      const reviews = await db.query(
        "select * from reviews where restoran_id = req.params.id",
        [req.params.id]
      );
      console.log(reviews);
  
      res.status(200).json({
        status: "succes",
        data: {
          restoran: restoran.rows[0],
          reviews: reviews.rows,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
  
  // Menambahkan nama,lokasi,harga kedalam teble restoran
  
  app.post("/api/v1/restoran", async (req, res) => {
    console.log(req.body);
  
    try {
      const results = await db.query(
        "INSERT INTO restoran (nama, location, price_range) values ($1, $2, $3) returning *",
        [req.body.nama, req.body.location, req.body.price_range]
      );
      console.log(results);
      res.status(201).json({
        status: "succes",
        data: {
          restoran: results.rows[0],
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
  
  // Update data restoran
  
  app.put("/api/v1/restoran/:id", async (req, res) => {
    try {
      const results = await db.query(
        "UPDATE restoran SET nama = req.body.nama, location = req.body.location, price_range = req.body.price_range where id = req.params.id returning *",
        [req.body.nama, req.body.location, req.body.price_range, req.params.id]
      );
  
      res.status(200).json({
        status: "succes",
        data: {
          retaurant: results.rows[0],
        },
      });
    } catch (err) {
      console.log(err);
    }
    console.log(req.params.id);
    console.log(req.body);
  });
  
  // Hapus isi table restoran by kondisi
  
  app.delete("/api/v1/restoran/:id", async (req, res) => {
    try {
      const results = db.query("DELETE FROM restoran where id = req.params.id", [
        req.params.id,
      ]);
      res.status(204).json({
        status: "sucess",
      });
    } catch (err) {restaurant
      console.log(err);
    }
  });
  
  //Menambahkan review restoran

  app.post("/api/v1/restoran/:id/addReview", async (req, res) => {
    try {
      const newReview = await db.query(
        "INSERT INTO reviews (restoran_id, nama, review, rating) values (req.params.id, req.body.nama, req.body.review, req.body.rating) returning *;",
        [req.params.id, req.body.nama, req.body.review, req.body.rating]
      );
      console.log(newReview);
      res.status(201).json({
        status: "success",
        data: {
          review: newReview.rows[0],
        },
      });
    } catch (err) {
      console.log(err);
    }
  });


//http://localhost:2023/2024/restoran

const port = process.env.port || 2024;
// NOTE : jika file env yang menyimpan alamat port tidak di temukan, maka akan membaca port sebagai 2024
app.listen(port, () => {
            console.log(`terhubung ke server port ${port}`);
    });