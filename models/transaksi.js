'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // menghubungkan tranksaksi ke -> customer
      this.belongsTo(models.customer,{
        foreignKey: "customer_id",
        as: "customer"
      })
      // menghubungkan transaksi ke -> detail_transaksi
      this.hasMany(models.detail_transaksi,{
        foreignKey: "transaksi_id",
        as: "detail_transaksi"
      })
    }
  };

  transaksi.init({
    transaksi_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: DataTypes.INTEGER,
    waktu: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'transaksi',
    // setting table name
    tableName: 'transaksi'
  });
  return transaksi;
};