 shoppingCar = async (userId, orderId, orderData) => {
    //购物车删除
    let sqlDel = 'delete '
   await mysql.mysqlFunction(sql,[userId, orderId],(err, result) => {
        if (err) {
            changeState = 'fail';
            return err.message;
        } else {
            changeState = 'success'
        }
        res.json({
            ret: true,
            data: changeState,
            code: 200
        });
    });
    //订单导入
    let sqlImport = 'insert into '
    await mysql.mysqlFunction(sql,[],(err, result) => {
        if (err) {
            changeState = 'fail';
            return err.message;
        } else {
            changeState = 'success'
        }
        res.json({
            ret: true,
            data: changeState,
            code: 200
        });
    });
}
module.exports = shoppingCar;
