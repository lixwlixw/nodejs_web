/**
 * Created by Administrator on 2015/12/4.
 */
var rtext='';
var itemid = /\?.*rtext=([^&]*).*$/;
if (itemid.test(decodeURIComponent(window.location.href))) {
    rtext = itemid.exec(decodeURIComponent(window.location.href))[1];
}

var data={};
if(rtext!=""){
    data={"text":rtext};
}
var repos=[];
var reposnum = 0;
var totals=0;
var fornum = 0;
$(function(){
    var pages = 1;
    function getrepname(pages) {
        repos = [];
        $.ajax({
            url: ngUrl+"/search?size=6&page="+pages,
            type: "get",
            cache:false,
            data:data,
            async:false,
            dataType:'json',
            success:function(json){
                if(json.data.length!=0){
                    fornum =json.data.results.length;
                    totals=json.data.total;
                    $(".searchNum").text(totals);
                    for(var i=0;i<fornum;i++){
                        repos.push([json.data.results[i].repname,json.data.results[i].itemname]);
                    }
                    reposnum = repos.length;
                }else{
                    console.log("报错");
                }
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    }
    getrepname(pages);

    var datastyle = '';
    var itemdatatype = '';
    function getcreate_user(repname,itemname) {
        var create_user = '';
        $.ajax({
            url: ngUrl+"/repositories/"+repname+"/"+itemname,
            type: "get",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            success:function(json){
                create_user = json.data.create_user;
                datastyle = '';
                itemdatatype =  json.data.pricestate;
                if(itemdatatype == '免费'){
                    datastyle = 'freedata';
                }else if(itemdatatype == '付费'){
                    datastyle = 'paydata';
                }else if(itemdatatype == '限量免费'){
                    datastyle = 'limitdata';
                }else{
                    datastyle = '';
                }
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
        return create_user
    }
    function getusername(create_user){
        var realname = '';
        $.ajax({
            url: ngUrl+"/users/"+create_user,
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
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
        return realname
    }
    function addhtml(){
        for(var i=0;i<fornum;i++){
            var repname = repos[i][0];
            var itemname = repos[i][1];

            var create_user =  getcreate_user(repname,itemname);
            var username =  getusername(create_user);
            var str = '<a href="itemDetails.html?repname='+repname+'&itemname='+itemname+'"><li class="borderb">'+
                '<div class="listTop">'+repname+'/'+itemname+'</div>'+
                '<div class="listbt">数据拥有方：<span class="itemcur">'+username+'</span></div>'+
                '<div class="listicon"></div>'+
                '<span class="pricestate '+datastyle +'">'+itemdatatype+'<'+datastyle +'/span>'+
                '</li></a>';
            $('.repinfoList').append(str) ;
        }
    }
    addhtml();

    // 继续加载
    window.onscroll = function(){
        console.log(reposnum)
        if(getScrollTop() + getWindowHeight() == getScrollHeight()){
            if(reposnum>=6){
                pages++;
                getrepname(pages);
                addhtml();
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
