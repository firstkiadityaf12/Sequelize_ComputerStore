const express = require("express")
const multer = require("multer")
const model = require("../models/index")
const app = express()

//memanggil index model -> customer
const models = require("../models/index")
const customer = models.customer

//mengambil file system
const path = require('path')
//untuk menejemen file
const fs = require('fs')

//untuk konfigurasi proses upload file
const storage_customer = multer.diskStorage({
    destination : (req, file, cb) => {
        //set file
        cb(null, './image')
    },
    //generate file name
    filename: (req, file, cb) => {
        cb(null, "image-" + Date.now() + path.extname(file.originalname))
    }
})
//proses upload file
let upload = multer({storage: storage_customer})

//endpoint pertama GET -> find all
app.get("/", (req, res) => {
    //ambil data customer
    customer.findAll()
    .then(result => {
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

//endpoint GET by id customer
app.get("/:customer_id", (req,res) => {
    //mengambil fata by id
    let param = {customer_id: req.params.customer_id}
    customer.findOne({where: param})
    .then(result => {
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

//endpoint POST upload data
app.post("/", upload.single("image"), (req,res) => {
    if(!req.file){
        res.json({
            message: "No Upload File"
        })
    } else {
        let data = {
            name : req.body.name,
            phone : req.body.phone,
            address : req.body.address,
            image : req.file.filename
        }
        //menambahkan data
        customer.create(data)
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

//endpoint PUT mengupdate data
app.put("/", upload.single("image"), async(req, res)=>{
    //update data
    let param = { customer_id : req.params.customer_id}
    let data = {
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address
    }
    if (!req.file) {
        //mendapatkan id
        const row = await customer.findOne({where: param})
        let OldFileName = row.image

        //delete file lama
        let dir = path.join(__dirname,"../image", OldFileName)
        fs.unlink(dir, err => console.log(err))
    }

    //update data
    customer.update(data)
    .then(result => {
        res.json({
            message: "data has been update"
        })
    })
    .catch(error =>{
        res.json({
            message: error.message
        })
    })
})

//endpoint DELETE -> menghapus data
app.delete("/:customer_id", async (req, res) => {
    //delete datta
    try{
    let param = { customer_id: req.params.customer_id}
    let result = await customer.findOne({where: param})
    let OldFileName = result.image
    
    //menghapus file lama
    let dir = path.join(__dirname,"../image", OldFileName)
    fs.unlink(dir, error => console.log(error))
        
    //delete data
    customer.destroy({where: param})
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
    } catch (error){
        res.json({
            message: error.message
        })
    }
})


//export data module
module.exports=app