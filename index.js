import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.resolve();

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

async function asyncCall() {
  await mongoose.connect(
    process.env.CONNECTION_URL
  );
  console.log("Database Connect");
}
asyncCall();

const ProductData = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  info: String,
  category: String,
});
const Product = mongoose.model("Product", ProductData);

const ProductList = [];


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/HTML/home.html");
});

app.get("/addProduct", (req, res) => {
  res.sendFile(__dirname + "/HTML/addProduct.html");
});

app.get("/products", (req, res) => {
  console.log("Products Get Request");
  res.render("products", { productList: ProductList });
});

app.post("/products", (req, res) => {
  const productName = req.body.title;
  const productInfo = req.body.info;
  const productPrice = req.body.price;
  const productQuantity = req.body.quantity;
  const productCategory = req.body.category;

  const newProduct = new Product({
    name: productName,
    price: productPrice,
    quantity: productQuantity,
    info: productInfo,
    category: productCategory,
  });

  newProduct.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(ProductList);
    }
  });
  if (ProductList.indexOf(newProduct) == -1) {
    ProductList.push(newProduct);
    console.log("Product Saved");
  }
  res.render("products", { productList: ProductList });
});

app.listen(3000, () => {
  console.log("Server Running On port 3000");
});
