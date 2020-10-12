const express = require("express")
const multer = require("multer")
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi
const app = express()

//mengaktifkan untuk membaca data yang di request melalui body
app.use(express.urlencoded({extended: true}))

//endpoint mengambil semua
app.get("/", async (req,res)=>{
    let data = await transaksi.findAll({
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ] 
    })
    res.json({
        data: data
    })
})

//endpoint GET by id
app.get("/:transaksi_id", async (req, res) => {
    //mengambil data berdasarkan id
    let param = {transaksi_id: req.params.transaksi_id}
    let data = await transaksi.findOne({
        where: param,
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})

//endpoint POST di transaksi
app.post("/", async (req, res) => {
    //insert data
    //menampung dtaa
    let data = {
        customer_id : req.body.customer_id,
        waktu : req.body.waktu
    }
    //proses tambah data
    transaksi.create(data)
    .then(result => {
        //ambil data dari transaksi id
        let transaksi_id = result.transaksi_id
        let detail = JSON.parse(req.body.detail_transaksi)

        //proses menyisipkan transaksi id
        detail.forEach(element => {
            element.transaksi_id = transaksi_id
        });

        // proses insert data ke detail_transaksi
        // create -> dibuat utk insert 1 data / row
        // bulkCreate-> dibuat utk insert multiple data/row
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//endpoint PUT untuk update data
app.put("/", async (req, res) => {
    //menampung data
    let data = {
        customer_id : req.body.customer_id,
        waktu : req.body.waktu
    }

    //mencari id params
    let param = {
        transaksi_id : req.body.transaksi_id
    }

    //insert data baru
    transaksi.update(data, {where: param})
    .then(result => {
        //hapus data di detail
        detail_transaksi.destroy({where: param}).then().catch()

        //ambil dta dari transaksi
        let transaksi_id = param.transaksi_id
        let detail = JSON.parse(req.body.detail_transaksi)

        //proses menyisipkan transaksi id
        detail.forEach(element => {
            element.transaksi_id = transaksi_id
        });

        // proses insert data ke detail_transaksi
        // create -> dibuat utk insert 1 data / row
        // bulkCreate-> dibuat utk insert multiple data/row
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//endpoint DELETE
app.delete("/:transaksi_id", async (req,res) => {
    //delete data
    //menampung transaksi_id
    let param = { transaksi_id: req.params.transaksi_id }
    //menggunakan try untuk mendelete
    try {
        //hapus detail transaksi
        await detail_transaksi.destroy({where: param})
        
        //hapus yang ada di transaksi
        await transaksi.destroy({where: param})

        //mencetah data
        res.json({
            message: "data has been delete"
        })
    }
    catch(error){
        res.json({
            message: error.message
        })
    }
})

//export data module
module.exports=app
