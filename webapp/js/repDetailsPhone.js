/**
 * Created by Administrator on 2015/11/30.
 */
var repname='';
var fornum;


$(function(){
    function getTimes(times){
        var jsonTime = {};
        jsonTime.nums=times.indexOf("|");
        if(jsonTime.nums!="-1"){
            jsonTime.jdTime=times.substr(0,19);
            jsonTime.xdTime=times.substring(jsonTime.nums+1,times.length);
            jsonTime.showTime=jsonTime.xdTime;
        }else{
            jsonTime.showTime=times;
        }
        return jsonTime;
    };
    function getscreateName(create_user){
        var itemloginName = '';
        $.ajax({
            url: ngUrl +"/users/"+create_user,
            cache: false,
            async: false,
            success: function (datas) {
                itemloginName = datas.data.userName;
            }
        });
        return itemloginName;
    }
    function getAjax(url,fun){
        $.ajax({
            type: "get",
            async: false,
            url: url,
            success: function(msg){
                fun(msg);
            }
        });
    }
    var itemid = /\?.*repname=([^&]*).*$/;
    if (itemid.test(decodeURIComponent(window.location.href))) {
        repname = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    $('.repname').html(repname);
    //得到rep详情
    var pages = 1;
    var itemdatas = [];
    function getrepname(pages) {
        itemdatas = [];
        $.ajax({
            url: ngUrl + "/repositories/" + repname + "?items=1&size=6&page="+pages,
            cache: false,
            async: false,
            success: function (msg) {
                $('.repcomment').html(msg.data.comment);
                preloginname = msg.data.create_user;
                paegeitems = msg.data.items;
                var times = msg.data.optime;
                var jsonTime = getTimes(times);
                $('.showtime').html(jsonTime.showTime);
                ///////////////////////////////////////////
                if(msg.data.dataitems != null){
                    for (i = 0; i < msg.data.dataitems.length; i++) {
                        itemdatas.push(msg.data.dataitems[i]);
                    }
                }

            }

        });

    }
    getrepname(1);
    //得到数据拥有方;
    getAjax(ngUrl +"/users/"+preloginname,function(msg){
        $('#cur_user').html(msg.data.userName).attr('href','dataOfDetails.html?username='+preloginname);
        $('.cur_link a').attr('href','dataOfDetails.html?username='+preloginname);
    });
    //返回rep的star量
    getAjax(ngUrl +"/star_stat/"+repname,function(msg){
        $('.star-value').html(msg.data.numstars);
    });
    var htmls = '';

    //返回该repositories的订阅量
    getAjax(ngUrl + "/subscription_stat/" +repname,function(msg){
        $(".subscript-value").html(msg.data.numsubs);
    });
    //返回该repositories的下载量
    getAjax(ngUrl + "/transaction_stat/" +repname,function(msg){
        $(".downloaded-value").html(msg.data.numpulls);
    });
    //得到item的数据拥有方
    function getscreateName(create_user){
        var itemloginName = '';
        $.ajax({
            url: ngUrl +"/users/"+create_user,
            cache: false,
            async: false,
            success: function (datas) {
                itemloginName = datas.data.userName;
            }
        });
        return itemloginName;
    }

    //填充列表
    function appendlist(){
        for(var i = 0;i<itemdatas.length;i++){
            getAjax(ngUrl+ "/repositories/" + repname + "/"+itemdatas[i],function(msg){
                itemloginName = getscreateName(msg.data.create_user);
                var datastyle = '';
                var itemdatatype = msg.data.pricestate
                if(itemdatatype == '免费'){
                    datastyle = 'freedata';
                }else if(itemdatatype == '付费'){
                    datastyle = 'paydata';
                }else{
                    datastyle = 'limitdata';
                }
                var str= '<a href="itemDetailsPhone.html?repname='+repname+'&itemname='+itemdatas[i]+'"><li class="liListwrop">'+
                    '<div style="width:100%;overflow: hidden;padding:15px 0;" class="borderb">'+
                    '<div class="listTop">'+repname+'/'+itemdatas[i]+'</div>'+
                    '<div class="listbt">数据拥有方：<span class="itemcur">'+itemloginName+'</span></div>'+
                    '<div class="listicon" ></div>'+
                    '<span class="pricestate '+datastyle +'">'+itemdatatype+'<'+datastyle +'/span>'+
                    '</div>'+
                    '</li></a>';
                $('.repinfoList').append(str);
            });

        }
    }
    appendlist();
    //var obj = $('.repinfo');
    //obj.addEventListener("touchstart",function(){
    //    alert();
    //});

    // 继续加载
    window.onscroll = function(){
        if(getScrollTop() + getWindowHeight() == getScrollHeight()){
            if(itemdatas.length>0){
                pages++;
                getrepname(pages);
                appendlist();
            }
        }
    };
})

//滚动条在Y轴上的滚动距离
function getScrollTop(){
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
        bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}
//文档的总高度
function getScrollHeight(){
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
        bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}
//浏览器视口的高度
function getWindowHeight(){
    var windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
        windowHeight = document.documentElement.clientHeight;
    }else{
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}
