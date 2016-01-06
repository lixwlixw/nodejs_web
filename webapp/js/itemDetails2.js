/**
 * Created by Administrator on 2015/12/28.
 */
var login="";
$(function(){
    var tagNum="";
    var create_user="";
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    //item标题
    var titleName=(repoName+"/"+itemName);
    $("#titleName").text(titleName);
    $(".slideTxtBox").slide({trigger:"click"});
    yes_no_login();//判断是否登录
    gonextpage(0);//请求tag数据
    request();//请求tag数据

    star();//点赞
    starred2();

    itemName_pull();//itemName_pull量
    numsubs();//itemName_订购量
    about_item();//关于item

    company();//repo提供者

    switchover();//切换
    tablesheet();//表格样式

    closewrap();//关闭弹窗s
    $("#LT_left_icon .alert_login p a").click(function() {
        $(".modal-open").css("padding-right","15px");
        $('#myModal').modal('toggle');
    });



});
//获取reponame,itemname
function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
}
//判断是否注册
function yes_no_login(){
        if($.cookie("token")!=null&&$.cookie("token")!="null") {
            login="true";
            $(".content1_pullNumber span").css("display","inline-block");
        }
        else
        {
            login="false";
            $(".content1_pullNumber span").css("display","none");

        }
}

//分页
function request(){

    $(".pagination").pagination(tagNum, {
        maxentries:tagNum,
        items_per_page: 6,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:gonextpage,
        load_first_page:false
    });
}
//请求每一页的数据
function gonextpage(nextpages){
        var repoName = getParam("repname");
        var itemName = getParam("itemname");
        var nextpages = nextpages + 1;
       $("#left_content").empty();
        yes_no_login();
        var headerToken={};
        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }
        //tag信息
        $.ajax({
            url: ngUrl + "/repositories/" + repoName + "/" + itemName + "?page=" + nextpages,
            type: "GET",
            cache: false,
            async: false,
            dataType: 'json',
            success: function (json) {
                if (json.code == 0) {
                    tagNum = json.data.tags;
                    $("#nav1 > sup > span").text(tagNum);
                    var list_length = json.data.taglist.length;
                    var taglist = json.data.taglist;
                    for (var i = 0; i < list_length; i++) {
                        var tag_tag = taglist[i].tag;
                        var tag_comment = taglist[i].comment;
                        var tag_time = taglist[i].optime;

                        var $left_content = $("#left_content");
                        var $content = $("<div></div>").addClass("content").appendTo($left_content);
                        var $content1_title = $("<div></div>").addClass("content1_title").appendTo($content);
                        $content1_title.append($("<p></p>").text(tag_tag));
                        $content1_title.append($("<p></p>").text(tag_comment));

                        var $content1_time = $("<div></div>").addClass("content1_time").appendTo($content);
                        $content1_time.append("<span></span>");
                        $content1_time.append($("<span>2分钟以前</span>").text(tag_time));

                        var $content1_pullNumber = $("<div></div>").addClass("content1_pullNumber").appendTo($content);
                        $content1_pullNumber.append("<span></span>");
                        $content1_pullNumber.append("<span>Pull:0</span>");

                        var $content1_copy = $("<div></div>").addClass("content1_copy").appendTo($content);
                        var $content1_copy_div = $content1_copy.append("<div></div>");
                        $content1_copy_div.append($("<input type='text'>").attr("value", repoName + itemName + tag_tag).attr("id", "input_copy" + i));
                        var clipbtn = $("<button>复制</button>").attr("data-clipboard-action", "copy").attr("data-clipboard-target", "#input_copy" + i);
                        //复制功能
                        var clipboard = new Clipboard(clipbtn.get(0));
                        clipboard.on('success', function (e) {
                            alert("复制成功!");
                        });
                        clipboard.on('error', function (e) {
                            alert("暂不支持此浏览器,请手动复制或更换浏览器!");
                        });
                        //复制功能结束
                        $content1_copy_div.append(clipbtn);

                        var content1_download = $("<div></div>").addClass("content1_download").appendTo($content);
                        content1_download.append("<span></span>");
                        content1_download.append("<p>890266</p>");




                        //获取tag的pull量
                            $.ajax({
                                url: ngUrl + "/transaction_stat/" + repoName + "/" + itemName + "/" + tag_tag,
                                type: "GET",
                                cache: false,
                                async: false,
                                dataType: 'json',
                                headers:headerToken,
                                success: function (json) {
                                    if (json.code == 0) {
                                        $(".content1_pullNumber span:nth-child(2)").text("pull:" + json.data.nummypulls);
                                        $(".content .content1_download>p").text(json.data.numpulls);
                                    }
                                },
                                error: function () {
                                    errorDialog($.parseJSON(json.responseText).code);
                                    $('#errorDM').modal('show');
                                }
                            });
                    }
                }
            },
            error: function () {
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
}
//点赞功能
function star(){

        var repoName = getParam("repname");
        var itemName = getParam("itemname");
        var numstars = "";
        //对star数据进行更新
        $.ajax({
            url: ngUrl + "/star_stat/" + repoName + "/" + itemName,
            type: "GET",
            cache: false,
            async: false,
            dataType: 'json',
            success: function (json) {
                numstars = json.data.numstars;
                $("#icon_heart_number").text(numstars);

            },
            error: function () {

            }
        });
        $("#icon_heart").click(function () {
            if(login=="true") {
                $.ajax({
                    //获取star状态
                    url: ngUrl + "/star/" + repoName + "/" + itemName,
                    type: "GET",
                    cache: false,
                    async: false,
                    dataType: 'json',
                    headers: {Authorization: "Token " + $.cookie("token")},
                    success: function (json) {
                        if (json.data.starred) {
                            $("#icon_heart").css({
                                "background-image": "url('/images/icon_heart.png')",
                                "background-repeat": "no-repeat",
                                "background-position": "0px 1px",
                                "display": "inline-block",
                                "width": "25px",
                                "height": "25px"
                            });
                            //返回去star==0状态
                            $.ajax({
                                url: ngUrl + "/star/" + repoName + "/" + itemName + "?star=0",
                                type: "PUT",
                                cache: false,
                                async: false,
                                dataType: 'json',
                                headers: {Authorization: "Token " + $.cookie("token")},
                                success: function (json) {
                                    if (json.code == 0) {
                                        //对star数据进行更新
                                        $.ajax({
                                            url: ngUrl + "/star_stat/" + repoName + "/" + itemName,
                                            type: "GET",
                                            cache: false,
                                            async: false,
                                            dataType: 'json',
                                            //headers: {Authorization: "Token " + $.cookie("token")},
                                            success: function (json) {
                                                numstars = json.data.numstars;
                                                $("#icon_heart_number").text(numstars);
                                            },
                                            error: function () {

                                            }
                                        });
                                    }

                                },
                                error: function () {

                                }
                            });
                        }
                        else {
                            $("#icon_heart").css({
                                "background-image": "url('/images/icon_heart2.png')",
                                "background-repeat": "no-repeat",
                                "background-position": "0px 1px",
                                "display": "inline-block",
                                "width": "25px",
                                "height": "25px"
                            });
                            //返回去star==1状态
                            $.ajax({
                                url: ngUrl + "/star/" + repoName + "/" + itemName + "?star=1",
                                type: "PUT",
                                cache: false,
                                async: false,
                                dataType: 'json',
                                headers: {Authorization: "Token " + $.cookie("token")},
                                success: function (json) {
                                    if (json.code == 0) {
                                        //对star数据进行更新
                                        $.ajax({
                                            url: ngUrl + "/star_stat/" + repoName + "/" + itemName,
                                            type: "GET",
                                            cache: false,
                                            async: false,
                                            dataType: 'json',
                                            //headers: {Authorization: "Token " + $.cookie("token")},
                                            success: function (json) {
                                                numstars = json.data.numstars;
                                                $("#icon_heart_number").text(numstars);
                                            },
                                            error: function () {

                                            }
                                        });
                                    }

                                },
                                error: function () {

                                }
                            });
                        }
                    }
                });
            }
            else
            {
                $(" .alert_login").css({"display":"block","left":"420px"}).show();
            }
        })

}
//获取star状态并赋予相应心形状态
function starred2(){
    yes_no_login();
    if(login=="true"){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        //获取star状态
        url: ngUrl+"/star/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.data.starred==false){
                $("#icon_heart").css({"background-image":"url('/images/icon_heart.png')",
                    "background-repeat":"no-repeat",
                    "background-position":"0px 1px",
                    "display":"inline-block",
                    "width":"25px",
                    "height":"25px"});
            }
            else {
                $("#icon_heart").css({"background-image":"url('/images/icon_heart2.png')",
                    "background-repeat":"no-repeat",
                    "background-position":"0px 1px",
                    "display":"inline-block",
                    "width":"25px",
                    "height":"25px"});
            }


        }
    });
    }
    else {

    }

}
//点赞功能结束
//获取itemName的pull量
function itemName_pull(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        url: ngUrl+"/transaction_stat/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                $("#icon_download+p").text(json.data.numpulls);
            }
        },
        error:function(){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
}
//返回该DataItem的订购量
function numsubs(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        url: ngUrl+"/subscription_stat/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                //$(".content1_pullNumber span:nth-child(2)").text("pull:"+json.data.nummypulls);
                $("#icon_buy+p").text(json.data.numsubs);
            }
        },
        error:function(){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
}
//关于itemName的内容
function about_item(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $("#client_down p:nth-child(2)").text(repoName);

    $.ajax({
        url: ngUrl+"/repositories/"+repoName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                $("#about>h3").text("关于"+itemName);
                $("#about>article").text(json.data.comment);
                $(".span_time span:nth-child(2)").text(json.data.optime);
                var label=json.data.label;
                if(label==null){
                }
                else{
                    $(".span_label").append($("<span></span>").text(json.data.label));
                }
            }
        },
        error:function(){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });

}
//获得公司名称
//付费状态
function company(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        url: ngUrl+"/repositories/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json) {
            //company
            var create_user=json.data.create_user;
            var Sample=json.data.Sample;//样例数据
            $("#left_exam p:nth-child(2)").text(Sample);
            var Meta=json.data.Meta;//元数据
            $("#left_unit p:nth-child(2)").html(marked(Meta));

            var pricestate=json.data.pricestate;//获取付费状态
            var price=json.data.price;//计费方式
            var price_length=price.length;
            for(var i=0;i<price_length;i++)
            {
                var expire=price[i].expire;//有效期
                var money=price[i].money;//money
                var times=price[i].times;//次数
                $("#LT-right .form-control").append($("<option></option>").attr("value",i+1).text(money+"元"+times+"次,"+"有效期"+expire+"天"))
            }
            //获取付费状态
            if(pricestate=="免费")
            {
                $("#button_buy>p").text("免费").css({"height":"2.1em","margin-top":"40px","border":"1px solid #f49f12","color":"#f49f12"});
            }
            if(pricestate=="限量免费")
            {
                $("#button_buy>p").text("限量试用").css({"height":"3.2em","margin-top":"30px"});
            }
            if(pricestate=="付费")
            {
                $("#button_buy>p").text("付费").css({"height":"2.1em","margin-top":"40px"});
            }
            //通过创建者获取username
            $.ajax({
                url: ngUrl+"/users/"+create_user,
                type: "GET",
                cache:false,
                async:false,
                dataType:'json',
                //headers:{Authorization:"Token "+$.cookie("token")},
                success:function(j) {
                    //company
                    if(j.code==0){
                        company_name= j.data.userName;
                        $("#client_down p span").text(company_name);
                    }

                },
                error:function(){

                }
            });
        },
        error:function(){

        }
    });

}
function switchover(){
    $("#left_exam").hide();
    $("#left_unit").hide();
    $("#left_comment").hide();
    $("#nav1").on("click",function(){
        $("#left_exam").hide();
        $("#left_unit").hide();
        $("#left_comment").hide();
        $(".pagination").show();
        $("#left_content").fadeIn();

    });
    $("#nav2").on("click",function(){
        $("#left_content").hide();
        $("#left_unit").hide();
        $(".pagination").hide();
        $("#left_comment").hide();
        $("#left_exam").fadeIn();
    });
    $("#nav3").on("click",function(){
        $("#left_exam").hide();
        $("#left_content").hide();
        $(".pagination").hide();
        $("#left_comment").hide();
        $("#left_unit").fadeIn();
    });
    $("#nav3").on("click",function(){
        $("#left_exam").hide();
        $("#left_content").hide();
        $(".pagination").hide();
        $("#left_comment").hide();
        $("#left_unit").fadeIn();
    });
    $("#nav4").on("click",function(){
        $("#left_exam").hide();
        $("#left_content").hide();
        $(".pagination").hide();
        $("#left_unit").hide();
        $("#left_comment").fadeIn();
    });
}
function tablesheet(){
    $("#left_unit table tbody tr:odd").css({"background-color":"#f3f3f3","height":"35px","width":"60px"});
    $("#left_unit table tbody tr:even").css({"background-color":"#f1f6fa","height":"35px","width":"60px"});
}
//关闭弹窗 点击订购
function closewrap(){
    yes_no_login();
    $(window).load(function() {
        $(document).bind("click", function (e) {
            if ((e.target.className.indexOf("alert_login")<0 && e.target.id != "icon_heart"&&e.target.className.indexOf("btn")<0)) {
                $(".alert_login").css("display","none");
            }
        });

        $("#button_buy button").click(function(){

            var repoName=getParam("repname");
            var itemName=getParam("itemname");
            if(login=="false"){
                $(".alert_login").css({"display":"block","left":"706px"}).show();
            }else {

                $('#subscriptDialog').on("hidden.bs.modal",function() {//从新初始化
                        $("#subscriptDialog .subprocess .midle").text("60S");
                        $("#subscriptDialog .modal-dialog").css({width:"758px"});
                        $("#subscriptDialog .modal-header").show();
                        $("#subscriptDialog .subcontent").show();
                        $("#subscriptDialog .subprocess").hide();
                        $("#subscriptDialog .subafterprocess .successed").hide();
                        $("#subscriptDialog .subafterprocess .failed").hide();
                    });
                $("#subscriptDialog").modal('toggle');
                $("#subscriptDialog .modal-body .subbtns .cancel").click(function() {
                    $('#subscriptDialog').modal('toggle');
                });
                $("#subscriptDialog .modal-body .subbtns .submit").click(function() {
                    //TODO 没有提交的数据：甲方、乙方、合同订购日期
//					var usera = $.cookie("tname");
//					var userb = create_user;
//					var date = $("#subscriptDialog .modal-body .subdate .dvalue").text();
                    var repname = getParam("repname");
                    var itemname = getParam("itemname");
                    var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";

                    //process
                    $("#subscriptDialog .modal-header").hide();
                    $("#subscriptDialog .subcontent").hide();
                    $("#subscriptDialog .subprocess").show();
                    $("#subscriptDialog .modal-dialog").css({width:"540px"});
                    var i = 59;
                    timer = setInterval(function() {
                        $("#subscriptDialog .subprocess .midle").text(i+"S");
                        i--;
                        if(i == 0){
                            clearInterval(timer);
                            $("#subscriptDialog .modal-header").show();
                            $("#subscriptDialog .subprocess").hide();
                            $("#subscriptDialog .subafterprocess .failed").show();
                        }
                    },1000);
                });
                //订购合同
                var timer;
                var data = {"price":{}};
                var charge = $("#subscriptDialog .modal-body .sub3 .charge-body .chargeitem input:radio:checked").closest(".chargeitem");
                var planid = charge.find(".moneyu:first").attr("mark").toString();
                //订购
                $.ajax({
                    url: ngUrl+"/subscription/"+repname+"/"+itemname,
                    type: "PUT",
                    cache:false,
                    //	data:JSON.stringify(data),
                    data:JSON.stringify({"subscriptionid":subscriptionid,"planid":planid}),
                    async:false,
                    dataType:'json',
                    headers:header,
                    success:function(json){
                        if(json.code == 0){
                            setTimeout(function() {
                                clearInterval(timer);
                                $("#subscriptDialog .modal-header").show();
                                $("#subscriptDialog .subprocess").hide();
                                $("#subscriptDialog .subafterprocess .successed").show();
                                $("#subscriptDialog .subafterprocess .failed").hide();
                                var stars = parseInt($("#dataitem-head-right .subscript .value").text());
                                $("#dataitem-head-right .subscript .value").text(stars+1);
                            }, 1000)
                        }else {
                            clearInterval(timer);
                            $("#subscriptDialog .modal-header").show();
                            $("#subscriptDialog .subprocess").hide();
                            $("#subscriptDialog .subafterprocess .successed").hide();
                            $("#subscriptDialog .subafterprocess .failed").show();
                        }
                    },
                    error:function(json){
                        errorDialog($.parseJSON(json.responseText).code);
                        $('#errorDM').modal('show');
                    }
                });
            }
        });
    });
}
