webpackJsonp([18],{iDtc:function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=e("Dd8w"),a=e.n(s),i=e("GQaK"),n=e("CRLr"),o=e("MqkC"),c=e("NYxO"),d={name:"OrderPay",data:function(){return{orderPayList:[],payId:null}},methods:{getOrderPay:function(){var t=this;this.$store.dispatch("user/getUserOrderInfo",{url:"/getUserOrderColumn",params:{action:"pay"}}).then(function(r){r&&(t.orderPayList=r)}).catch(function(r){console.log({err:r}),t.$toast.fail("请稍后...")})},transtionOrderNavigation:function(t){var r=this;o.a.setPayId(t),o.a.setAction("pay"),this.$store.dispatch("user/getUserOrderInfo",{url:"/getEmitAddress",params:{payId:t}}).then(function(e){""===e.addressDetail||""===e.areaCode||""===e.name?(r.$toast.fail("请完善收货信息"),r.$router.push("/user/orderDetalis/payId="+t)):r.$router.push("/user/PasswordBtn")}),n.a.$emit("transtionOrderNavigation","OrderReceiv")},destructionPayOrder:function(t){var r=this;this.$dialog.confirm({title:"是否取消订单",width:"320px"}).then(function(){r.$store.dispatch("user/postUserOrderInfo",{url:"/postUserOrderColumn",params:{action:"delpay",orderId:t}}).then(function(t){r.$toast.fail("取消成功"),r.orderPayList=r.orderPayList.filter(function(r){return t.orderNumber!==r.id})}).catch(function(t){r.$toast.fail("请稍后..."),console.log(t)})}).catch(function(){r.$$toast.fali("请稍后再试")})}},computed:a()({pirceSum:function(){return function(t,r){return t*r}},orderPayContentHeight:function(){return 4*this.orderPayList.length}},Object(c.b)(["currUserData"])),mounted:function(){console.log(this.$route.params),this.getOrderPay(),this.scroll=new i.a(this.$refs.orderPayShow,{mouseWheel:!0,click:!0,tap:!0})},activated:function(){this.getOrderPay()}},u={render:function(){var t=this,r=t.$createElement,e=t._self._c||r;return e("div",{staticClass:"ordePay-box"},[e("div",{ref:"orderPayShow",staticClass:"orderPay-show"},[e("div",{staticClass:"orderPay-content",style:{height:t.orderPayContentHeight+"rem"}},t._l(t.orderPayList,function(r){return e("div",{key:r.id,staticClass:"payContent"},[e("div",{staticClass:"payContent-img"},[e("img",{staticClass:"img",attrs:{src:r.imgUrl}})]),t._v(" "),e("div",{staticClass:"payContent-title"},[e("span",{staticClass:"title"},[t._v(t._s(r.title))])]),t._v(" "),e("div",{staticClass:"payContent-information"},[e("span",{staticClass:"price"},[t._v("价格：￥"+t._s(r.price))]),t._v(" "),e("span",{staticClass:"number"},[t._v("数量："+t._s(r.number))]),t._v(" "),e("span",{staticClass:"size"},[t._v("型号："+t._s(r.size))])]),t._v(" "),e("div",{staticClass:"sum-price"},[t._v("\n                合计："),e("span",{staticClass:"sum"},[t._v("￥"+t._s(t.pirceSum(r.price,r.number)))])]),t._v(" "),e("div",{staticClass:"payContent-btns"},[e("ul",[e("router-link",{attrs:{to:"/user/orderDetalis/payId="+r.id}},[e("li",{staticClass:"btns details"},[t._v("查看详情")])]),t._v(" "),e("li",{staticClass:"btns pay",on:{click:function(e){return t.transtionOrderNavigation(r.id)}}},[t._v("立即付款")]),t._v(" "),e("li",{staticClass:"btns cancel",on:{click:function(e){return t.destructionPayOrder(r.id)}}},[t._v("取消订单")])],1)])])}),0)]),t._v(" "),e("router-view")],1)},staticRenderFns:[]};var l=e("VU/8")(d,u,!1,function(t){e("um6a")},"data-v-0b6e2d04",null);r.default=l.exports},um6a:function(t,r){}});
//# sourceMappingURL=18.a5c0d5a2dc65d362743e.js.map