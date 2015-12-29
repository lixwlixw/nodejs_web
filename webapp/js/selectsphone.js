/**
 * Created by Administrator on 2015/12/2.
 */
function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
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

var repos=[];
$(window).load(function(){
    $(".be-loader").fadeOut("slow");
    $("#navigator").css("height",$("#lComs").height());
    $("#viewCon").css("min-height",document.body.clientHeight);
});
var paegeitems;
var paegeitems2;

$(document).ready(function(){
    var pages = 1;
    var thisvalue = '';
    $.ajax({
        url: ngUrl+"/select_labels",
        type: "get",
        cache:false,
        dataType:'json',
        success:function(json){
            var bgarr = [];
            if(json.data.length!=0){
                var fornum=json.data.length;
                bgarr = json.data;
                var aa = parseInt(fornum / 8);
                var bb = fornum % 8 -1;
                var navpage = 0;
                for(var i = 0;i<aa;i++){
                    var lilist = '<li class="li'+ navpage +'"></li>';
                    $('.topnavlistwrop').append(lilist);
                    for(var j=1;j<=8;j++){
                        var thisssss = navpage*8+j;
                        var str =  '<div class="imgwrop">'+
                            "<div class='selectimgwrop select' style='background-image:url(\"images/"+json.data[thisssss].icon+".png\")'>"+
                            '</div>'+
                            '<p>'+json.data[thisssss].labelname +'</p>'+
                            '</div>';
                        $('.li'+navpage).append(str);
                    }
                    navpage++;
                }
                var lilist = '<li class="li'+ navpage +'"></li>';
                $('.topnavlistwrop').append(lilist);
                for(var j=0;j<bb;j++){
                    var thisnum = navpage*8+j+1;
                    var str =  '<div class="imgwrop">'+
                        "<div class='selectimgwrop select' style='background-image:url(\"images/"+json.data[thisnum].icon+".png\")'>"+
                        '</div>'+
                        '<p>'+json.data[thisnum].labelname +'</p>'+
                        '</div>';
                    var lilist = '<li class="li'+ navpage +'"></li>';
                    $('.li'+navpage).append(str);
                }
                for(var i = 0;i<=navpage;i++){
                    var spans = "<span></span>";
                    $('.focus-inner').append(spans);
                }
                $("#topNav").touchSlider({
                    flexible : true,
                    speed : 200,
                    paging : $(".focus-con span"),
                    counter : function (e) {
                        $(".focus-con span").removeClass("on").eq(e.current-1).addClass("on");
                    }
                });
                $("#topNav").bind("mousedown", function() {
                    $dragBln = false;
                })
                $("#topNav").bind("dragstart", function() {
                    $dragBln = true;
                })
            }
        },
        error:function(json){
            alert("程序出错，请稍后重试");
        }
    });
    var typevalue = getParam("type");
    if(typevalue == ''){
        appendList(1);
    }
    if(typevalue != ''){
        $('.repinfo').html(typevalue);
        appendList2(1,typevalue);
    }

    //左侧导航点击切换;
    $(".topbox").on("click",".imgwrop",function(){
        thisvalue = $(this).children('p').text();
        if(thisvalue == '更多'){
            $('#topNav>div:gt(7)').show();
        }else{
            $(".repinfoList").empty();
            repos = [];//数据清空
            $('.repinfo').html(thisvalue);
            appendList2(1,thisvalue);
        }

        //}
    });
    ////////////////////////////
    //  点击分类按分类发送请求
    function hanvelables(pages,thisvalue){
        repos = [];
        $.ajax({
            url: ngUrl+"/selects?select_labels="+thisvalue+"&size=5&page="+pages,
            type: "get",
            cache:false,
            async:false,
            dataType:'json',
            success:function(json){
                if(json.data.select.length!=0){
                    paegeitems2 = json.data.total;
                    var selectlength=json.data.select.length;
                    for(var i=0;i<selectlength;i++){
                        repos.push([json.data.select[i].repname,json.data.select[i].itemname]);
                    }
                }else{
                    console.log("报错");
                }
            },
            error:function(json){
                alert("程序出错，请稍后重试");
            }
        });
    }
    ////////////////////////////
    // 进如页面默认请求全部数据，点击全部精选也发送此请求；
    function ajaxRe(pages){
        var urlt="";
        repos = [];
        var type=getParam("type");
        if(type!=""){
            urlt=ngUrl+"/selects?select_labels="+type;
            $("#allJ").text(type+"精选");
        }else{
            urlt=ngUrl+"/selects?select_labels&size=5&page="+pages;
        }
        $.ajax({
            url: urlt,
            type: "get",
            cache:false,
            async:false,
            dataType:'json',
            success:function(json){
                if(json.data.select.length!=0){
                    var selectlength=json.data.select.length;
                    paegeitems = json.data.total;
                    for(var i=0;i<selectlength;i++){
                        repos.push([json.data.select[i].repname,json.data.select[i].itemname]);
                    }

                }else{
                    console.log("报错");
                }
            },
            error:function(json){
                alert("程序出错了，请稍后重试");
            }
        });
    }
//  加载全部数据
    function appendList(pages){
        ajaxRe(pages);
        addhtml();
    }
    //按左侧导航分类发送请求加载数据；
    function appendList2(pages,thisvalue){
        hanvelables(pages,thisvalue)
        addhtml();
    }
//  填充html代码；
    function addhtml(){
        $('#terminal-content-body').empty();

        for(var i= 0;i<repos.length;i++) {
            //////////////  填充
            $.ajax({
                url: ngUrl+"/repositories/"+repos[i][0]+"/"+repos[i][1],
                type: "get",
                cache:false,
                async:false,
                dataType:'json',
                success:function(json){
                    $("#loading").empty();
                    var realname="";
                    var datastyle = '';
                    var itemdatatype = json.data.pricestate
                    if(itemdatatype == '免费'){
                        datastyle = 'freedata';
                    }else if(itemdatatype == '付费'){
                        datastyle = 'paydata';
                    }else{
                        datastyle = 'limitdata';
                    }
                    //该用户昵称
                    $.ajax({
                        url: ngUrl+"/users/"+json.data.create_user,
                        type: "get",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){
                                realname=json.data.userName;
                            }else {
                                console.log("报错");
                            }
                        },
                        error:function(json){
                            alert("程序出错，请稍后重试");
                        }
                    });
                    var str =   '<li class="replist">'+
                        '<div class="liconwrop borderb">'+
                        '<div class="listTop"><a href="itemDetailsPhone.html?repname='+repos[i][0]+'&itemname='+repos[i][1]+'">'+repos[i][0]+'/'+ repos[i][1]+'</a></div>'+
                        '<div class="listbt">本数据由：<span class="itemcur">'+realname+'</span>&nbsp;提供</div>'+
                        '<div class="listicon"><a href="itemDetailsPhone.html?repname='+repos[i][0]+'&itemname='+repos[i][1]+'"></a></div>'+
                        '<span class="pricestate '+datastyle +'">'+itemdatatype+'<'+datastyle +'/span>'+
                    '</div>'+
                    '</li>'
                    $(".repinfoList").append(str);
                },
                error:function(json){
                    alert("程序出错，请稍后重试");
                }
            });

        }
    }
    ////////////////////////返回顶部

    $('.gotop').click(function(){
        document.body.scrollTop =0;
    })
    // 继续加载
    window.onscroll = function(){
        if(getScrollTop() > getWindowHeight()/2){
            $('.gotop').show();
        }else{
            $('.gotop').hide();
        }
        if(getScrollTop() + getWindowHeight() == getScrollHeight()){
            //$('.btboxinfo').show(600);
            if(thisvalue == ''&& repos.length>0){
                pages++;
                appendList(pages);
            }
            if(thisvalue != '' && repos.length>0){
                pages++;
                appendList2(pages,thisvalue);
            }
        }
    };

});

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







