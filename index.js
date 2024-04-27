const express = require("express");
const db = require("./database");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Book API 1.0.0")
  })

app.post("/book", (req, res) => {
  const { name, author } = req.body;
  console.log(name);
  db.query(
    "INSERT INTO book (name, author) VALUES (?, ?)",
    [name, author],
    (error, results) => {
      if (error) res.status(404).send({"message" : "name and author is required"});
      res.send({ id: results.insertId, name, author });
    }
  );
});

app.get("/book", (req, res) => {
  db.query("SELECT * FROM book", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/book/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM book WHERE id = ?", [id], (error, results) => {
    if (error) throw error;
    if (results.length > 0) res.send(results[0]);
    else res.status(404).send("Book not found");
  });
});


app.put("/book/:id", (req, res) => {
  const { id } = req.params;
  const { name, author } = req.body;
  db.query(
    "UPDATE book SET name = ?, author = ? WHERE id = ?",
    [name, author, id],
    (error, result) => {
      if (error) throw error;
      if (result.affectedRows === 0) res.status(404).send("Book not found");
      else res.send({ id, name, author });
    }
  );
});


app.delete("/book/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM book WHERE id = ?", [id], (error, result) => {
    if (error) throw error;
    if (result.affectedRows === 0) res.status(404).send("Book not found");
    else res.send({ message: "Book deleted" });
  });
});


app.listen(port, () => {
  console.log(`Note app listening at http://localhost:${port}`);
});