const express = require("express")
const app = express()

//import modul
const customer = require("./router/customer")
const transaksi = require("./router/transaksi")
const product = require("./router/product")

//menggunakan modul
app.use("/customer", customer)
app.use("/transaksi", transaksi)
app.use("/product", product)

app.listen(4000, ()=>{
    console.log("server run on port 4000");
})