const express = require('express');
const mysqli = require('../db/index');
const { md5, decoded, aesEncryption, aesDecryption} = require('../utils/index');
const { JWT_EXPIRED, PWD_SALT, PRIVATE_KEY } = require('../utils/constant');
const fs = require('fs');
const path = require('path');
const boom = require('boom');
const static = require('../staticDataPool');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Result = require('../model/Result');
const area = require('../public/area');
const router = express.Router();
let {USER_FRIENDLIST} = require('../utils/constant')

router.get('/drt', (req, res) => {
    res.cookie('token', 111, { Path: '/' , maxAge: 60 * 60 * 24, httpOnly: true })
    res.send('设置Cookie')
})
router.post('/postUserInformation', (req, res) => {
    console.log(req.body);
    const userRegisterData = req.body.data
    let request = '',
        actionState = true,  //注册动作是否合格状态
        //判断是登录还是注册
        //如果是注册则从数据池中对比注册的电话号码是否已存在
        sql = `insert into t_user_data(user_id,user_name,user_sex,user_age,user_address,user_telephone,user_password,user_perpassword,user_img,user_FriendList) values (null,?,'男',0,'北京市 北京市 朝阳区',?,?,?,'userHeader/defalut.jpg',9)`;
        static.interface_replace_Data_User.forEach(element => {
            if (userRegisterData.telephone == element.user_telephone) {
                return actionState = false;
            } else {
                static.interface_replace_Data_User.push(userRegisterData.telephone)
            }
        })
    if (actionState) {
        let resiter_id = 0
        mysqli.exec({
            sql: sql,
            params: [userRegisterData.name, userRegisterData.telephone, userRegisterData.password, userRegisterData.passwordPer],
            success: resulte => {
                resiter_id = resulte.insertId
                data = 'success';
                new Result(data, 'success', {
                    ret: true,
                    code: 200
                }).success(res)
                const staticFile = '{"userId": []}'
                existsSync = () => {
                    console.log('创建')
                    const exists = fs.existsSync(path.join(__dirname, '..', 'public', resiter_id + '.json'));
                    if (!exists) {
                        const Establish = fs.writeFile(path.join(__dirname, '..', 'public', resiter_id + '.json'), staticFile, (err) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                }
                existsSync();
                sql = 'select user_FriendList from t_user_data where user_telephone = 0'
                mysqli.exec({
                    sql: sql,
                    success: resulte => {
                        let user_FriendListId = resulte[0].user_FriendList.split(',');
                        user_FriendListId.push(resiter_id)
                        user_FriendListId = user_FriendListId.join(',')
                        sql = 'update t_user_data set user_FriendList = ? where user_telephone = 0'
                        mysqli.exec({
                            sql: sql,
                            params: [user_FriendListId],
                            success: resulte => {
                            },
                            error: err => {
                                if (err) {
                                  console.log('err:', err);
                                }
                            }
                        });
                    },
                    error: err => {
                        if (err) {
                          console.log('err:', err);  
                        }
                    }
                });
            },
            error: err => {
                console.log('err:', err);
            }
        });
    } else {
        request = 'fail';
        new Result(null, 'fail', {
            code: 204,
            ret: false
        }).fail(res)
    }
})
router.get('/getverificationToken', (req, res) => {
  const decode = decoded(req)
  const data = ''
  if (decode) {
    new Result(data, 'success').success(res)
  } else {
    new Result('fail').fail(res)
  }
})
// 登录
router.post('/getUserInformation', 
[
  body('account').isNumeric().withMessage('账号必须为数字'),
  body('password').isString().withMessage('密码必须为字符')
],
(req, res, next) => {
    console.log(req.body.account);
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{msg}] = err.errors
      next(boom.badRequest(msg))
    } else {
        const { account, password } = req.body
        const sql = 'select user_Id from t_user_data where user_telephone = ? and user_password = ?';
        mysqli.exec({
            sql: sql,
            params: [account, password],
            success: resulte => {
                if (resulte.length != 0) {
                    mysqli.exec({
                      sql: 'update t_user_data set user_implementation = now() where user_id = ?',
                      params: [resulte[0].user_Id]
                    })
                    const currUserId = JSON.stringify(resulte[0].user_Id)
                    const token = jwt.sign(
                      {currUserId},
                      PRIVATE_KEY,
                      {expiresIn: JWT_EXPIRED}
                    )
                    console.log(token)
                    res.cookie('token', token, { Path: '/' ,  domain: '192.168.43.102',maxAge: 60 * 60 * 24, httpOnly: true })
                    new Result({token}, '登录成功',{
                      ret: true
                    }).success(res)
                } else {
                    new Result('','登录失败',{
                        ret: false,
                        code: 200
                    }).fail(res)
                }
            },
            error: err => {
                console.log('err:', err);
            }
        });
    }
})
router.get('/getUserInformation', (req, res, next) => {
  const sql = 'select user_Id,user_Name,user_Sex,user_Age,user_Address,user_Telephone,user_Img,role from t_user_data where user_Id = ?'
  const decode = decoded(req)
  console.log(decode)
  if (decode && decode.currUserId) {
    mysqli.exec({
      sql: sql,
      params: [decode.currUserId],
      success: resulte => { 
        resulte[0].roles = [ resulte[0].role ]
        if (resulte) {
          new Result(resulte, 'success', {
            ret: true,
            code: 200
          }).success(res)
        } else {
          new Result(resulte, 'fail', {
            ret: false,
            code: 200
          }).fail(res)
        }
      }
    })
  }
})
// //用户头像采用路径
router.post('/postChangePirvateInformation', (req, res) => {
    const decode = decoded(req)
    const sql = 'update t_user_data set user_Name = ? , user_Sex = ?, user_Age = ?, user_Address = ?, user_Telephone = ?, user_img = ? where user_Id = ?';
    if (decode && decode.currUserId) {
        if (req.body.user_Img.indexOf('base64') !== -1) {
            const base64 = req.body.user_Img.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
            const dataBuffer =  Buffer.from(base64, 'base64'); //把base64码转成buffer对象
            console.log(dataBuffer)
            fs.writeFile(path.join(__dirname, '../','public', 'userHeader', decode.currUserId+'.jpg'), dataBuffer, function (err) {//用fs写入文件
                if (err) {
                    console.log(err);
                } else {
                    console.log('写入成功！');
                }
            });
        }
        mysqli.exec({
            sql: sql,
            params: [req.body.user_Name, req.body.user_Sex, req.body.user_Age, req.body.user_Address, req.body.user_Telephone, `userHeader/` + decode.currUserId + `.jpg`, decode.currUserId],
            success: resulte => {
                if (resulte.length != 0) {
                  const data = {
                    "user_Img": req.body.user_Img,
                    "user_Id": req.body.user_Id,
                    "user_Name": req.body.user_Name,
                    "user_Sex": req.body.user_Sex,
                    "user_Age": req.body.user_Age,
                    "user_Address": req.body.user_Address,
                    "user_Telephone": req.body.user_Telephone
                  }
                  new Result(data, 'success', {
                    ret: true,
                    code: 200
                  }).success(res)
                } else {
                    new Result('', 'fail', {
                        ret: false,
                        code: 200
                    }).fail(res)
                }
            },
            error: err => {
                console.log('err:', err);
            }
        });
    }
})
router.get('/getFriend', (req,res)=>{
    const sql = 'select user_Id,user_Name,user_Sex,user_Age,user_Address,user_Telephone,user_Img from t_user_data where user_Telephone = ?';
    // "user_Img": 用户头像图片,
    // "user_Id": 请求的用户的ID,
    // "user_Name": 请求的用户的名字,
    // "user_Sex": 请求的用户的性别,
    // "user_Age": 请求的用户的年龄,
    // "user_Address": 请求的用户的地址,
    // "user_Telephone": 请求的用户的电话号码,
    //先看下查出来的是什么东西然后再进行导入,上面的是导入的格式
    // userFriendList = result.  //好友列
    const decode = decoded(req) 
    if (decode && decode.currUserId) {
        mysqli.exec({
            sql: sql,
            params: [req.query.selectAccountNumber],
            success: resulte => {
                if (resulte && resulte.length != 0) {
                    let data = resulte
                    mysqli.exec({
                        sql: `select user_FriendList from t_user_data where user_id = ${decode.currUserId}`,
                        success: resulte => {
                          resulte = resulte[0].user_FriendList.split(',')
                          //true表示已经添加为好友， false表示未添加为好友
                          if (resulte.some(e => e == (data[0].user_Id)) || data[0].user_Id == decode.currUserId) {
                              data[0].state = true
                          } else {
                              data[0].state = false                
                          }
                          data[0].user_Id = aesEncryption(JSON.stringify(data[0].user_Id))
                          new Result(data, 'success', {
                            ret: true,
                            code: 200
                          }).success(res)
                        },
                        error: err => {
                            console.log(err)
                        }
                    })
                } else {
                    new Result(null, 'success', {
                        ret: false,
                        code: 204
                    }).success(res)   
                }
            },
            error: err => {
                if (err) {
                    console.log('err:', err);
                    new Result(err, 'fail', {
                        ret: false,
                        code: 204
                    }).fail(res)    
                }
            }
        });
    }
})
router.post('/postFriend', (req,res)=>{
    let sql = 'select * from t_user_data where user_Id = ?';
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
        params: [req.body.userId],
        success: resulte => {
            console.log(resulte[0].user_FriendList.split(','))
            console.log(resulte)
            let friendList = resulte[0].user_FriendList.split(',')
            friendList.push(req.body.firendId)
            friendList = friendList.join(',')
            console.log(friendList)
            sql = `update t_user_data set user_FriendList = ? where user_id = ?`
            mysqli.exec({
                sql: sql,
                params: [friendList,req.body.userId],
                success: resulte => {
                    res.json({
                        ret: true,
                        code: 200
                    });
                },
                error: err => {
                    console.log('err:', err);
                }
            });
        },
        error: err => {
            console.log('err:', err);
        }
    });
})
router.get('/getUserColloection', (req, res) => {
    const decode = decoded(req)
    let sql = `select id , commodity_img as 'imgUrl', commodity_per as 'price', commodity_name as 'title', commodity_Class as commodity_Class from v_collocetion where colloection_userid = ? `;
    if (req.query.commodityClass) {
        sql = `select id , commodity_img as 'imgUrl', commodity_per as 'price', commodity_name as 'title', commodity_Class as commodity_Class from v_collocetion where colloection_userid = ? and commodity_class = '${req.query.commodityClass}'`;
    }
    if (decode && decode.currUserId) {
        console.log(decode.currUserId)
        mysqli.exec({
            sql: sql,
            params: [decode.currUserId],
            success: resulte => {
                if (resulte.length != 0) {
                    // res.json({
                    //     ret: true,
                    //     data: resulte,
                    //     code: 200,
                    //     colloectionImg: colloectionImg
                    // });
                    new Result(resulte, 'success', {
                      ret: true,
                      code: 200
                    }).success(res)
                } else {
                    // res.json({
                    //     ret: false,
                    //     data: resulte,
                    //     code: 200
                    // })
                    new Result(resulte, 'fail', {
                        ret: false,
                        code: 200
                      }).fail(res)
                }
            },
            error: err => {
                console.log('err:', err);
            }
        });        
    }

})
router.post('/postUserColloection', (req, res) => {
    console.log(req.body);
    const decode = decoded(req)
    if (decode && decode.currUserId) {
        if (req.body.actionStyle == 'del') {
            sql = 'delete from t_user_colloection where colloection_userid = ? and colloection_commodity = ?';
            req.body.colloectionList.forEach((e, i) => {
                mysqli.exec({
                    sql: sql,
                    params: [decode.currUserId, e.id],
                    success: resulte => {
                        if (i == req.body.colloectionList.length - 1) {
                            const data = true
                            new Result(data, 'success', {
                                ret: true,
                                code: 200
                            }).success(res)
                        }
                    },
                    error: err => {
                        console.log('err:', err);
                        if (err) {
                            const data = false
                            new Result(data, 'success', {
                                ret: false,
                                code: 204
                            }).fail(res)
                        }
                    }
                });
            })
        } else {
            const sql = `select * from t_user_colloection where colloection_userid = ? and colloection_commodity = ?`;
            mysqli.exec({
                sql: sql,
                params: [decode.currUserId, req.body.commodity],
                success: resulte => {
                    if (resulte.length != 0) {
                        const sql = `delete  from t_user_colloection where colloection_userid = ? and colloection_commodity = ?`;
                        mysqli.exec({
                            sql: sql,
                            params: [decode.currUserId, req.body.commodity],
                            success: resulte => {
                                const data = true
                                new Result(data, 'success', {
                                    ret: true,
                                    code: 200
                                }).success(res)
                            },
                            error: err => {
                                console.log('err:', err);
                                if (err) {
                                    const data = false
                                    new Result(data, 'success', {
                                        ret: false,
                                        code: 204
                                    }).fail(res)
                                }
                            }
                        });
                    } else {
                        const sql = `insert into t_user_colloection(colloection_id,colloection_userid,colloection_commodity,colloection_generateTime) values (null,?,?,now())`;
                        mysqli.exec({
                            sql: sql,
                            params: [decode.currUserId, req.body.commodity],
                            success: resulte => {
                                const data = true
                                new Result(data, 'success', {   
                                    ret: true,
                                    code: 200
                                }).success(res)
                            },
                            error: err => {
                                console.log('err:', err);
                                if (err) {
                                    const data = false
                                    new Result(data, 'success', {
                                        ret: false,
                                        code: 204
                                    }).fail(res)
                                }
                            }
                        });
                    }
                },
                error: err => {
                    console.log('err:', err);
                }
            });
        }        
    }
})
router.get('/getUserShoppingCar', (req, res) => {
    const sql = 'select id, shoppingCar_id, commodity_Img as imgUrl, commodity_Name as title, shoppingCar_Size as size, commodity_Per as price, shoppingCar_Number as number from v_shoppingCar where shoppingCar_UserId = ?';
    // "id": "0001", 商品id
    // "imgUrl": "https://game.gtimg.cn/images/daojushop/zb/ad/201910/20191011101011_968962.jpg", 商品图片
    // "title": "LPL x NIKE联名新品", 商品名字
    // "size": "常规", 商品的型号
    // "price": "400", 商品价格
    // "number": 1,  商品数量
    const decode = decoded(req)
    if (decode && decode.currUserId) {
        mysqli.exec({
            sql: sql,
            params: [decode.currUserId],
            success: resulte => {
                console.log(resulte)
                if (resulte.length != 0) {
                    res.json({
                        ret: true,
                        data: resulte,
                        code: 200
                    });
                } else {
                    res.json({
                        ret: false,
                        data: resulte,
                        code: 200
                    });
                }
            },
            error: err => {
                console.log('err:', err);
            }
        });        
    } else {
      new Result('jwtInvalid').fail(res) 
    }
})
// // 根据id修改，只修改用户表，先查后改
router.post('/postUserShoppingCar', (req, res) => {
    let sql = '';
    let orderIdlist = []
    const decode = decoded(req)
    if (decode && decode.currUserId) {
        if (req.body.actionStyle == 'check') {
            sql = 'insert into t_order_data(order_Id,order_Commodity,order_Number,order_Size,order_State,order_UserId,order_generateTime) values (null,?,?,?,?,?,now())';
            req.body.data.forEach((e, i) => {
                mysqli.exec({
                    sql: sql,
                    params: [e.id, e.number, e.size, '未支付', decode.currUserId],
                    success: resulte => {
                        console.log(orderIdlist)
                        orderIdlist.push(resulte.insertId)
                        if (i == req.body.data.length - 1) {
                            res.json({
                                ret: true,
                                code: 200,
                                orderIdlist: orderIdlist
                            })
                        }
                    },
                    error: err => {
                        console.log('err:', err);
                    }
                });
            });
        } else {
            if (req.body.actionStyle == 'del') {
                sql = 'delete from t_shopping_cart where shoppingCar_userid = ? and shoppingCar_Commodity = ?';
                req.body.data.forEach((e) => {
                    mysqli.exec({
                        sql: sql,
                        params: [decode.currUserId, e.id],
                        success: resulte => {
                        },
                        error: err => {
                            console.log('err:', err);
                        }
                    });
                })
            } else {
                sql = `select shoppingCar_Number from v_shoppingcar where shoppingCar_Size = ? and shoppingCar_UserId = ? and id = ?`;
                mysqli.exec({
                    sql: sql,
                    params: [req.body.informationCommodityData.size, decode.currUserId, req.body.informationCommodityData.commodityId],
                    success: resulte => {
                        if (resulte &&  resulte.length !== 0) {
                            const newNumber = resulte[0].shoppingCar_Number + parseInt(req.body.informationCommodityData.number)
                            sql = `update t_shopping_cart set  shoppingCar_Number = ? where shoppingCar_Commodity = ? and shoppingCar_Size = ? and shoppingCar_UserId = ?`;
                            mysqli.exec({
                                sql: sql,
                                params: [newNumber, req.body.informationCommodityData.commodityId, req.body.informationCommodityData.size, decode.currUserId],
                                success: resulte => {
                                    // res.json({
                                    //     ret: true,
                                    //     code: 200
                                    // })
                                    // const data = true
                                    new Result(data = true, 'success', {
                                        ret: true,
                                        code: 200
                                    }).success(res)
                                },
                                error: err => {
                                    console.log('err:', err);
                                    if (err) {
                                        const data = false
                                        new Result(data, 'success', {
                                            ret: false,
                                            code: 204
                                        }).fail(res)
                                    }
                                }
                            });
                        } else {
                            sql = `insert into t_shopping_cart(shoppingCar_id,shoppingCar_Commodity,shoppingCar_Number,shoppingCar_size,shoppingCar_UserId,shoppingCar_GenerateTime) values (null,?,?,?,?,now())`;
                            mysqli.exec({
                                sql: sql,
                                params: [req.body.informationCommodityData.commodityId, req.body.informationCommodityData.number, req.body.informationCommodityData.size, decode.currUserId],
                                success: resulte => {
                                    const data = true
                                    new Result(data, 'success', {
                                        ret: true,
                                        code: 200
                                    }).success(res)
                                },
                                error: err => {
                                    console.log('err:', err);
                                    if (err) {
                                        const data = false
                                        new Result(data, 'success', {
                                            ret: false,
                                            code: 204
                                        }).fail(res)
                                    }
                                }
                            });
                        }
                    },
                    error: err => {
                        console.log('err:', err);
                        if (err) {
                            const data = false
                            new Result(data, 'success', {
                                ret: false,
                                code: 204
                            }).fail(res)
                        }
                    }
                });
            }
        }        
    }
})
// //根据id查询,根据不同的返回数据调用不同的sql语句
router.get('/getUserOrderColumn', (req, res) => {
    let sql = ``
    const userOrderColumnInformation = {};
    if (req.query.action == 'pay') {
        sql = `select order_id as id ,commodity_img as imgUrl ,commodity_name as title ,  commodity_per as price , order_number as number, order_size as size from v_order where order_userid = ? and order_state = '未支付'`;
    } else if (req.query.action == 'Receiv') {
        sql = `select order_id as id ,commodity_img as imgUrl ,commodity_name as title ,  commodity_per as price , order_number as number, order_size as size from v_order where order_userid = ? and order_state = '待收货'`;
    } else {
        sql = `select order_id as id ,commodity_img as imgUrl ,commodity_name as title ,  commodity_per as price , order_number as number, order_size as size from v_order where order_userid = ? and order_state = '待评论'`;
    }
    const  decode = decoded(req)
    if (decode && decode.currUserId) {
        mysqli.exec({
            sql: sql,
            params: [decode.currUserId],
            success: resulte => {
                if (resulte &&  resulte.length != 0) {
                    resulte[0].id = aesEncryption(JSON.stringify(resulte[0].id))
                    res.json({
                        ret: true,
                        data: resulte,
                        code: 200
                    });
                } else {
                    res.json({
                        ret: false,
                        data: resulte,
                        code: 200
                    });
                }
            },
            error: err => {
                if (err) {
                  console.log('err:', err);  
                }
            }
        });        
    }
})
// //根据id修改,根据不同的返回数据调用不同的sql语句
router.post('/postUserOrderColumn', (req, res) => {
    let sql = '',
        params = [],
        returnVal = '';
    const decode = decoded(req)
    if (typeof(req.body.orderId) != "String") {
        req.body.orderId = JSON.stringify(req.body.orderId)
    }
    if (decode && decode.currUserId) {
        if (req.body.action == 'delpay') {
            sql = 'delete from t_order_data where order_userid = ? and  order_Id= ?';
            params = [decode.currUserId, aesDecryption(req.body.orderId)];
            returnVal = aesDecryption(req.body.orderId)
            mysqli.exec({
                sql: sql,
                params: params,
                success: resulte => {
                    const data = {
                        orderNumber: returnVal
                    }
                    console.log()
                    new Result(data, 'success', {
                        ret: true,
                        code: 200
                    }).success(res)
                },
                error: err => {
                    console.log('err:', err);
                }
            });
        } else {
            sql = `insert into t_order_data(order_Id,order_Commodity,order_Number,order_Size,order_State,order_UserId,order_generateTime) values (null,?,?,?,'未支付',?,now())`
            params = [req.body.commodity.commodityId, req.body.commodity.number, req.body.commodity.size, decode.currUserId]
            mysqli.exec({
                sql: sql,
                params: params,
                success: resulte => {
                    // res.json({
                    //     ret: true,
                    //     code: 200,
                    //     orderNumber: resulte.insertId
                    // })
                    console.log(resulte.insertId)
                    resulte.insertId = JSON.stringify(resulte.insertId)
                    const data = {
                        orderNumber: resulte.insertId
                    }
                    new Result(data, 'success', {
                        ret: true,
                        code: 200
                    }).success(res)
                },
                error: err => {
                    if (err) {
                        console.log('err:', err);
                        new Result(err, 'fail', {
                            ret: false,
                            code: 204
                        }).fail(res)
                    }
                }
            });
        }        
    }
})
router.get('/getOrderDetalis', (req, res) =>{
    console.log(req.query)
    const decode = decoded(req)
    if (decode && decode.currUserId) {
      const sql = `select telephonNumber,addressDetalis,contacts,orderDetalisNumber,orderDetalisSize,orderDetalistTitle,orderDetalistImg,orderDetalisPrice  from v_orderDetallis where user_id = ? and order_id = ?`
      mysqli.exec({
        sql: sql,
        params: [decode.currUserId, aesDecryption(req.query.payId)],
        success: resulte => {
            console.log(resulte)
            const data =  {
              orderDetalisNumber: resulte[0].orderDetalisNumber,
              orderDetalistImg: resulte[0].orderDetalistImg,
              orderDetalistTitle: resulte[0].orderDetalistTitle,
              orderDetalisPrice: resulte[0].orderDetalisPrice,
              orderDetalisSize: resulte[0].orderDetalisSize,
              orderDetalisPriceSum: resulte[0].orderDetalisNumber * resulte[0].orderDetalisPrice,
              orderDetalisAddress: `[{"addressDetalis": ${'"'+ resulte[0].addressDetalis+ '"'},"contacts": ${'"' + resulte[0].contacts + '"'},"telephonNumber": ${resulte[0].telephonNumber}}]`
            }
            // res.json({
            //   ret: true,
            //   code: 200,
            //   data: orderDetaillsInformation
            // })
            new Result(data, 'success', {
                ret: true,
                code: 200
            }).success(res)
        },
        error: err => {
          console.log('err:', err);
        }
        });
    }
})
router.post('/postOrderDetalis', (req, res) =>{
    console.log(req.body)
    const decode = decoded(req)
    if (decode && decode.currUserId) {
        sql = `update t_order_data set  order_Number = ${req.body.orderInformation.orderDetalisNumber} , order_Size = '${req.body.orderInformation.orderDetalisSize}'  where order_userid = ${decode.currUserId} and order_id = ${aesDecryption(req.body.orderId)};`
        mysqli.exec({
            sql: sql,
            success: resulte => {
                console.log(resulte)
                if (resulte) {
                new Result('','success', {
                    ret: true,
                    code: 200
                }).success(res)
                }
            },
            error: err => {
                console.log('err:', err);
            }
        });
    }
})
router.get('/getEmitAddress', (req,res)=>{
    const sql = `select telephone, addressReceiv, addressReceivDetallis, receiveName from v_address where user_id = ? and order_id = ?`
    const decode = decoded(req)
    console.log(11111, req.query)
    console.log(aesDecryption(req.query.payId),11111)
    if (decode && decode.currUserId) {
        mysqli.exec({
            sql: sql,
            params: [decode.currUserId, aesDecryption(JSON.stringify(req.query.payId))],
            success: resulte => {
                let areaCode = '',country = '',city = '',county = '';
                if (resulte[0].addressReceiv !== ''){
                    for(let i in area.county_list) {
                        if (area.county_list[i] == resulte[0].addressReceiv.split(' ')[2]){
                        areaCode  = i
                        }
                    }
                    country = resulte[0].addressReceiv.split(' ')[1]
                    city = resulte[0].addressReceiv.split(' ')[1]
                    county = resulte[0].addressReceiv.split(' ')[1]
                }
                const data = {
                    addressDetail: resulte[0].addressReceivDetallis,
                    areaCode,
                    city,
                    country,
                    county,
                    name: resulte[0].receiveName,
                    province: resulte[0].addressReceiv.split(' ')[0],
                    tel: resulte[0].telephone,
                }
                new Result(data, 'success', {
                    ret: true,
                    code: 200
                }).success(res)
            },
            error: err => {
                console.log('err:', err);
            }
        });        
    }
  });
router.post('/postEmitAddress' ,(req, res) =>{
    const decode = decoded(req)
    if (decode && decode.currUserId) {
        const sql = `update address set  receiveName = ?, telephone = ? , addressReceiv = ? , addressReceivDetallis = ? where user_id = ?  and order_id = ?;`
        const  addressReceivInformation = req.body.emitAddressInformation.province + ' ' + req.body.emitAddressInformation.city + ' ' + req.body.emitAddressInformation.county
        mysqli.exec({
            sql: sql,
            params: [req.body.emitAddressInformation.name, req.body.emitAddressInformation.tel, addressReceivInformation, req.body.emitAddressInformation.addressDetail, decode.currUserId, aesDecryption(req.body.payId)],
            success: resulte => {
              if (resulte) {
                new Result(true,'success', {
                    ret: true,
                    code: 200
                }).success(res)
              }
            },
            error: err => {
                if (err) {
                  console.log('err:', err);  
                }
            }
        });
    }
})
// //下面这个是将用户传输过来的支付密码进行判定
router.post('/postUserBillPay', (req, res) => {
    let sql = 'select user_perpassword from t_user_data where user_id = ?'
    req.body.orderId = aesDecryption(req.body.orderId)
    const decode = decoded(req)
    if (decode && decode.currUserId) {
        mysqli.exec({
            sql: sql,
            params: [decode.currUserId],
            success: resulte => {
                console.log(resulte[0].user_perpassword)
                if (resulte[0].user_perpassword == req.body.value) {
                    if (req.body.action == 'ShoppingCar' || req.body.action == 'pay') {
                        sql = `update t_order_data set order_State = '待收货' where order_id = ? and order_UserId = ?`;
                    } else {
                        sql = `update t_order_data set order_State = '待评论' where order_id = ? and order_UserId = ?`;
                    }
                    if (typeof(req.body.orderId) == Array) {
                        req.body.orderId.forEach((e, i) => {
                            mysqli.exec({
                                sql: sql,
                                params: [e, decode.currUserId],
                                success: resulte => {
                                    if (i == req.body.orderId.length - 1) {
                                        // res.json({
                                        //     ret: true,
                                        //     code: 200
                                        // })
                                        const data = true
                                        new Result(data, 'success', {
                                            ret: true,
                                            code: 200
                                        }).success(res)
                                    }
                                },
                                error: err => {
                                    console.log('err:', err);
                                }
                            });
                        })                    
                    } else {
                        mysqli.exec({
                            sql: sql,
                            params: [req.body.orderId, decode.currUserId],
                            success: resulte => {
                                    // res.json({
                                    //     ret: true,
                                    //     code: 200
                                    // })
                                    const data = true
                                    new Result(data, 'success', {
                                        ret: true,
                                        code: 200
                                    }).success(res)
                            },
                            error: err => {
                                console.log('err:', err);
                            }
                        });
                    }
                } else {
                    const data = false
                    new Result(data, 'fail', {
                        ret: true,
                        code: 200
                    }).fail(res)
                }
            },
            error: err => {
                console.log('err:', err);
            }
        });        
    }
})
router.get('/getCommodity', (req, res) => {
    const sql = 'select id, commodity_img as imgUrl , commodity_name as title , commodity_per as price , commodity_img_hover as imgUrl1, commodity_Presonality, commodity_State as commodityState from v_commodity_data where id = ?';
    // "id": "0001", 商品id
    // "imgUrl": "https://game.gtimg.cn/images/daojushop/zb/ad/201910/20191011101011_968962.jpg", 商品图片
    // "title": "LPL x NIKE联名新品", 商品名字
    // "size": "常规", 商品的型号
    // "price": "400", 商品价格
    // "number": 1,  商品数量
    const decode = decoded(req)
    mysqli.exec({
        sql: sql,
        params: [req.query.commodityId],
        success: resulte => {
            let commodityInformation = resulte
            if (decode && decode.currUserId) {
                const sql = `select * from t_user_colloection where colloection_userid = ? and colloection_commodity = ?`;
                mysqli.exec({
                    sql: sql,
                    params: [decode.currUserId,commodityInformation.id],
                    success: resulte => {
                        commodityInformation[0].newParam = 'conllectionState'
                        if (resulte.length != 0) {
                            commodityInformation[0].conllectionState = true
                        } else {
                            commodityInformation[0].conllectionState = false
                        }
                        // res.json({
                        //     ret: true,
                        //     data: commodityInformation,
                        //     code: 200
                        // });
                        const data = commodityInformation
                        new Result(data, 'success', {
                            ret: true,
                            code: 200
                        }).success(res)
                    },
                    error: err => {
                        console.log('err:', err);
                        if (err) {
                            new Result(null, 'fail', {
                                ret: false,
                                code: 204
                            }).fail(res)
                        }
                    }
                });
            } else {
                const data = commodityInformation
                new Result(data, 'success', {
                    ret: true,
                    code: 200
                }).success(res)
            }
        },
        error: err => {
            console.log('err:', err);
            if (err) {
                new Result(null, 'fail', {
                    ret: false,
                    code: 204
                }).fail(res)
            }
        }
    });
})
router.get('/getUserDialogues', (req, res) => {
    let user_FriendListObject = [];
    let = sql = 'select user_FriendList from t_user_data where user_id = ?'
    const decode = decoded(req)
    if (decode && decode.currUserId) {
        mysqli.exec({
            sql: sql,
            params: [decode.currUserId],
            success: resulte => {
                console.log(resulte)
                const user_FriendListId = resulte[0].user_FriendList.split(',');
                user_FriendListId.forEach(e => {
                    USER_FRIENDLIST.push({
                        id: e,
                        socket: ''
                    })
                    user_FriendListObject.push({
                        id: e
                    })
                })
                // 获取好友信息
                sql = 'select user_Id as id,user_Name as userName,user_Img as userRelationHeadImg from t_user_data where user_id = ?';
                let dialogueContentAll = []
                if (user_FriendListObject.length != 0) {
                    user_FriendListObject.forEach((e, i) => {
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
                            params: [e.id],
                            success: resulte => {
                                if (resulte.length !== 0) {
                                    resulte[0].id = aesEncryption(JSON.stringify(resulte[0].id))
                                    dialogueContentAll.push(resulte[0])
                                    if (i == user_FriendListObject.length - 1) {
                                        const data = dialogueContentAll
                                        console.log(data)
                                        new Result(data, 'success', {
                                            ret: true,
                                            code: 200
                                        }).success(res)
                                    }
                                }
                            },
                            error: err => {
                                console.log('err:', err);
                                if (err) {
                                    new Result(null, 'fail', {
                                        ret: false,
                                        code: 204
                                    }).fail(res)
                                }
                            }
                        });
                    })
                }
            },
            error: err => {
                console.log('err:', err);
                if (err) {
                    new Result(null, 'fail', {
                        ret: false,
                        code: 204
                    }).fail(res)
                }
            }
        });
    }
})
router.get('/dialogueBox', (req, res) => {
    req.query.objectUserId = aesDecryption(req.query.objectUserId)
    let userDialogues = [],
        returnDialoguesInformation = [],
        bulleList = [];
    const staticFile = '{"userId": []}', decode = decoded(req);
    if (decode && decode.currUserId) {
        existsSync = () => {
            const exists = fs.existsSync(path.join(__dirname, '..', 'public', decode.currUserId + '.json'));
            if (!exists) {
                console.log('创建')
                const Establish = fs.writeFile(path.join(__dirname, '..','public', JSON.parse(decode.currUserId) + '.json'), staticFile, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        }
        existsSync();
        userDialogues = fs.readFileSync(path.join(__dirname, '..', 'public', decode.currUserId + '.json'), 'utf-8', (err, data) => {
            if (err) {
                return err
            }
            return data
        })
        JSON.parse(userDialogues).userId.forEach((e, i) => {
            if (e.relationShipId == req.query.objectUserId) {
                returnDialoguesInformation = e.dialogueContent
            }
        })
        const sql = 'select user_Name,user_Img from t_user_data where user_Id = ?';
        // "user_Img": 用户头像图片,
        // "user_Id": 请求的用户的ID,
        // "user_Name": 请求的用户的名字,
        // "user_Sex": 请求的用户的性别,
        // "user_Age": 请求的用户的年龄,
        // "user_Address": 请求的用户的地址,
        // "user_Telephone": 请求的用户的电话号码,
        //先看下查出来的是什么东西然后再进行导入,上面的是导入的格式
        // userFriendList = result.  //好友列
        if (returnDialoguesInformation.length !== 0) {
            returnDialoguesInformation.forEach((e, i) => {
                mysqli.exec({
                    sql: sql,
                    params: [e.userId],
                    success: resulte => {
                        if (resulte.length != 0) {
                            let data =  {
                                "id": e.dialogueId,
                                "userName": resulte[0].user_Name,
                                "userHeadImg": resulte[0].user_Img,
                                "userDialogueContent": e.dialogueContent
                            }
                            if (e.userId == decode.currUserId) {
                                data.idntity = 'self'
                            } else {
                                data.idntity = 'others'
                            }
                            bulleList.push(data)
                            if (i == returnDialoguesInformation.length - 1) {
                                // res.json({
                                //     ret: true,
                                //     content: 'have',
                                //     data: bulleList,
                                //     code: 200
                                // });
                                const data = bulleList 
                                new Result(data ,'success', {
                                    ret: true,
                                    code: 200
                                }).success(res)
                            }
                        }
                    },
                    error: err => {
                        console.log('err:', err);
                        if (err) {
                            new Result(data ,'fail', {
                                ret: false,
                                code: 204
                            }).fail(res)
                        }
                    }
                });
            });
        } else {
            mysqli.exec({
                sql: sql,
                params: [req.query.objectUserId],
                success: resulte => {
                    if (resulte.length != 0) {
                        bulleList.push({
                            "id": null,
                            "userId": req.query.objectUserId,
                            "userName": resulte[0].user_Name,
                            "userHeadImg": resulte[0].user_Img,
                            "userDialogueContent": null
                        })
                        const data = bulleList 
                        new Result(data ,'success', {
                            ret: true,
                            code: 200
                        }).success(res)
                    }
                },
                error: err => {
                    console.log('err:', err);
                    if (err) {
                        new Result(data ,'fail', {
                            ret: false,
                            code: 204
                        }).fail(res)
                    }
                }
            });
        }        
    }
})

module.exports = router 