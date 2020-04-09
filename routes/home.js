const express = require('express')
const mysqli = require('../db/index')
const Result = require('../model/Result')
const router = express.Router()
router.get('/home', (req,res)=>{
    const sql = 'select * from v_Advertisement';
    const menuList = [{
        "id": "0001",
        "title": "雕塑手办",
        "chlidren": [{
          "id":"0001",
          "title": "大型雕塑"
        }, {
         "id":"0001",
         "title": "中型雕塑"
        }, {
         "id":"0003",
         "title": "限定手办"
        }, {
         "id":"0004",
         "title": "迷你手办"
        }, {
         "id":"0005",
         "title": "手办"
        }]
        }, {
        "id": "0002",
        "title": "毛绒玩偶",
        "chlidren":[{
          "id":"0001",
          "title": "帽子"
        }, {
          "id":"0002",
          "title": "玩偶"
        }]
        }, {
        "id": "0003",
        "title": "男女服饰",
        "chlidren":[{
          "id":"0001",
          "title": "卫衣&夹克"
        }, {
          "id":"0002",
          "title": "T恤"
        }, {
          "id":"0003",
          "title": "其他"
        }]
        }, {
        "id": "0004",
        "title": "赛事周边",
        "chlidren":[{
          "id":"0001",
          "title": "LPL X NIKE"
        }, {
          "id":"0002",
          "title": "LPL其他"
        }]
        }, {
        "id": "0005",
        "title": "珠宝首饰",
        "chlidren":[{
          "id":"0001",
          "title": "项链"
        }, {
          "id":"0002",
          "title": "幸运珠"
        }, {
          "id":"0003",
          "title": "手链"
        }, {
          "id":"0004",
          "title": "配件"
        }]
        }, {
       "id": "0006",
       "title": "其他",
       "chlidren":[{
         "id":"0001",
         "title": "手机壳"
       }, {
         "id":"0002",
         "title": "鼠标垫"
       }, {
         "id":"0003",
         "title": "艺术海报"
       }, {
         "id":"0004",
         "title": "其他"
       }]
      }]
    // "user_Img": 用户头像图片,
    // "user_Id": 请求的用户的ID,
    // "user_Name": 请求的用户的名字,
    // "user_Sex": 请求的用户的性别,
    // "user_Age": 请求的用户的年龄,
    // "user_Address": 请求的用户的地址,
    // "user_Telephone": 请求的用户的电话号码,
    //先看下查出来的是什么东西然后再进行导入,上面的是导入的格式
    // userFriendList = result.  //好友列
    mysqli.exec({
        sql: sql,
        success: resulte => {
            if (resulte.length != 0) {
                // res.json({
                //     ret: true,
                //     data: resulte,
                //     code: 200
                // });
                new Result(resulte, '操作成功', {
                    ret: true
                }).success(res)
            } else {
                // res.json({
                //     ret: false,
                //     data: resulte,
                //     menuList,
                //     code: 200
                // });
                new Result(resulte, '操作失败', {
                    ret: false
                }).fail(res)
            }
        },
        error: err => {
            console.log('err:', err);
        }
    });
})

router.get('/getSeach', (req,res) =>{
  console.log(req.query)
  const sql = `select id, commodity_img as imgUrl , commodity_name as title , commodity_per as price , commodity_State as commodityState from v_commodity_data where commodity_Name like ? or commodity_Class like ?`;
  // "id": "0001", 商品id 
  // "imgUrl": "https://game.gtimg.cn/images/daojushop/zb/ad/201910/20191011101011_968962.jpg", 商品图片
  // "title": "LPL x NIKE联名新品", 商品名字
  // "size": "常规", 商品的型号
  // "price": "400", 商品价格
  // "number": 1,  商品数量
  mysqli.exec({
      sql: sql,
      params: [req.query.key, req.query.key, req.query.key],
      success: resulte => {
          console.log(resulte)
          datapool = resulte
        res.json({
          ret: true,
          code: 200,
          data: datapool
        })
      },
      error: err => {
          console.log('err:', err);
      }
  });
})

module.exports = router