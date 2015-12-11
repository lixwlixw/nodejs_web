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
        // async: false,
        url: url,
        success: function(msg){
            fun(msg);
        }
    });
}

var repos=[];
$(window).load(function(){
    $("#navigator").css("height",$("#lComs").height());
    $("#viewCon").css("min-height",document.body.clientHeight);
});
var paegeitems;
var paegeitems2;
$(document).ready(function(){
    var typevalue = getParam("type");
    var thisvalue = '';
    var pages = 1;
    $.ajax({
        url: ngUrl+"/select_labels",
        type: "get",
        cache:false,
        //async:false,
        dataType:'json',
        success:function(json){
            if(json.data.length!=0){
                var pages=json.data.length;
                for(var i=0;i<pages;i++){
                    $("#navigator-ul").append("<li><img src='images/nav_icon.png' style='margin-left:20px;margin-right:15px;'>"+json.data[i].labelname+"</img></li>");
                    $("#navigator-ul10").append("<li>"+json.data[i].labelname+"</li>");
                }
                if(typevalue == ''){

                    $("#navigator-ul li").eq(0).css({ color: "#0077aa", background: "#fff" });
                }else{
                    var lis = $('#navigator-ul li');
                    for(var i = 0;i<lis.length;i++){
                        if(lis[i].textContent == typevalue){
                            $(lis[i]).css({ color: "#0077aa", background: "#fff" });
                            return;
                        }
                    }

                }

            }else{

            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
    appendList(0);

    //左侧导航点击切换;
    $("body").on("click","#navigator-ul li",function(){
        $("#terminal-content-body").empty();
        $("#terminal-content-body").append("<div class='container-fluid' id='loading'><p style='float:left;margin-bottom:30px;width:100%;' class='text-center'>正在加载请稍后...</p></div>");
        repos = [];//数据清空
        $(".pages").empty();
        $(this).siblings().css("background-color","#f9f9f9").css("color","#666");
        $(this).siblings().removeClass("overs");
        if($(this).hasClass("overs")){
            $(this).removeClass("overs");
            $(this).css("background-color","#f9f9f9").css("color","#666");
            $("#allJ").text("全部精选");
            thisvalue = $(this).text();
            appendList2(0);
            $(".pages").pagination(paegeitems2, {
                maxentries:paegeitems2,
                items_per_page:10,
                num_display_entries: 1,
                num_edge_entries: 5 ,
                prev_text:"上一页",
                next_text:"下一页",
                ellipse_text:"...",
//  num_edge_entries:1,
                link_to:"javascript:void(0)",
                callback:appendList2,
                load_first_page:false
            });
        }else{
            //点击全部精选
            if($(this).text()=='全部精选'){
                $(this).addClass("overs");
                $(this).css("background-color","#fff").css("color","#0077aa");
                $("#allJ").text($(this).text()+"精选");
                thisvalue = $(this).text();
                appendList2(0);
                $(".pages").pagination(paegeitems2, {
                    maxentries:paegeitems2,
                    items_per_page:10,
                    num_display_entries: 1,
                    num_edge_entries: 5 ,
                    prev_text:"上一页",
                    next_text:"下一页",
                    ellipse_text:"...",
//  num_edge_entries:1,
                    link_to:"javascript:void(0)",
                    callback:appendList2,
                    load_first_page:false
                });
            }else{
                // 点击其他table
                $(this).addClass("overs");
                $(this).css("background-color","#fff").css("color","#0077aa");
                $("#allJ").text($(this).text()+"精选");
                thisvalue = $(this).text();
                appendList2(0);
                $(".pages").pagination(paegeitems2, {
                    maxentries:paegeitems2,
                    items_per_page:10,
                    num_display_entries: 1,
                    num_edge_entries: 5 ,
                    prev_text:"上一页",
                    next_text:"下一页",
                    ellipse_text:"...",
//  num_edge_entries:1,
                    link_to:"javascript:void(0)",
                    callback:appendList2,
                    load_first_page:false
                });
            }

        }

        if($("#lComs").height()>document.body.clientHeight){
            $("#navigator").css("height","auto").css("min-height",$("#lComs").height());
        }else{
            $("#navigator").css("height","auto").css("min-height",document.body.clientHeight);
        }
    });
    ////////////////////////////
    //  点击分类按分类发送请求
    function hanvelables(pages){
        alert(thisvalue)
        repos = [];
        var url = '';
        if(thisvalue == '全部精选'){
            url = ngUrl+"/selects?select_labels&size=10&page="+pages;
        }else{
            url = ngUrl+"/selects?select_labels="+thisvalue+"&size=10&page="+pages;
        }
        $.ajax({
            url: url,
            type: "get",
            cache:false,
            async:false,
            dataType:'json',
            success:function(json){
                if(json.data.select.length!=0){
                    paegeitems2 = json.data.total;
                    var fornums=json.data.select.length;
                    for(var i=0;i<fornums;i++){
                        repos.push([json.data.select[i].repname,json.data.select[i].itemname]);
                    }

                    addhtml(repos);
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
             urlt=ngUrl+"/selects?select_labels&size=10&page="+pages;
         }
        $.ajax({
            url: urlt,
            type: "get",
            cache:false,
            async:false,
            dataType:'json',
            success:function(json){
                if(json.data.select.length!=0){
                    var fornums=json.data.select.length;
                    paegeitems = json.data.total;
                    for(var i=0;i<fornums;i++){
                        repos.push([json.data.select[i].repname,json.data.select[i].itemname]);
                    }
                    addhtml(repos);

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
// 分页//页面加载时的分页；
      $(".pages").pagination(paegeitems, {
          maxentries:paegeitems,
          items_per_page:10,
          num_display_entries: 1,
          num_edge_entries: 5 ,
          prev_text:"上一页",
          next_text:"下一页",
          ellipse_text:"...",
//  num_edge_entries:1,
          link_to:"javascript:void(0)",
          callback:appendList,
          load_first_page:false
      });

//  加载全部数据
    function appendList(new_page_index){
        ajaxRe(new_page_index+1);
    }
    //按左侧导航分类发送请求加载数据；
    function appendList2(new_page_index){
        hanvelables(new_page_index+1)
    }
//  填充html代码；
    function addhtml(reposss){
        //返回该DataItem的订阅量
        var dataitemd = '';
        //返回该DataItem的pull量
        var dataitemdpullNum = '';
        //返回该DataItem的star量
        var dataitemdstarNum = '';
        $('#terminal-content-body').empty();
        for(var i= 0;i<reposss.length;i++) {
            getAjax(ngUrl + "/subscription_stat/" +reposss[i][0],function (msg) {
                dataitemd = msg.data.numsubs;
            });
            getAjax(ngUrl + "/transaction_stat/" +reposss[i][0]+"/"+repos[i][1],function (msg) {
                dataitemdpullNum = msg.data.numpulls;
            });
            getAjax(ngUrl + "/star_stat/" +reposss[i][0]+"/"+repos[i][1],function (msg) {
                dataitemdstarNum = msg.data.numstars;
            });
            //////////////  填充
            $.ajax({
                url: ngUrl+"/repositories/"+reposss[i][0]+"/"+reposss[i][1]+"?abstract=1",
                type: "get",
                cache:false,
                async:false,
                dataType:'json',
                success:function(json){
                    $("#loading").empty();
                    var vvclass="";
                    var label=json.data.label.sys.supply_style;
                    var labelV="";
                    if(label=="single"||label=="api"){
                        vvclass="api";
                        labelV="API";
                    }
                    if(label=="batch"){
                        vvclass="period";
                        labelV="批量数据";
                    }
                    if(label=="flow"){
                        vvclass="flot-data";
                        labelV="流式数据";
                    }

                    var times=json.data.optime;
                    var jdTime=times.substring(0, times.indexOf("|"));
                    var xdTime="";
                    var showTime="";
                    var nums=times.indexOf("|");
                    if(nums!="-1"){
                        showTime=times.substring(times.indexOf("|")+1,times.length);
                    }else{
                        showTime=times.substring(0, times.indexOf("."));
                    }
                    var realname="";
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
                            errorDialog($.parseJSON(json.responseText).code);
                            $('#errorDM').modal('show');
                        }
                    });
                    if(json.data.label != null && json.data.label != ''){
                        var ptags = json.data.label.owner;
                        var labelstr = '';
                        for(var j in ptags) {
                            labelstr+='<span class="personaltag">'+ptags[j]+'</span>';
                        }
                    }
                    $("#terminal-content-body").append(""+
                        "<div class='selectBody' style='background:#fff;float:left;margin-bottom:30px;'>"+
                        "<div class='repo-head'>"+
                        "<div class='tab-head-div'><a style='color:#0077aa' target='_blank' href='itemDetails.html?repname="+reposss[i][0]+"&itemname="+reposss[i][1]+"'>"+reposss[i][0]+"&nbsp;&nbsp;<span style='color:#000;'>/</span>&nbsp;&nbsp;"+reposss[i][1]+"</a></div>"+
                            //	"<div class='tab-head-icon'></div>"+
                        "<div class='repo-head-right'>数据拥有方：<a href='dataOfDetails.html?username="+json.data.create_user+"'>"+realname+"</a></div>"+
                        "</div>"+
                        "<div class='repo-body'>"+
                        "<div id='repo-text'>"+json.data.comment+"</div>"+
                        "<div class='repo-body-tail'>"+
                        "<div class='repo-body-tail-left'>"+
                        "<div class='updatetime-icon' title='更新时间'></div>"+
                        "<div class='updatetime-value' title='"+jdTime+"'>"+showTime+"</div>"+
                        "<div class='tag-icon' title='tag数量'></div>"+
                        "<div class='tag-value'>"+json.data.tags+"</div>"+
                        "</div>"+
                        "<div class='repo-body-tail-mid'>"+
                        "<div class="+vvclass+">"+labelV+"</div>"+labelstr+
                        "</div>"+
                        "<div class='repo-body-tail-right'>"+
                        "<div class='shwr'>"+
                        "<div class='star-icon' title='star量'></div>"+
                        "<div class='star-value'>"+dataitemdstarNum+"</div>"+
                        "<div class='subscript-icon' title='订购量'></div>"+
                        "<div class='subscript-value'>"+dataitemd+"</div>"+
                        "<div class='downloaded-icon' title='pull量'></div>"+
                        "<div class='downloaded-value'>"+dataitemdpullNum+"</div>"+
                        "</div>"+
                        "</div>"+
                        "</div>"+
                        "</div>"+
                        "</div>"
                    );
                    

                },
                error:function(json){
                    errorDialog($.parseJSON(json.responseText).code);
                    $('#errorDM').modal('show');
                }
            });
             $(".be-loader").hide();
        }

    }


});








