module.exports = (sequelize, DataType) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: DataType.INTEGER,
    total: DataType.DECIMAL(10, 2),
    delivery: DataType.DATEONLY,
    id_user: DataType.INTEGER
  }, {
    tableName: 'order',
    timestamps: false
  })
  return Order
}