const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Use the cors middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Sample data array
let dataArray = [
  { id: 1, name: "TODO THIS" },
  { id: 2, name: "FIX CAR" },
  { id: 3, name: "I DONT KNOW" },
];

// List all data
app.get("/api/data", (req, res) => {
  res.json(dataArray);
});

// Create new data
app.post("/api/data", (req, res) => {
  const newItem = req.body;
  newItem.id = dataArray.length ? dataArray[dataArray.length - 1].id + 1 : 1;
  dataArray.push(newItem);
  res.status(201).json(newItem);
});

// Update data
app.put("/api/data/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedItem = req.body;
  let itemFound = false;

  dataArray = dataArray.map((item) => {
    if (item.id === id) {
      itemFound = true;
      return { ...item, ...updatedItem };
    }
    return item;
  });

  if (itemFound) {
    res.json({ id, ...updatedItem });
  } else {
    res.status(404).send("Item not found");
  }
});

// Remove data
app.delete("/api/data/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = dataArray.length;

  dataArray = dataArray.filter((item) => item.id !== id);

  if (dataArray.length < initialLength) {
    res.status(204).send(); // No content
  } else {
    res.status(404).send("Item not found");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
