webpackJsonp([22],{0:function(e,t){},"19nU":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("pFYg"),r=n.n(a),i=n("//Fk"),o=n.n(i),s=n("Dd8w"),u=n.n(s),c=n("YaEn");var l={SET_ROUTES:function(e,t){e.addRoutes=t,e.routes=c.b.concat(t)}},d={generateRoutes:function(e,t){var n=e.commit;return new o.a(function(e){var a=void 0;console.log(void 0===t?"undefined":r()(t)),a=t.includes("user")?c.a||[]:function e(t,n){var a=[];return t.forEach(function(t){var r=u()({},t);(function(e,t){return!t.meta||!t.meta.roles||e.some(function(e){return t.meta.roles.inludes(e)})})(n,r)&&(r.children&&(r.children=e(r.children,n)),a.push(r))}),a}(c.a,t),n("SET_ROUTES",a),e(a)})}};t.default={namespaced:!0,state:{routes:[],addRoutes:[]},mutations:l,actions:d}},"4ml/":function(e,t){},"9n10":function(e,t){},EDgR:function(e,t){var n=32;function a(){var e=document.documentElement.clientWidth/750;document.documentElement.style.fontSize=n*Math.min(e,2)+"px"}a(),window.onresize=function(){a()}},GLJZ:function(e,t){},IcnI:function(e,t,n){"use strict";var a=n("7+uW"),r=n("NYxO"),i={currUserData:function(e){return e.user.currUserData},currFriendId:function(e){return e.friend.currFriendId},currOrderList:function(e){return e.user.currOrderList},token:function(e){return e.user.token},roles:function(e){return e.user.roles}};a.a.use(r.a);var o=n("w+hY"),s=o.keys().reduce(function(e,t){var n=t.replace(/^\.\/(.*)\.\w+$/,"$1"),a=o(t);return e[n]=a.default,e},{});console.log(s);var u=new r.a.Store({modules:s,getters:i});t.a=u},M14n:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("mvHQ"),r=n.n(a),i=n("//Fk"),o=n.n(i),s={currFriendId:JSON.parse(sessionStorage.getItem("currFriendId"))},u={obtionCurrFriendId:function(e,t){return new o.a(function(n,a){t?(sessionStorage.setItem("currUserData",r()(t)),e.commit("UPDATA_CURR_FRIENDID",t),n()):a("数据异常")})}};t.default={namespaced:!0,actions:u,mutations:{UPDATA_CURR_FRIENDID:function(e,t){e.currFriendId=t}},state:s}},M6Sr:function(e,t){},"N+zL":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={render:function(){var e=this.$createElement;return(this._self._c||e)("div",{class:this.slideClass},[this._t("default")],2)},staticRenderFns:[]},r=n("VU/8")({name:"swiper-slide",data:function(){return{slideClass:"swiper-slide"}},ready:function(){this.update()},mounted:function(){this.update(),this.$parent.options.slideClass&&(this.slideClass=this.$parent.options.slideClass)},updated:function(){this.update()},attached:function(){this.update()},methods:{update:function(){this.$parent&&this.$parent.swiper&&this.$parent.swiper.update&&(this.$parent.swiper.update(!0),this.$parent.options.loop&&this.$parent.swiper.reLoop())}}},a,!1,null,null,null);t.default=r.exports},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("7+uW"),r=n("F3EI"),i=n.n(r),o=n("Fd2+"),s=n("/ocq"),u=(n("4ml/"),n("mvHQ")),c=n.n(u),l={name:"App",mounted:function(){window.addEventListener("unload",this.saveState)},methods:{saveState:function(){sessionStorage.setItem("state",c()(this.$store.state))}}},d={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("transition",{attrs:{"enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut",duration:400,mode:"out-in"}},[t("keep-alive",[this.$route.meta.keepAlive?t("router-view"):this._e()],1)],1),this._v(" "),t("transition",{attrs:{"enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut",duration:400,mode:"out-in"}},[this.$route.meta.keepAlive?this._e():t("router-view")],1)],1)},staticRenderFns:[]};var p=n("VU/8")(l,d,!1,function(e){n("ebHs")},null,null).exports,f=n("YaEn"),m=n("v5o6"),h=n.n(m),v=(n("9n10"),n("M6Sr"),n("TzC8"),n("v2ns"),n("oPmM")),g=n.n(v),w=n("HI0L"),_=n.n(w),b=n("DmT9"),k=n.n(b),A=(n("j1ja"),n("IcnI")),C=(n("EDgR"),n("Xxa5")),R=n.n(C),E=n("Dd8w"),O=n.n(E),T=n("exGp"),y=n.n(T),I=n("Y81h"),U=n.n(I),S=(n("UVIz"),n("TIfe")),D="英雄联盟";var x=this;U.a.configure({showSpinner:!1});var L,P=["home","login","register","Commodity","seachFrame","SeachInterface"];f.c.beforeEach((L=y()(R.a.mark(function e(t,n,a){var r,i,o,s;return R.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(U.a.start(),document.title=((n=t.meta.title)?n+" - "+D:""+D)||"",!Object(S.a)()){e.next=35;break}if("/account/Login"!==t.path){e.next=9;break}a({path:"/"}),U.a.done(),e.next=33;break;case 9:if(!(r=A.a.getters.roles&&A.a.getters.roles.length>0)){e.next=14;break}a(),e.next=33;break;case 14:return e.prev=14,e.next=17,A.a.dispatch("user/getInfo");case 17:return i=e.sent,o=i.roles,e.next=21,A.a.dispatch("permission/generateRoutes",o);case 21:s=e.sent,console.log(r,A.a.getters.roles),f.c.addRoutes(s),a(O()({},t,{replace:!0})),e.next=33;break;case 27:return e.prev=27,e.t0=e.catch(14),console.log(e.t0),e.next=32,A.a.dispatch("user/resetToken");case 32:U.a.done();case 33:e.next=36;break;case 35:-1!==P.indexOf(t.name)?a():(a("/account"),U.a.done(),alert("登录失效，请重新登录"));case 36:case"end":return e.stop()}var n},e,x,[[14,27]])})),function(e,t,n){return L.apply(this,arguments)})),f.c.afterEach(function(){U.a.done()});n("OF5A");a.a.config.productionTip=!1,h.a.attach(document.body),a.a.use(i.a),a.a.use(g.a),a.a.use(o.a),a.a.use(s.a),a.a.use(new _.a({debug:!0,connection:k()("http://localhost:3000/"),transports:["websocket"]}));var j=s.a.prototype.push;s.a.prototype.push=function(e){return j.call(this,e).catch(function(e){return e})},new a.a({el:"#app",router:f.c,store:A.a,components:{App:p},template:"<App/>"})},TIfe:function(e,t,n){"use strict";t.a=function(){return r.a.get(i)},t.c=function(e){return r.a.set(i,e)},t.b=function(){return r.a.remove(i)};var a=n("lbHh"),r=n.n(a),i="User-Token"},TzC8:function(e,t){},UVIz:function(e,t){},YaEn:function(e,t,n){"use strict";var a=n("7+uW"),r=n("/ocq"),i={render:function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"app-main"},[t("transition",{attrs:{name:"fate-transform",mode:"out-in"}},[t("router-view",{key:this.key})],1)],1)},staticRenderFns:[]},o=n("VU/8")({name:"AppMain",computed:{key:function(){return this.$route.path}}},i,!1,null,null,null).exports,s=n("Dd8w"),u=n.n(s),c=n("NYxO"),l={name:"HomeNavigation",data:function(){return{navigationList:[{name:"home",state:!1},{name:"dialogue",state:!1},{name:"personal",state:!1}],oldRouter:"home"}},methods:{judgeLoginState:function(e){this.token?this.oldRouter!==e&&(this.oldRouter=e,this.$router.push({path:e}),this.judgeMoveTag(e)):(this.$router.push("/account"),this.oldRouter=e)},judgeMoveTag:function(e){var t=null;t="/user/personal"===e||-1!==e.indexOf("/user/Order")?this.navigationList[2].name:"/user/Dialogue"===e?this.navigationList[1].name:this.navigationList[0].name,this.navigationList=this.navigationList.map(function(e){return e.name===t?(e.state=!0,e):(e.state=!1,e)})}},computed:u()({},Object(c.b)(["token"])),mounted:function(){this.judgeMoveTag(this.$route.path)},activated:function(){this.judgeMoveTag(this.$route.path)},deactivated:function(){this.navigationList=this.navigationList.map(function(e){return e.state=!1,e})}},d={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"navigation-box"},[n("div",{staticClass:"navigation-title home",on:{click:function(t){return e.judgeLoginState("/")}}},[e._m(0),e._v(" "),n("transition",{attrs:{"enter-active-class":"animated rubberBand"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.navigationList[0].state,expression:"navigationList[0].state"}],staticClass:"navigation-animate-home"})])],1),e._v(" "),n("div",{staticClass:"navigation-title dialogue",on:{click:function(t){return e.judgeLoginState("/user/Dialogue")}}},[e._m(1),e._v(" "),n("transition",{attrs:{"enter-active-class":"animated rubberBand"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.navigationList[1].state,expression:"navigationList[1].state"}],staticClass:"navigation-animate-dialogue"})])],1),e._v(" "),n("div",{staticClass:"navigation-title presonal",on:{click:function(t){return e.judgeLoginState("/user/personal")}}},[e._m(2),e._v(" "),n("transition",{attrs:{"enter-active-class":"animated rubberBand"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.navigationList[2].state,expression:"navigationList[2].state"}],staticClass:"navigation-animate-personal"})])],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"navigation-title-content"},[t("span",{staticClass:"iconfont"},[this._v("")]),this._v(" "),t("br"),this._v(" "),t("span",[this._v("首页")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("a",{attrs:{href:"javascript:;"}},[t("div",{staticClass:"navigation-title-content"},[t("span",{staticClass:"iconfont"},[this._v("")]),this._v(" "),t("br"),this._v(" "),t("span",[this._v("信息")])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("a",{attrs:{href:"javascript:;"}},[t("div",{staticClass:"navigation-title-content"},[t("span",{staticClass:"iconfont"},[this._v("")]),this._v(" "),t("br"),this._v(" "),t("span",[this._v("我的联盟")])])])}]};var p={name:"Layout",components:{appMain:o,navigation:n("VU/8")(l,d,!1,function(e){n("y6nL")},"data-v-3591a85c",null).exports},data:function(){return{selfAdaption:{height:document.body.clientHeight,width:document.body.clientWidth}}}},f={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"app-wrapper",style:this.selfAdaption},[t("div",{staticClass:"appWrapper"},[t("appMain")],1),this._v(" "),t("div",{staticClass:"fixd-header"},[t("navigation")],1)])},staticRenderFns:[]};var m=n("VU/8")(p,f,!1,function(e){n("ft4T")},"data-v-5926e538",null).exports,h={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"Account"},[t("transition",{attrs:{"enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut",duration:1e3}},[t("router-view")],1)],1)},staticRenderFns:[]};var v=n("VU/8")({name:"Account"},h,!1,function(e){n("GLJZ")},"data-v-20af73e1",null).exports;n.d(t,"b",function(){return g}),n.d(t,"a",function(){return w}),a.a.use(r.a);var g=[{path:"/",component:m,redirect:"/home",children:[{path:"home",component:function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,"wXUp"))},name:"home",meta:{title:"Home",keepAlive:!1}}]},{name:"seachFrame",path:"/seachFrame",component:function(){return Promise.all([n.e(0),n.e(16)]).then(n.bind(null,"Gx8J"))},meta:{title:"搜索",keepAlive:!0},children:[{name:"SeachInterface",path:"commodity/keyWord=:seachKeyWord",component:function(){return Promise.all([n.e(0),n.e(9)]).then(n.bind(null,"/VKK"))},meta:{title:"搜索结果",keepAlive:!1}}]},{path:"/account",component:v,meta:{title:"Account"},redirect:"/account/Login",children:[{name:"login",path:"/account/Login",component:function(){return n.e(11).then(n.bind(null,"4fd9"))},meta:{title:"登录",keepAlive:!0}},{name:"register",path:"/account/register",component:function(){return n.e(14).then(n.bind(null,"74lx"))},meta:{title:"注册",keepAlive:!0}}]},{name:"Commodity",path:"/commodity/commodityId=:commodityId",component:function(){return Promise.all([n.e(0),n.e(4)]).then(n.bind(null,"yXpn"))},meta:{title:"商品详情",keepAlive:!1}}],w=[{path:"/user",component:m,meta:{title:"用户",roles:["user"]},children:[{name:"personal",path:"/user/personal",component:function(){return Promise.all([n.e(0),n.e(1)]).then(n.bind(null,"dRN+"))},meta:{title:"个人中心",roles:["user"],keepAlive:!1}},{name:"ShoppingCar",path:"/user/ShoppingCar",component:function(){return Promise.all([n.e(0),n.e(7)]).then(n.bind(null,"2BCd"))},meta:{title:"个人购物车",roles:["user"],keepAlive:!1}},{name:"CollocetionPage",path:"/user/CollocetionPage",component:function(){return Promise.all([n.e(0),n.e(5)]).then(n.bind(null,"4uP+"))},meta:{title:"个人收藏",roles:["user"],keepAlive:!1}},{name:"Order",path:"/user/Order",redirect:"/user/Order/OrderPay",component:function(){return Promise.all([n.e(0),n.e(6)]).then(n.bind(null,"s184"))},meta:{title:"个人订单",roles:["user"],keepAlive:!1},children:[{name:"OrderPay",path:"/user/Order/OrderPay",component:function(){return Promise.all([n.e(0),n.e(18)]).then(n.bind(null,"iDtc"))},meta:{title:"我的订单",roles:["user"],keepAlive:!1},children:[{name:"orderDetalis",path:"/user/orderDetalis/payId=:payId",component:function(){return n.e(15).then(n.bind(null,"WTKT"))},meta:{title:"订单详情",roles:["user"],keepAlive:!1}}]},{name:"OrderReceiv",path:"/user/Order/OrderReceiv",component:function(){return Promise.all([n.e(0),n.e(13)]).then(n.bind(null,"fWcp"))},meta:{title:"我的订单",roles:["user"],keepAlive:!1}},{name:"OrderEvaluate",path:"/user/Order/OrderEvaluate",component:function(){return Promise.all([n.e(0),n.e(20)]).then(n.bind(null,"vJrE"))},meta:{title:"我的订单",roles:["user"],keepAlive:!1}}]},{name:"EmitAddress",path:"/user/EmitAddress/payId=:payId*",component:function(){return n.e(10).then(n.bind(null,"js89"))},meta:{title:"编辑地址",roles:["user"],keepAlive:!1}},{name:"Dialogue",path:"/user/Dialogue",component:function(){return Promise.all([n.e(0),n.e(8)]).then(n.bind(null,"kJWX"))},meta:{title:"信息",roles:["user"],keepAlive:!1}}]},{name:"PriveteInterface",path:"/PrivateInterFace/userId=:userId*",component:function(){return n.e(3).then(n.bind(null,"fDNQ"))},meta:{title:"信息界面",roles:["user"],keepAlive:!1}},{name:"DialogueBox",path:"/user/DialogueBox/:objectUserId*",component:function(){return Promise.all([n.e(0),n.e(12)]).then(n.bind(null,"Q5pJ"))},meta:{title:"对话框",roles:["user"],keepAlive:!1}},{name:"AddFriend",path:"/user/AddFriend",component:function(){return n.e(17).then(n.bind(null,"Fcj5"))},meta:{title:"添加好友",roles:["user"],keepAlive:!1}},{name:"PasswordBtn",path:"/user/PasswordBtn",component:function(){return Promise.all([n.e(0),n.e(19)]).then(n.bind(null,"xzny"))},meta:{title:"支付页面",roles:["user"],keepAlive:!1}}],_=function(){return new r.a({scrollBehavior:function(){return{y:0}},routes:g})},b=_();t.c=b},bREw:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("mvHQ"),r=n.n(a),i=n("//Fk"),o=n.n(i),s=n("TIfe"),u=n("mtWM"),c=n.n(u),l=n("IcnI"),d=c.a.create({baseURL:"http://localhost:3000/",withCredentials:!0,timeout:5e3,headers:{"Content-Type":"application/json","Cache-Control":"no-cache"}});d.interceptors.request.use(function(e){return l.a.getters.token&&(e.headers.Authorization="Bearer "+Object(s.a)()),e},function(e){return console.log(e),o.a.reject(e)}),d.interceptors.response.use(function(e){var t=e.data;return 200!==e.status?(console.log(t.msg),"jwt expired"===t.msg&&l.a.dispatch("user/resetToken").then(function(){location.reload()}),o.a.reject(new Error(t.msg||"请求失败"))):t},function(e){console.log({error:e});var t=e.response.data,n=t.msg;return-2===t.code&&l.a.dispatch("user/resetToken").then(function(){location.reload()}),o.a.reject(n)});var p=d;var f={currUserData:"",currOrderList:JSON.parse(sessionStorage.getItem("orderList")),token:Object(s.a)(),roles:[]},m={SET_TOKEN:function(e,t){e.token=t},SET_ROLES:function(e,t){e.roles=t,console.log(e.roles)},UPDATA_CURR_USERDATA:function(e,t){e.currUserData=t},CLEAR_CURR_USERDATA:function(e,t){e.currUserData=t},UPDATA_CURR_DATAORDER:function(e,t){e.currOrderList=t},CLEAR_CURR_DATAORDER:function(e,t){e.currOrderList=t}},h={obtionCurrUserData:function(e,t){return console.log(t),new o.a(function(n,a){t?(e.commit("UPDATA_CURR_USERDATA",t),console.log(t),n()):a("数据异常")})},orderList:function(e,t){sessionStorage.setItem("currOrderList",r()(t)),e.commit("UPDATA_CURR_DATAORDER",t),console.log(t)},login:function(e,t){var n=e.commit,a=t.account,r=t.password;return new o.a(function(e,t){var i;(i={account:a,password:r},p({url:"/getUserInformation",method:"post",data:i})).then(function(t){var a=t.data;n("SET_TOKEN",a.token),Object(s.c)(a.token),e()}).catch(function(e){console.log({error:e}),t(e)})})},getInfo:function(e){var t=e.commit,n=e.state;return new o.a(function(e,a){(n.token,p({url:"/getUserInformation",method:"get"})).then(function(n){var r=n.data;r||a("验证失效，请重新登录"),console.log(r);var i=r[0].roles;(!i||i.length<=0)&&a("没有权限"),t("SET_ROLES",i),t("UPDATA_CURR_USERDATA",r),e(r[0])})})},getUserCommodityInfo:function(e,t){var n=e.state;return new o.a(function(e,a){(function(e,t){return p({url:t,method:"get"})})(n.token,t).then(function(t){var n=t.data;e(n)}).catch(function(e){a(e)})})},getUserOrderInfo:function(e,t){var n=e.state,a=t.params,r=void 0===a?{}:a,i=t.url,s=void 0===i?"":i;return console.log(r),new o.a(function(e,t){(function(e,t,n){return p({url:t,method:"get",params:n})})(n.token,s,r).then(function(t){console.log(t);var n=t.data;e(n)}).catch(function(e){t(e)})})},postUserCommodityInfo:function(e,t){var n=e.state,a=t.params,r=t.url;return new o.a(function(e,t){(function(e,t,n){return p({url:n,method:"post",data:t})})(n.token,a,r).then(function(t){var n=t.data;e(n)}).catch(function(e){t(e)})})},postUserOrderInfo:function(e,t){var n=e.state,a=t.params,r=void 0===a?{}:a,i=t.url,s=void 0===i?"":i;return new o.a(function(e,t){(function(e,t,n){return p({url:t,method:"post",data:n})})(n.token,s,r).then(function(t){var n=t.data;e(n)}).catch(function(e){t(e)})})},emitUserData:function(e,t){e.commit;return new o.a(function(e,n){var a;console.log(t),(a=t,p({url:"/postChangePirvateInformation",method:"post",data:a})).then(function(t){var a=t.data;a||n("修改失败"),e(a)})})},resetToken:function(e){var t=e.commit;return new o.a(function(e){t("SET_TOKEN",""),t("SET_ROLES",[]),Object(s.b)(),e()})}};t.default={namespaced:!0,actions:h,mutations:m,state:f}},ebHs:function(e,t){},ft4T:function(e,t){},oPmM:function(e,t){},pYmz:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a="undefined"!=typeof window;a&&(window.Swiper=n("gsqX"));var r={name:"swiper",props:{options:{type:Object,default:function(){return{autoplay:3500}}},notNextTick:{type:Boolean,default:function(){return!1}}},data:function(){return{defaultSwiperClasses:{wrapperClass:"swiper-wrapper"}}},ready:function(){!this.swiper&&a&&(this.swiper=new Swiper(this.$el,this.options))},mounted:function(){var e=this,t=function(){if(!e.swiper&&a){delete e.options.notNextTick;var t=!1;for(var n in e.defaultSwiperClasses)e.defaultSwiperClasses.hasOwnProperty(n)&&e.options[n]&&(t=!0,e.defaultSwiperClasses[n]=e.options[n]);var r=function(){e.swiper=new Swiper(e.$el,e.options)};t?e.$nextTick(r):r()}}(this.options.notNextTick||this.notNextTick)?t():this.$nextTick(t)},updated:function(){this.swiper&&this.swiper.update()},beforeDestroy:function(){this.swiper&&(this.swiper.destroy(),delete this.swiper)}},i={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"swiper-container"},[e._t("parallax-bg"),e._v(" "),n("div",{class:e.defaultSwiperClasses.wrapperClass},[e._t("default")],2),e._v(" "),e._t("pagination"),e._v(" "),e._t("button-prev"),e._v(" "),e._t("button-next"),e._v(" "),e._t("scrollbar")],2)},staticRenderFns:[]},o=n("VU/8")(r,i,!1,null,null,null);t.default=o.exports},v2ns:function(e,t){},"w+hY":function(e,t,n){var a={"./friend.js":"M14n","./permission.js":"19nU","./user.js":"bREw"};function r(e){return n(i(e))}function i(e){var t=a[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}r.keys=function(){return Object.keys(a)},r.resolve=i,e.exports=r,r.id="w+hY"},y6nL:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.53f1d02630abf066c098.js.map