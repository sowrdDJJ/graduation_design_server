const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const async = require('async');
const MD5 = require('md5');
const mysqli = require('./mysql.js');
const static = require('./staticDataPool');
const shoppingCar = require('./shoppingCar');
const area = require('./public/area');
const session = require('express-session');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('./public'));
app.use(session({
    secret: '12345',
    cookie : {
      maxAge: 3600 * 1000,
      secure: true
    },
    name: 'app1',
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized: true
}))
static.transmission();
let user_FriendList = [];
app.all('*',function(req,res,next){
    //设置请求头
    //允许所有来源访问
    res.header('Access-Control-Allow-Origin', '*')
    //用于判断request来自ajax还是传统请求
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    //允许访问的方式
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    //修改程序信息与版本
    res.header('X-Powered-By', ' 3.2.1')
    //内容类型：如果是post请求必须指定这个属性
    res.header('Content-Type', 'application/json;charset=utf-8')
    res.header("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE")
    next()
  })
app.get('/home', (req,res)=>{
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
                res.json({
                    ret: true,
                    data: resulte,
                    code: 200
                });
            } else {
                res.json({
                    ret: false,
                    data: resulte,
                    menuList,
                    code: 200
                });
            }
        },
        error: err => {
            console.log('err:', err);
        }
    });
})
app.get('/homeCommodity', (req,res) => {
  console.log(req.query)
  const sql = 'select id, commodity_Name, commodity_Img, commodity_Per, commodity_State from v_commodity_data where id > ? and id < ?'
  mysqli.exec({
      sql: sql,
      params: [req.query.numberOne, req.query.numberTwo],
      success: resulte => {
        if (resulte.length != 0) {
          res.json({
              code: 202,
              data: resulte
          })
        } else {
            console.log(resulte)
            res.json({
                code: 204
            })
        }
      },
      error: err => {
          console.log(err)
      }
  })
})
//注册
app.post('/postUserInformation', (req, res) => {
    console.log(req.body);
    let request = '',
        actionState = true,  //注册动作是否合格状态
        //判断是登录还是注册
        //如果是注册则从数据池中对比注册的电话号码是否已存在
        sql = `insert into t_user_data(user_id,user_name,user_sex,user_age,user_address,user_telephone,user_password,user_perpassword,user_img,user_FriendList) values (null,?,'男',0,'北京市 北京市 朝阳区',?,?,?,'userHeader/defalut.jpg',9)`;
        JSON.parse(static.interface_replace_Data_User).forEach(element => {
        if (req.body.telephone == element.user_telephone) {
            return actionState = false;
        }
    })
    if (actionState) {
        let resiter_id = 0
        mysqli.exec({
            sql: sql,
            params: [req.body.name, req.body.telephone, req.body.password, req.body.passwordPer],
            success: resulte => {
                resiter_id = resulte.insertId
                request = 'success';
                res.json({
                    ret: true,
                    data: request,
                    code: 200
                });
                const staticFile = '{"userId": []}'
                existsSync = () => {
                    console.log('创建')
                    const exists = fs.existsSync(path.join(__dirname, 'public', resiter_id + '.json'));
                    if (!exists) {
                        const Establish = fs.writeFile(path.join(__dirname, 'public', resiter_id + '.json'), staticFile, (err) => {
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
                                console.log('err:', err);
                            }
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
    } else {
        request = 'fail';
        res.json({
            ret: true,
            data: request,
            code: 200
        });
    }
})
// 登录
app.post('/getUserInformation', (req, res) => {
    console.log(req.query.account);
    const sql = 'select user_Id,user_Name,user_Sex,user_Age,user_Address,user_Telephone,user_Img from t_user_data where user_telephone = ? and user_password = ?';
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
        params: [req.body.account, req.body.password],
        success: resulte => {
            if (resulte.length != 0) {
                if (!req.session.userInformation) {
                    req.session.userInformation = {}
                }
                mysqli.exec({
                  sql: 'update t_user_data set user_implementation = now() where user_id = ?',
                  params: [resulte[0].user_Id]
                })
                const currUserId = JSON.stringify(resulte[0].user_Id)
                console.log(currUserId)
                req.session.userInformation[currUserId] = MD5(currUserId);
                req.session.save
                console.log(req.session)
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
})
// //用户头像采用路径
app.post('/postChangePirvateInformation', (req, res) => {
    const sql = 'update t_user_data set user_Name = ? , user_Sex = ?, user_Age = ?, user_Address = ?, user_Telephone = ?, user_img = ? where user_Id = ?';
    const base64 = req.body.user_Img.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
    const dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象
    fs.writeFile(path.join(__dirname, 'public', 'userHeader', req.body.user_Id+'.jpg'), dataBuffer, function (err) {//用fs写入文件
        if (err) {
            console.log(err);
        } else {
            console.log('写入成功！');
        }
    });
    mysqli.exec({
        sql: sql,
        params: [req.body.user_Name, req.body.user_Sex, req.body.user_Age, req.body.user_Address, req.body.user_Telephone,`userHeader/` + req.body.user_Id + `.jpg` ,req.body.user_Id],
        success: resulte => {
            if (resulte.length != 0) {
                res.json({
                    ret: true,
                    data: {
                        "user_Img": req.body.user_Img,
                        "user_Id": req.body.user_Id,
                        "user_Name": req.body.user_Name,
                        "user_Sex": req.body.user_Sex,
                        "user_Age": req.body.user_Age,
                        "user_Address": req.body.user_Address,
                        "user_Telephone": req.body.user_Telephone
                    },
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
})
app.get('/getFriend', (req,res)=>{
    console.log(req.query.selectAccountNumber,11111);
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
    mysqli.exec({
        sql: sql,
        params: [req.query.selectAccountNumber],
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
})
app.post('/postFriend', (req,res)=>{
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
// //根据id查询
app.get('/getUserColloection', (req, res) => {
    console.log(req.query);
    const colloectionImg = [
        {
            "id": "0001",
            "class": "雕塑手办",
            "imgUrl": "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/201909/20190918215352_85132.big.jpg"
        }, {
            "id": "0002",
            "class": "毛绒玩偶",
            "imgUrl": "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/201907/20190723090952_54659.big.jpg"
        }, {
            "id": "0003",
            "class": "男女服饰",
            "imgUrl": "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/201909/20190927232417_15783.big.jpg"
        }, {
            "id": "0004",
            "class": "周边赛事",
            "imgUrl": "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/201910/20191010171219_30038.big.jpg"
        }, {
            "id": "0005",
            "class": "珠宝首饰",
            "imgUrl": "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/201911/20191110140102_88888.big.jpg"
        }, {
            "id": "0006",
            "class": "其他",
            "imgUrl": "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/201909/20190918190738_29365.big.jpg"
        }]
    const sql = `select id , commodity_img as 'imgUrl', commodity_per as 'price', commodity_name as 'title', commodity_Class as commodity_Class from v_collocetion where colloection_userid = ?`;
    mysqli.exec({
        sql: sql,
        params: [req.query.userId],
        success: resulte => {
            if (resulte.length != 0) {
                res.json({
                    ret: true,
                    data: resulte,
                    code: 200,
                    colloectionImg: colloectionImg
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
})
app.post('/postUserColloection', (req, res) => {
    console.log(req.body);
    if (req.body.actionStyle == 'del') {
        sql = 'delete from t_user_colloection where colloection_userid = ? and colloection_commodity = ?';
        req.body.colloectionList.forEach((e, i) => {
            mysqli.exec({
                sql: sql,
                params: [req.body.userId, e.id],
                success: resulte => {
                    if (i == req.body.colloectionList.length - 1) {
                        res.json({
                            ret: true,
                            code: 200
                        });
                    }
                },
                error: err => {
                    console.log('err:', err);
                }
            });
        })
    } else {
        const sql = `select * from t_user_colloection where colloection_userid = ? and colloection_commodity = ?`;
        mysqli.exec({
            sql: sql,
            params: [req.body.userId, req.body.commodity],
            success: resulte => {
                if (resulte.length != 0) {
                    const sql = `delete  from t_user_colloection where colloection_userid = ? and colloection_commodity = ?`;
                    mysqli.exec({
                        sql: sql,
                        params: [req.body.userId, req.body.commodity],
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
                } else {
                    const sql = `insert into t_user_colloection(colloection_id,colloection_userid,colloection_commodity,colloection_generateTime) values (null,?,?,now)`;
                    mysqli.exec({
                        sql: sql,
                        params: [req.body.userId, req.body.commodity],
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
                }
            },
            error: err => {
                console.log('err:', err);

            }
        });
    }
})
// //根据ID查询，查收藏栏
app.get('/getUserShoppingCar', (req, res) => {
    const sql = 'select id, shoppingCar_id, commodity_Img as imgUrl, commodity_Name as title, shoppingCar_Size as size, commodity_Per as price, shoppingCar_Number as number from v_shoppingCar where shoppingCar_UserId = ?';
    // "id": "0001", 商品id
    // "imgUrl": "https://game.gtimg.cn/images/daojushop/zb/ad/201910/20191011101011_968962.jpg", 商品图片
    // "title": "LPL x NIKE联名新品", 商品名字
    // "size": "常规", 商品的型号
    // "price": "400", 商品价格
    // "number": 1,  商品数量
    mysqli.exec({
        sql: sql,
        params: [req.query.userId],
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
})
// // 根据id修改，只修改用户表，先查后改
app.post('/postUserShoppingCar', (req, res) => {
    // {
    //     userId: 0,
    //     data: [
    //       {
    //         id: '0003',
    //         imgUrl: 'https://game.gtimg.cn/images/daojushop/zb/ad/201910/20191030093036_590932.jpg',
    //         title: '万圣节迷你套装',
    //         commodity_Class: '雕塑手办',
    //         price: '400',
    //         number: 1,
    //         state: true
    //       }
    //     ],
    //     actionStyle: 'check'
    //   }
    let sql = '';
    console.log(req.body)
    let orderIdlist = []
    if (req.body.actionStyle == 'check') {
        sql = 'insert into t_order_data(order_Id,order_Commodity,order_Number,order_Size,order_State,order_UserId,order_generateTime) values (null,?,?,?,?,?,now())';
        req.body.data.forEach((e, i) => {
            mysqli.exec({
                sql: sql,
                params: [e.id, e.number, e.size, '未支付', req.body.userId],
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
                    params: [req.body.userId, e.id],
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
                params: [req.body.informationCommodityData.size, req.body.userId, req.body.informationCommodityData.commodityId],
                success: resulte => {
                    console.log(resulte)
                    if (resulte.length != 0) {
                        const newNumber = resulte[0].shoppingCar_Number + parseInt(req.body.informationCommodityData.number)
                        sql = `update t_shopping_cart set  shoppingCar_Number = ? where shoppingCar_Commodity = ? and shoppingCar_Size = ? and shoppingCar_UserId = ?`;
                        mysqli.exec({
                            sql: sql,
                            params: [newNumber, req.body.informationCommodityData.commodityId, req.body.informationCommodityData.size, req.body.userId],
                            success: resulte => {
                                res.json({
                                    ret: true,
                                    code: 200
                                })
                            },
                            error: err => {
                                console.log('err:', err);
                            }
                        });
                    } else {

                        sql = `insert into t_shopping_cart(shoppingCar_id,shoppingCar_Commodity,shoppingCar_Number,shoppingCar_size,shoppingCar_UserId,shoppingCar_GennerateTime) values (null,?,?,?,?,now())`;
                        mysqli.exec({
                            sql: sql,
                            params: [req.body.informationCommodityData.commodityId, req.body.informationCommodityData.number, req.body.informationCommodityData.size, req.body.userId],
                            success: resulte => {
                                res.json({
                                    ret: true,
                                    code: 200
                                })
                            },
                            error: err => {
                                console.log('err:', err);
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
// //根据id查询,根据不同的返回数据调用不同的sql语句
app.get('/getUserOrderColumn', (req, res) => {
    console.log(req.query);
    let sql = ``
    const userOrderColumnInformation = {};
    if (req.query.action == 'pay') {
        sql = `select order_id as id ,commodity_img as imgUrl ,commodity_name as title ,  commodity_per as price , order_number as number from v_order where order_userid = ? and order_state = '未支付'`;
    } else if (req.query.action == 'Receiv') {
        sql = `select order_id as id ,commodity_img as imgUrl ,commodity_name as title ,  commodity_per as price , order_number as number from v_order where order_userid = ? and order_state = '待收货'`;
    } else {
        sql = `select order_id as id ,commodity_img as imgUrl ,commodity_name as title ,  commodity_per as price , order_number as number from v_order where order_userid = ? and order_state = '待评论'`;
    }
    mysqli.exec({
        sql: sql,
        params: [req.query.userId],
        success: resulte => {
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
})
// //根据id修改,根据不同的返回数据调用不同的sql语句
app.post('/postUserOrderColumn', (req, res) => {
    let sql = '',
        params = [],
        returnVal = '';
    if (req.body.action == 'delpay') {
        sql = 'delete from t_order_data where order_userid = ? and  order_Id= ?';
        params = [req.body.userId, req.body.orderId];
        returnVal = req.body.orderId
        mysqli.exec({
            sql: sql,
            params: params,
            success: resulte => {
                res.json({
                    ret: true,
                    code: 200,
                    orderNumber: returnVal
                })
            },
            error: err => {
                console.log('err:', err);
            }
        });
    } else {
        sql = `insert into t_order_data(order_Id,order_Commodity,order_Number,order_Size,order_State,order_UserId) values (null,?,?,?,'未支付', ?)`
        params = [req.body.commodity.commodityId, req.body.commodity.number, req.body.commodity.size, req.body.userId]
        mysqli.exec({
            sql: sql,
            params: params,
            success: resulte => {
                res.json({
                    ret: true,
                    code: 200,
                    orderNumber: resulte.insertId
                })
            },
            error: err => {
                console.log('err:', err);
            }
        });
    }
})
app.get('/getOrderDetalis', (req, res) =>{
    console.log(req.query)
    const sql = `select telephonNumber,addressDetalis,contacts,orderDetalisNumber,orderDetalisSize,orderDetalistTitle,orderDetalistImg,orderDetalisPrice  from v_orderDetallis where user_id = ? and order_id = ?`
    mysqli.exec({
        sql: sql,
        params: [req.query.userId,req.query.payId],
        success: resulte => {
            console.log(resulte)
           const orderDetaillsInformation =  {
                orderDetalisNumber: resulte[0].orderDetalisNumber,
                orderDetalistImg: resulte[0].orderDetalistImg,
                orderDetalistTitle: resulte[0].orderDetalistTitle,
                orderDetalisPrice: resulte[0].orderDetalisPrice,
                orderDetalisSize: resulte[0].orderDetalisSize,
                orderDetalisPriceSum: resulte[0].orderDetalisNumber * resulte[0].orderDetalisPrice,
                orderDetalisAddress: `[{"addressDetalis": ${'"'+ resulte[0].addressDetalis+ '"'},"contacts": ${'"' + resulte[0].contacts + '"'},"telephonNumber": ${resulte[0].telephonNumber}}]`
            }
            res.json({
                ret: true,
                code: 200,
                orderDetaillsInformation
            })
        },
        error: err => {
            console.log('err:', err);
        }
    });
})
app.post('/postOrderDetalis', (req, res) =>{
    console.log(req.body)
    sql = `update t_order_data set  order_Number = ? , order_Size = ?  where order_userid = ?  and order_id = ?;`
    mysqli.exec({
        sql: sql,
        params: [req.body.orderInformation.orderDetalisNumber,req.body.orderInformation.orderDetalisSize,req.body.userId,req.body.orderId],
        error: err => {
            console.log('err:', err);
        }
    });
    res.json({
      ret: true
    })
})
app.get('/getEmitAddress', (req,res)=>{
    console.log(req.query)
    const sql = `select telephone, addressReceiv, addressReceivDetallis, receiveName from v_address where user_id = ? and order_id = ?`
    mysqli.exec({
        sql: sql,
        params: [req.query.userId,req.query.payId],
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
            console.log(areaCode)
            res.json({
                ret: true,
                EmitAddressData: {
                  addressDetail: resulte[0].addressReceivDetallis,
                  areaCode,
                  city,
                  country,
                  county,
                  name: resulte[0].receiveName,
                  province: resulte[0].addressReceiv.split(' ')[0],
                  tel: resulte[0].telephone,
                }
              });
        },
        error: err => {
            console.log('err:', err);
        }
    });
  });
app.post('/postEmitAddress' ,(req, res) =>{
    console.log(req.body)
    let sql = `update address set  receiveName = ?, telephone = ? , addressReceiv = ? , addressReceivDetallis = ? where user_id = ?  and order_id = ?;`
    const  addressReceivInformation = req.body.emitAddressInformation.province + ' ' + req.body.emitAddressInformation.city + ' ' + req.body.emitAddressInformation.county
    mysqli.exec({
        sql: sql,
        params: [req.body.emitAddressInformation.name, req.body.emitAddressInformation.tel, addressReceivInformation, req.body.emitAddressInformation.addressDetail, req.body.userId, req.body.payId],
        error: err => {
            console.log('err:', err);
        }
    });
    res.json({
      ret:true
    })
})
// //下面这个是将用户传输过来的支付密码进行判定
app.post('/postUserBillPay', (req, res) => {
    console.log(req.body);
    let sql = 'select user_perpassword from t_user_data where user_id = ?'
    mysqli.exec({
        sql: sql,
        params: [req.body.UserId],
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
                            params: [e, req.body.UserId],
                            success: resulte => {
                                if (i == req.body.orderId.length - 1) {
                                    res.json({
                                        ret: true,
                                        code: 200
                                    })
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
                        params: [req.body.orderId, req.body.UserId],
                        success: resulte => {
                                res.json({
                                    ret: true,
                                    code: 200
                                })
                        },
                        error: err => {
                            console.log('err:', err);
                        }
                    });
                }
            } else {
                res.json({
                    ret: false,
                    code: 200
                })
            }
        },
        error: err => {
            console.log('err:', err);
        }
    });
})
app.get('/getCommodity', (req, res) => {
    const sql = 'select id, commodity_img as imgUrl , commodity_name as title , commodity_per as price , commodity_img_hover as imgUrl1, commodity_Presonality, commodity_State as commodityState from v_commodity_data where id = ?';
    // "id": "0001", 商品id
    // "imgUrl": "https://game.gtimg.cn/images/daojushop/zb/ad/201910/20191011101011_968962.jpg", 商品图片
    // "title": "LPL x NIKE联名新品", 商品名字
    // "size": "常规", 商品的型号
    // "price": "400", 商品价格
    // "number": 1,  商品数量
    mysqli.exec({
        sql: sql,
        params: [req.query.commodityId],
        success: resulte => {
            console.log(resulte)
            let commodityInformation = resulte
            if (req.query.userId) {
                console.log(1)
                const sql = `select * from t_user_colloection where colloection_userid = ? and colloection_commodity = ?`;
                mysqli.exec({
                    sql: sql,
                    params: [req.query.userId,commodityInformation.id],
                    success: resulte => {
                        commodityInformation[0].newParam = 'conllectionState'
                        if (resulte.length != 0) {
                            commodityInformation[0].conllectionState = true
                        } else {
                            commodityInformation[0].conllectionState = false
                        }
                        console.log(commodityInformation)
                        res.json({
                            ret: true,
                            data: commodityInformation,
                            code: 200
                        });
                    },
                    error: err => {
                        console.log('err:', err);
                    }
                });
            } else {
                res.json({
                    ret: true,
                    data: commodityInformation,
                    code: 200
                });
            }
        },
        error: err => {
            console.log('err:', err);
        }
    });
})
app.get('/getUserDialogues', (req, res) => {
    user_FriendListObject = [];
    let = sql = 'select user_FriendList from t_user_data where user_id = ?'
    mysqli.exec({
        sql: sql,
        params: [req.query.userId],
        success: resulte => {
            const user_FriendListId = resulte[0].user_FriendList.split(',');
            user_FriendListId.forEach(e => {
                user_FriendList.push({
                    id: e,
                    socket: ''
                })
                user_FriendListObject.push({
                    id: e
                })
            })
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
                            if (resulte.length != 0) {
                                dialogueContentAll.push(resulte[0])
                                if (i == user_FriendListObject.length - 1) {
                                    res.json({
                                        ret: true,
                                        data: dialogueContentAll,
                                        code: 200
                                    });
                                }
                            }
                        },
                        error: err => {
                            console.log('err:', err);
                        }
                    });
                })
            } else {
                res.json({
                    ret: true,
                    data: dialogueContentAll,
                    code: 200
                });
            }
        },
        error: err => {
            console.log('err:', err);
        }
    });
})
app.get('/dialogueBox', (req, res) => {
    let userDialogues = [],
        returnDialoguesInformation = [],
        bulleList = [];
    const staticFile = '{"userId": []}'
    existsSync = () => {
        console.log('创建')
        const exists = fs.existsSync(path.join(__dirname, 'public', req.query.userId + '.json'));
        if (!exists) {
            const Establish = fs.writeFile(path.join(__dirname, 'public', JSON.parse(req.query.userId) + '.json'), staticFile, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    }
    existsSync();
    userDialogues = fs.readFileSync(path.join(__dirname, 'public', req.query.userId + '.json'), 'utf-8', (err, data) => {
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
                        bulleList.push({
                            "id": e.dialogueId,
                            "userId": e.userId,
                            "userName": resulte[0].user_Name,
                            "userHeadImg": resulte[0].user_Img,
                            "userDialogueContent": e.dialogueContent
                        })
                        if (i == returnDialoguesInformation.length - 1) {
                            res.json({
                                ret: true,
                                content: 'have',
                                data: bulleList,
                                code: 200
                            });
                        }
                    }
                },
                error: err => {
                    console.log('err:', err);
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
                    res.json({
                        ret: true,
                        content: null,
                        data: bulleList,
                        code: 200
                    });
                }
            },
            error: err => {
                console.log('err:', err);
            }
        });
    }
})
app.get('/getSeach', (req,res) =>{
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
app.post('/postAdLogin', (req,res) => {
    console.log(req.body)
    const sql = 'select id from t_Adminstrantion where ad_telephone = ? and ad_password = ?'
    mysqli.exec({
      sql:sql,
      params: [req.body.account, req.body.password],
      success: resulte => {
        console.log(resulte)
        if (resulte.length !== 0) {
            res.json({
                code: 202,
                data: resulte[0].id
            })
        } else {
            res.json({
                code: 204,
                data: 'undefind'
              })
        }
      }
    })
})
app.get('/getAdInformation', (req, res) => {
    console.log(req.query)
    const sql = 'select ad_name as user_Name, ad_sex as user_Sex, ad_telephone as user_Telephone, ad_age as user_Age, ad_address as user_Address, ad_email  as user_email, ad_headerImg as user_Img from v_adminstrantion where id = ?';
    mysqli.exec({
        sql: sql,
        params: [req.query.id],
        success: resulte => {
            if (resulte) {
                res.json({
                    code: 202,
                    data: resulte
                })
            } else {
                res.json({
                    code: 204,
                    data: 'undefind'
                })
            }
        }
    })
})
app.post('/postAdInformaton', (req, res) => {
    console.log(req.body)
  const sql = 'update t_adminstrantion set ad_name = ?, ad_sex = ?, ad_telephone = ?, ad_age = ?, ad_address = ?, ad_email = ?, ad_headerImg = ? where id = ?'
  mysqli.exec({
      sql: sql,
      params:[req.body.data.user_Name,
              req.body.data.user_Sex,
              req.body.data.user_Telephone,
              req.body.data.user_Age,
              req.body.data.user_Address,
              req.body.data.user_email,
              req.body.data.user_Img,
              req.body.userId],
      success: resulte => {
          res.json({
             code: 202
          })
      },
      error: err => {
          console.log(err)
      }
  })
})
app.get('/getAdCommodityPage', (req, res) => {
  console.log(req.query)
  const sql =  req.query.action === 'total' || req.query.key === '%undefined%' ? 'select max(id) as max from v_commodity_data' : 'select count(*) as max from v_commodity_data where commodity_Name like ? or commodity_Class like ?' 
  mysqli.exec({
    sql: sql,
    params: req.query.action === 'total' || req.query.key === '%undefined%' ? null : [req.query.key, req.query.key],
    success: resulte => {
      let pageArray = [];
      let pageNum = 1 
      if (req.query.action !== 'total' || req.query.key != '%undefined%') {
        console.log(1)
        for(let i = 1; i <= resulte[0].max; i+=8) {
            pageArray.push(pageNum)
            pageNum+=1
        }   
      } else {
        for(let i = 16; i <= resulte[0].max; i+=8) {
            pageArray.push(pageNum)
            pageNum+=1
        }          
      }
       res.json({
           code: 202,
           data: pageArray
       })
    },
    error: err => {
        if(err) {
          console.log(err)
        }
    }
  })
})
app.get('/getAdCommodityData', (req, res) => {
  const sql =  req.query.action === 'seach' || req.query.key ? 'select id, commodity_Name, commodity_Number, commodity_Per, commodity_State from v_commodity_data where commodity_Name like ? or commodity_Class like ?' : 'select id, commodity_Name, commodity_Number, commodity_Per, commodity_State from v_commodity_data where id >= ? and id < ?';
  const getNumTwo =   req.query.jumpNumber * 8 + 10 || 0;
  const getNumOne = getNumTwo - 8;
  const params = req.query.action === 'seach'|| req.query.key ? [req.query.key, req.query.key] : [getNumOne, getNumTwo]
  mysqli.exec({
    sql: sql,
    params: params,
    success: resulte => {
        resulte = resulte.map(e => {
          e.commodity_State = JSON.parse(e.commodity_State)
          return e
        })
        if (resulte) {
          if (req.query.action === 'seach' || req.query.key ) {
            const getNumTwoSeach =   req.query.jumpNumber * 8 ;
            const getNumOneSeach = getNumTwoSeach - 8;
            resulte = resulte.filter((e,i) => {
              if (getNumTwoSeach > i && i  >= getNumOneSeach) {
                  return e
              }
            })

          }
          res.json({
              code: 202,
              data: resulte
          })
        } else {
          res.json({
              code: 204,
              data: resulte
          })
        }
    },
    error: err => {
        if (err) {
          console.log(err)
        }
    }
  })    
})
app.post('/postAdCommodityData', (req,res) => {
  console.log(req.body)
  const sql = req.body.action === 'commodityData' ? 'update commodity_data set commodity_Per = ? , commodity_Number = ? where id = ?' : 'update commodity_data set commodity_State = ? where id = ?';
  const params = req.body.action === 'commodityData' ? [req.body.per, req.body.stock, req.body.id] : [JSON.stringify(req.body.state), req.body.id]
  console.log(params, sql)
  mysqli.exec({
    sql:sql,
    params: params,
    success: resulte => {
        res.json({
          code: 202
        })
    },
    error: err => {
        if (err) {
            console.log(err)
        }
    }
  })
})
app.get('/getDataAnalysis', (req, res) => {
    let sql = ''
    if (req.query.action == 'total') {
      sql = 'select  *  from  v_tatolTurnover '
    } else if (req.query.action == 'turnover') {
        sql = 'select * from v_turnover where id = 2'
    } else {
        sql = 'select user_implementation  from t_user_data'
    }
    mysqli.exec({
        sql: sql,
        success: resulte => {
            if(resulte.length != 0) {
                res.json({
                    code: 202,
                    data: resulte
                })
            } else {
                res.json({
                    code: 204,
                    data: 'undefind'
                })
            }
        },
        error: err => {
            if (err) {
                console.log(err)
            }
        }
    })
})
io.on('connection', function (socket) {
    let dialogueInformation = ''
    socket.on('Bconnection', (data) => {
        user_FriendList.forEach(e => {
            // console.log(e)
            if (e.id == data) {
                e.socket = socket
            }
        })
    })
    socket.on('connection', function (data) {
        io.set('origins', 'http://localhost:8080');
        dialogueInformation = data
        // sendid 接收的对象soket的ID，这个ID是每次用户登录网页都会生成而且每次都不一样
        const sendid = user_FriendList.find(e => e.id == data.dialogueObject)
        if (sendid) {
            if (sendid.socket.id) {
                sendid.socket.emit('airContent', dialogueInformation)
            }
            socket.emit('airContent', dialogueInformation)
            let objectUserDialogues = fs.readFileSync(path.join(__dirname, 'public', data.dialogueObject + '.json'), 'utf-8', (err, data) => {
                if (err) {
                    return err
                }
                return data
            })
            let currUserDialogues = fs.readFileSync(path.join(__dirname, 'public', data.userId + '.json'), 'utf-8', (err, data) => {
                if (err) {
                    return err
                }
                return data
            })
            let Springboard = JSON.parse(currUserDialogues)
            if (Springboard.userId.length > 0) {
                let exsitencestate = true;
                Springboard.userId.forEach(e => {
                    if (e.relationShipId == data.dialogueObject) {
                        exsitencestate = false
                        e.dialogueContent.push({
                            "dialogueId": e.dialogueContent.length,
                            "userId": parseInt(dialogueInformation.userId),
                            "dialogueContent": dialogueInformation.userDialogueContent
                        })
                    }
                })
                if (exsitencestate) {
                    Springboard.userId.push({
                        "relationShipId": data.dialogueObject,
                        "dialogueContent": [
                            {
                                "dialogueId": 0,
                                "userId": parseInt(dialogueInformation.userId),
                                "dialogueContent": dialogueInformation.userDialogueContent
                            }
                        ]
                    })
                }
                currUserDialogues = Springboard
                const Establish = fs.writeFile(path.join(__dirname, 'public', JSON.parse( data.userId) + '.json'), JSON.stringify(currUserDialogues), (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            } else {
                Springboard.userId.push({
                    "relationShipId": data.dialogueObject,
                    "dialogueContent": [
                        {
                            "dialogueId": 0,
                            "userId": parseInt(dialogueInformation.userId),
                            "dialogueContent": dialogueInformation.userDialogueContent
                        }
                    ]
                })
            }
            currUserDialogues = Springboard
            const Establish = fs.writeFile(path.join(__dirname, 'public', JSON.parse(data.userId) + '.json'), JSON.stringify(currUserDialogues), (err) => {
                if (err) {
                    console.log(err)
                }
            })
            let SpringboardObject = JSON.parse(objectUserDialogues)
            if (SpringboardObject.userId.length > 0) {
                let exsitencestate = true;
                SpringboardObject.userId.forEach(e => {
                    if (e.relationShipId == data.userId) {
                        exsitencestate = false
                        e.dialogueContent.push({
                            "dialogueId": e.dialogueContent.length,
                            "userId": parseInt(dialogueInformation.userId),
                            "dialogueContent": dialogueInformation.userDialogueContent
                        })
                    }
                })
                if (exsitencestate) {
                    SpringboardObject.userId.push({
                        "relationShipId": data.userId,
                        "dialogueContent": [
                            {
                                "dialogueId": 0,
                                "userId": parseInt(dialogueInformation.userId),
                                "dialogueContent": dialogueInformation.userDialogueContent
                            }
                        ]
                    })
                }
                console.log(SpringboardObject.userId)
                objectUserDialogues = SpringboardObject
                const Establish = fs.writeFile(path.join(__dirname, 'public', JSON.parse(data.dialogueObject) + '.json'), JSON.stringify(objectUserDialogues), (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            } else {
                SpringboardObject.userId.push({
                    "relationShipId": data.userId,
                    "dialogueContent": [
                        {
                            "dialogueId": 0,
                            "userId": parseInt(dialogueInformation.userId),
                            "dialogueContent": dialogueInformation.userDialogueContent
                        }
                    ]
                })
                objectUserDialogues = SpringboardObject
                console.log(SpringboardObject.userId)
                const Establish = fs.writeFile(path.join(__dirname, 'public', JSON.parse(data.dialogueObject) + '.json'), JSON.stringify(objectUserDialogues), (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        }
    });
});
server.listen(3000)