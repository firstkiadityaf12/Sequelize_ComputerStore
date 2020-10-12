const express = require("express")
const app = express()
const multer = require('multer')

//memanggil index model
const models = require("../models/index")
const product = models.product

//mengambil file system
const path = require('path')
// untuk manajemen file
const fs = require('fs')

//membuat variabel untuk konfigurasi proses upload file
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        //set file storage
        cb(null, './image')
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})
//upload file
let upload = multer({storage: storage})

//endpoin GET all
app.get("/", (req,res) => {
    // ambil data
    product.findAll()
    .then(result =>{
        res.json({
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message 
        })
    })
})

//endpoint GET by Id
app.get("/:product_id", (req,res) => {
    // ambil data by id
    let param = {product_id: req.params.product_id}
    product.findOne({where: param})
    .then(result =>{
        res.json({
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message 
        })
    })
})

//endpoint POST
app.post("/", upload.single("image"), (req,res) => {
    if (!req.file) {
        res.json({
            message: "no uploaded file"
        })
    } else {
        let data = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file.filename
        }
        // insert data
        product.create(data)
        .then(result => {
            res.json({
                message : "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    }
})

//endpoint mengupadate data
 app.put("/", upload.single("image"), async(req, res)=>{
     //mengupdate data
     let param = { product_id : req.params.product_id}
     let data = {
         name : req.body.name,
         price : req.body.price,
         stock : req.body.stock
    }
    if(!req.file){
        //mendapatkan data by id
        const row = await product.findOne({where: param})
        let oldFileName = row.image

        //mengapus file lama
        let dir = path.join(__dirname,"../image", oldFileName)
        fs.unlink(dir, err => console.log(err))

        // set new filename
        data.image = req.file.filename
    }

    //mengupdate data
    product.update(data)
    .then(result => {
        res.json({
            message: "data has inserted"
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//endpoin DELETE => menghapus data
app.delete("/:product_id", async (req, res) => {
    //menggunakan try dan catch
    try {
        let param = { product_id: req.params.product_id}
        let result = await product.findOne({where: param})
        let oldfilename = result.image

        //hapus dari lokasi file lama
        let dir = path.join(__dirname,"../image", oldfilename)
        fs.unlink(dir, error => console.log(error))

        //hapus data
        product.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been delete"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    } catch ( error ){
        res.json({
            message: error.message
        })
    }
})

//export data module
module.exports=app

