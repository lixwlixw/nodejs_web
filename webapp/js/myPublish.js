/**
 * Created by Administrator on 2015/12/9.
 */


$(function() {

    //addRep
    $("#publish-head .add-icon").click(function() {

        var display=$("#judgment").css("display");
        if(display=="none")
        {
            $("#judgment").css("display","block");
        }
        if(display=="block")
        {
            $("#judgment").css("display","none");
        }
        $("#judgment_number").css("display","none");

    });
    //修改新增repo开始
    //开放repo
    $("#openRepo").click(function(){
        //判断是否有配额数
        $.ajax({
            url: ngUrl+"/quota/"+$.cookie("tname")+"/repository",
            type:"get",
            cache:false,
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(data){
                var usePublic=data.data.usePublic;
                var quotaPublic=data.data.quotaPublic;
                var uq_public=quotaPublic-usePublic;

                if(uq_public>0)
                {
                    $("#addRep .submit input").attr("repevent", "add");
                    $("#addRep .head .title").text("新增Repository");
                    $("#addRep .repname .value input").removeAttr("disabled");
                    $("#addRep .repname .value input").val("");
                    $("#addRep .repcomment .value textarea").val("");
                    $("#addRep .repname .key .promt").show();
                    $('#addRep').modal('toggle');
                    $("#addRep .property .value p").text("开  放");
                    $("#judgment").css("display","none");
                    $("#ListManagement").css("display","none");
                }else {
                    $("#judgment_number").css("display","block");
                    $("#judgment").css("display","none");
                 /*   $(document).bind("click",function(e){
                        var target= e.target;
                        if((target.className.indexOf("#judgment_number")<0))
                        {
                            $("#judgment_number").css("display","none");
                        }
                    });*/
                }
            }

        });
    });
    //新增私有repo
    $("#privateRepo").click(function(){
        //判断是否有配额数
        $.ajax({
            url: ngUrl+"/quota/"+$.cookie("tname")+"/repository",
            type:"get",
            cache:false,
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(data){

                var usePrivate=data.data.usePrivate;
                var quotaPrivate=data.data.quotaPrivate;
                var uq_private=quotaPrivate-usePrivate;
                if(uq_private>0)
                {
                    $("#addRep .submit input").attr("repevent", "add");
                    $("#addRep .head .title").text("新增Repository");
                    $("#addRep .repname .value input").removeAttr("disabled");
                    $("#addRep .repname .value input").val("");
                    $("#addRep .repcomment .value textarea").val("");
                    $("#addRep .repname .key .promt").show();
                    $('#addRep').modal('toggle');
                    $("#addRep .property .value p").text("私  有");
                    $("#judgment").css("display","none");
                }else {
                    $("#judgment_number").css("display","block").slideDown(2000);
                    $("#judgment").css("display","none");
                }
            }

        });
/*        $(document).bind("click",function(e){
            var target= e.target;
            if((target.className.indexOf("#judgment_number")<0)&&(target.className.indexOf("#privateRepo")<0))
            {
                $("#judgment_number").css("display","none");
            }
        })*/



    });

    $("#addRep .submit input").click(function() {
        var method = "POST";
        var data = {};
        repname = $.trim($("#addRep .repname .value input").val());
        data["comment"] = $.trim($("#addRep .repcomment .value textarea").val());
        data["repaccesstype"] = $.trim($("#addRep .property .value p").val());
        if($(this).attr("repevent") == "add") {
            if(repname.search(/^[a-zA-Z0-9_]+$/) < 0) {
                alert('"Repository 名称"格式错误！');
                return;
            }else if(repname.length > 52){
                alert('"Repository 名称"太长！');
                return;
            }
            method = "POST";
        }else {
            method = "PUT";
        }
        if(data.comment.length > 200) {
            alert('"Repository 描述"太长！');
            return;
        }
        $.ajax({
            url: ngUrl+"/repositories/"+repname,
            type: method,
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            data:JSON.stringify(data),
            headers:{ Authorization:"Token "+$.cookie("token") },
            beforeSend:function(){
                $('#addRep .submit input').attr('disabled','disabled');
                $('#addRep .submit input').val("正在保存中");
            },
            complete:function(){
                $('#addRep .submit input').removeAttr('disabled');
                $('#addRep .submit input').val("提交");
            },
            success:function(json){
                if(json.code == 0){
                    location.reload();
                }
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
        $('#addRep').modal('toggle');
    });
    var allrepnums = 0;
    $.ajax({
        url: ngUrl+"/repositories?size=-1",
        type: "get",
        cache:false,
        data:{},
        async:false,
        dataType:'json',
        headers:{ Authorization:"Token "+$.cookie("token") },
        success:function(json){
            if(json.code == 0){
                allrepnums = json.data.length;
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });

    var reps ;
    //请求所有rep
    var nextpages = 1;
    function getreps(nextpages){
        reps = null;
        $.ajax({
            url: ngUrl+"/repositories?size=10&page="+nextpages,
            type: "get",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                if(json.code == 0){
                    reps = json.data;
                }
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    }
    getreps(1);
    //////////////////////////////////分页
    $(".pages").pagination(allrepnums, {
        maxentries:allrepnums   ,
        items_per_page: 10,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:gonextpage,
        load_first_page:false
    });

    //请求每个rep的详情
   function getrepcomment(){
       for(var i in reps) {
           var rep = reps[i];
           $.ajax({
               url: ngUrl+"/repositories/"+rep.repname+"?items=1",
               type: "get",
               cache:false,
               data:{items:1},
               async:false,
               dataType:'json',
               headers:{ Authorization:"Token "+$.cookie("token") },
               success:function(json){
                   if(json.code == 0){
                       for(var j in json.data) {
                           rep[j] = json.data[j];
                       }
                   }
               },
               error:function(json){
                   errorDialog($.parseJSON(json.responseText).code);
                   $('#errorDM').modal('show');
               }
           });
           //获取star量
           $.ajax({
               url: ngUrl+"/star_stat/"+rep.repname,
               type: "get",
               cache:false,
               data:{},
               async:false,
               dataType:'json',
               success:function(json){
                   if(json.code == 0){
                       rep["numstars"] = json.data.numstars;
                   }
               },
               error:function(json){
                   errorDialog($.parseJSON(json.responseText).code);
                   $('#errorDM').modal('show');
               }
           });
           //获取订阅量
           $.ajax({
               url: ngUrl+"/subscription_stat/"+rep.repname,
               type: "get",
               cache:false,
               data:{},
               async:false,
               dataType:'json',
               success:function(json){
                   if(json.code == 0){
                       rep["numsubs"] = json.data.numsubs;
                   }
               },
               error:function(json){
                   errorDialog($.parseJSON(json.responseText).code);
                   $('#errorDM').modal('show');
               }
           });
           //获取下载量
           $.ajax({
               url: ngUrl+"/transaction_stat/"+rep.repname,
               type: "get",
               cache:false,
               data:{},
               async:false,
               dataType:'json',
               success:function(json){
                   if(json.code == 0){
                       rep["numpulls"] = json.data.numpulls;
                   }
               },
               error:function(json){
                   errorDialog($.parseJSON(json.responseText).code);
                   $('#errorDM').modal('show');
               }
           });
       }
   }
    getrepcomment();
    function gonextpage(nextpages){
        getreps(nextpages+1);
        getrepcomment();
        writeDom(nextpages+1);
    }
    writeDom("-1");
    //折叠筐：显示和隐藏每个rep的item列表
    $(document).on('click','#publish-body .repolist .describe',function () {
        var thos = $(this);
        //获取仓库名
        var repname = $(this).find(".head .head-text").text();
        //请求item详情
        var rep = getRep(reps, repname);
        //没有item就不请求，直接返回，也不折叠items列表
        if(rep.items == 0 || rep.dataitems == undefined) {
            rep.dataitems = [];
        }
        //如果没有请求过dataitems就请求，已经请求过就跳过
        if((rep.dataitems.length > 0 && rep.dataitems[0].name == undefined) ||
            (rep.dataitems.length == 0 && thos.next(".tablelist").length == 0)) {
            $("#loaddiv").css({
                top:thos.offset().top+"px",
                left:thos.offset().left+"px",
                width:thos.width()+40,
                height:(thos.height()+43)+"px",
                lineHeight:(thos.height()+40)+"px",
            }).slideToggle("fast",function() {
                for (var j in rep.dataitems) {
                    var item = rep.dataitems[j];
                    $.ajax({
                        url: ngUrl + "/repositories/" + rep.repname + "/" + item,
                        type: "get",
                        cache: false,
                        data: {items: 1},
                        async: false,
                        dataType: 'json',
                        headers: {Authorization: "Token " + $.cookie("token")},
                        success: function (json) {
                            if (json.code == 0) {
                                rep.dataitems[j] = json.data;
                            }
                        },
                        error: function (json) {
                            errorDialog($.parseJSON(json.responseText).code);
                            $('#errorDM').modal('show');
                        }
                    });
                    rep.dataitems[j]["name"] = item;
                }
                if(thos.next(".tablelist").length == 0) {
                    //创建tablelist
                    var tablelist = $("<div></div>").addClass("tablelist").css("display", "none").appendTo(thos.parent());
                    var dtable = $("<div></div>").addClass("dtable").appendTo(tablelist);
                    var dhead = $("<div></div>").addClass("dhead").appendTo(dtable);
                    dhead.append($("<span><b>DateItem name</b></span>").addClass("col1"));
                    dhead.append($("<span><b>更新时间</b></span>").addClass("col2"));
                    dhead.append($("<span><b>属性</b></span>").addClass("col3"));
                    dhead.append($("<span><b>Tag数量</b></span>").addClass("col4"));
                    var dbody = $("<div></div>").addClass("dbody").appendTo(dtable);
                    for(var i in rep.dataitems) {
                        var item = rep.dataitems[i];
                        var row = $("<div></div>").addClass("row").appendTo(dbody);
                        row.append($("<span></span>").addClass("col1").append($("<a></a>").text(item.name).attr("href", "myItemDetails.html?repname="+rep.repname+"&itemname="+item.name)));
                        var showtime = item.optime.substring(item.optime.indexOf("|")+1,item.optime.length);
                        var titletime = item.optime.substring(0,item.optime.indexOf("."));
                        row.append($("<span></span>").addClass("col2").text(showtime).attr("title", titletime));
                        row.append($("<span></span>").addClass("col3").text(item.itemaccesstype == "private" ? "私有":"开放"));
                        row.append($("<span></span>").addClass("col4").text(item.tags));
                    }
                    var dtail = $("<div></div>").addClass("dtail").appendTo(dtable);
                    var icons = $("<span></span>").appendTo(dtail);
//							icons.append($("<span></span>").addClass("icon1"));
                    icons.append($("<span></span>").addClass("icon2").append($("<a href='myItems.html?repname="+rep.repname+"'style='display:block;width:100%;height:100%;'></a>")));
                    if(rep.dataitems.length == 0) {
                        tablelist.children().hide();
                        var noitem = $("<div id='noitem'></div>").css({width:"100%", height:"50px",lineHeight:"50px", textAlign:"center", color:"gray", fontSize:"14px"})
                            .html('Repository下暂时没有发布DataItem，请下载<a href="clientDownload.html">Client</a>端新增DataItem')
                            .appendTo(tablelist);
                    }else {
                        tablelist.children().show();
                        if($("noitem").length > 0){
                            $("noitem").remove();
                        }

                    }
                }
                //动画
                var o = thos.next();
                o.toggle("fast");//垂直加水平动画
                $("#loaddiv").slideToggle("slow");
            });

        }
        //动画
        thos.next().toggle("fast");//垂直加水平动画

    });
    //把数据写入页面
    function writeDom(num) {
        $('.repolist').empty();
        //写仓库数量
        if(reps.length == 0){
           $('.norepnum').show();
        }else{
            $('.norepnum').hide();
        }
        if(num==-1){
           // $("#publish-body .repocount span").text(reps.length);
        	$("#publish-body .repocount span").text(allrepnums);
        }

        //写rep列表
        for(var i in reps) {
            var rep = reps[i];
            //创建reporecord
            var reporecord = $("<div></div>").addClass("reporecord").appendTo($("#publish-body .repolist"));
            //创建describe，并追加到reporecord
            var describe = $("<div></div>").addClass("describe").appendTo(reporecord);
            //创建head并追加到describe
            var head = $("<div></div>").addClass("head").appendTo(describe);
            head.append($("<span></span>").addClass("head-text").text(rep.repname));
//					head.append($("<span></span>").addClass("head-icon1"));
            head.append($("<span></span>").addClass("head-icon2"));
            //创建body，并追加到describe
            var body = $("<div></div>").addClass("body").text(rep.comment).appendTo(describe);
            //创建tail并追加到describe
            var tail = $("<div></div>").addClass("tail").appendTo(describe);
            //创建左侧icon并追加到tail
            var left = $("<span></span>").addClass("left").appendTo(tail);
            left.append($("<span></span>").addClass("left1-icon icon").attr("title", "更新时间"));
            var showtime = rep.optime.substring(rep.optime.indexOf("|")+1,rep.optime.length);
            var titletime = rep.optime.substring(0,rep.optime.indexOf("|"));
            left.append($("<span></span>").addClass("left1-value val").text(showtime).attr("title", titletime));
            left.append($("<span></span>").addClass("left2-icon icon").attr("title", "属性"));
            left.append($("<span></span>").addClass("left2-value val").text(rep.repaccesstype == "private" ? "私有":"开放"));
            left.append($("<span></span>").addClass("left3-icon icon").attr("title", "托管状态"));
            left.append($("<span></span>").addClass("left3-value val").text("非托管"));/*TODO 需要托管状态，暂时没有获取到*/
            left.append($("<span></span>").addClass("left4-icon icon").attr("title", "DataItem"));
            left.append($("<span></span>").addClass("left4-value val").text(rep.items));
            //创建右侧icon并追加到tail
            var right = $("<span></span>").addClass("right").appendTo(tail);
            right.append($("<span></span>").addClass("right1-icon icon").attr("title", "star量"));
            right.append($("<span></span>").addClass("right1-value val").text(rep.numstars));
            right.append($("<span></span>").addClass("right2-icon icon").attr("title", "订阅量"));
            right.append($("<span></span>").addClass("right2-value val").text(rep.numsubs));
            right.append($("<span></span>").addClass("right3-icon icon").attr("title", "pull量"));
            right.append($("<span></span>").addClass("right2-value val").text(rep.numpulls));
        }
        $("<div id='loaddiv'></div>").css({
            display:"none",
            position:"absolute",
            backgroundColor:"#fff",
            textAlign:"center",
            backgroundImage:"url('../images/loadingMd.gif')",
            backgroundPosition:"50% 50%",
            backgroundRepeat:"no-repeat",
            opacity:"0.7"
        }).appendTo($("#publish-body .repolist"));
    }
    //修改rep

    $(document).on('click','.reporecord .head .head-icon2',function(e) {
        $("#addRep .submit input").attr("repevent", "edit");
        $("#addRep .head .title").text("修改Repository");
        $("#addRep .repname .value input").attr("disabled", "disabled");
        $("#addRep .repname .key .promt").hide();
        var repname = $(this).parent().find(".head-text:first").text();
        $("#addRep .repname .value input").val(repname);
        $.ajax({
            url: ngUrl+"/repositories/"+repname,
            type: "GET",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                if(json.code == 0){
                    //转换中英私有和开放
                    if(json.data.repaccesstype=="public")
                    {
                        $("#addRep .property .value p").text("开  放");
                        $("#ListManagement").css("display","none");
                    }
                    if(json.data.repaccesstype=="private")
                    {
                        $("#addRep .property .value p").text("私  有");
                        $("#ListManagement").css("display","block");
                    }
                    $("#addRep .repcomment .value textarea").val(json.data.comment);
                    $("#ListManagement p span:first").empty();

                }
                $.ajax({
                    url: ngUrl + "/permission/" + repname,
                    type: "GET",
                    cache: false,
                    async: false,
                    dataType: 'json',
                    headers: {Authorization: "Token " + $.cookie("token")},
                    success:function(json){
                       var totalNumber=json.data.total;
                            $("#ListManagement p span:first").append("（"+totalNumber+"）");

                    }

                });

            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
        $('#addRep').modal('toggle');
        stopEventStrans(e);
    });
});
function stopEventStrans(e) {
    e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();//IE以外
    } else {
        e.cancelBubble = true;//IE
    }
}
function getRep(reps,repname) {
    for(var i in reps) {
        if(reps[i].repname == repname) {
            return reps[i];
        }
    }
}


$(document).ready(function() {
    //白名单初始化函数
function uuuuuuu(){
    var repname=$("#repnameInput").val();
    var total = "";
    $("#emailTest").val("");
    $("#modalRep_list").empty();
    //定义数组存储所有的白名单记录
    $.ajax({
        url: ngUrl + "/permission/"+repname,
        type: "get",
        cache: false,
        async: false,
        dataType: 'json',
        headers: {Authorization: "Token " + $.cookie("token")},
        success: function (json) {
            //	alert(json.length);
            //  console.log(json.data.length);
            total=json.data.total;
            if (json.code == 0) {
                //var len = json.data.length;
                //total = len;
                //if(total<=6) {
                //    for (var i = 0; i < total; i++) {
                //        //console.log("-----"+json.data.permissions[i].username);
                //        var username = json.data.permissions[i].username;
                //        if (username != undefined) {
                //            $("#modalRep_list").append("<div style='float:left;height:30px;background:#e5e5e5;margin-bottom:10px;width:100%;'><div style='float:left;height:30px;line-height:30px;'><input style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + username + "</input></div><div style='float:right;height:30px;line-height:30px;'><a class='deleteTest' href='javaScript:void(0);'>[删除]</a></div></div>");
                //        }
                //    }
                //}
                //else
                //{
                //    for (var i = 0; i < 6; i++) {
                //        //console.log("-----"+json.data.permissions[i].username);
                //        var username = json.data.permissions[i].username;
                //        if (username != undefined) {
                //            $("#modalRep_list").append("<div style='float:left;height:30px;background:#e5e5e5;margin-bottom:10px;width:100%;'><div style='float:left;height:30px;line-height:30px;'><input style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + username + "</input></div><div style='float:right;height:30px;line-height:30px;'><a class='deleteTest' href='javaScript:void(0);'>[删除]</a></div></div>");
                //        }
                //    }
                //}
                var len = json.data.permissions.length;
                for (var i = 0; i < len; i++) {
                    $("#modalRep_list").append("<div style='float:left;height:30px;background:#e5e5e5;margin-bottom:10px;width:100%;'><div style='float:left;height:30px;line-height:30px;'><input style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + json.data.permissions[i].username + "</input></div><div style='float:right;height:30px;line-height:30px;'><a class='deleteTest' href='javaScript:void(0);'>[删除]</a></div></div>");
                }
            }
        },
        error: function (json) {
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
    //分页
    $(".pagesPer").pagination(total, {
        items_per_page: 6,
        num_display_entries: 1,
        num_edge_entries: 5,
        prev_text: "上一页",
        next_text: "下一页",
        ellipse_text: "...",
        link_to: "javascript:void(0)",
        callback: nextpageadd,
        load_first_page: false
    });
}
    var totalPer = [];

    //新增白名单按钮
    $("#insert").click(function () {
        uuuuuuu();
        $('#myModalTest').modal('toggle');
    });
    function nextpageadd(nextpages) {
        var repname=$("#repnameInput").val();
        var nextpages = nextpages + 1;
        $("#modalRep_list").empty();
        $.ajax({
            url: ngUrl + "/permission/"+repname+"?page="+nextpages,
            type: "get",
            cache: false,
            async: false,
            dataType: 'json',
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function (json) {
                if (json.code == 0) {
                    var len = json.data.permissions.length;
                    for (var i = 0; i < len; i++) {
                        $("#modalRep_list").append("<div style='float:left;height:30px;background:#e5e5e5;margin-bottom:10px;width:100%;'><div style='float:left;height:30px;line-height:30px;'><input style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + json.data.permissions[i].username + "</input></div><div style='float:right;height:30px;line-height:30px;'><a class='deleteTest' href='javaScript:void(0);'>[删除]</a></div></div>");
                    }}
            },
            error: function (json) {
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });

    }
    //新增白名单
    $("#inList").click(function () {
        var username = $("#emailTest").val();
        var repname=$("#repnameInput").val();
        //判断用户名是否为空
            if (username != "") {
                var username = $("#emailTest").val();
                var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (!reg.test(username) ){
                    $("#mess").addClass("errorMess").css({"visibility": "visible","background-color":"#ffd1d1","color":"#ff0000"}).text("邮箱格式不正确").fadeIn();
                    $(".errorMess").fadeOut(3000);
                    uuuuuuu();

                }
                else {
                var b=true;
                    //判断名称是否注册
                $.ajax({
                    url: ngUrl + "/users/"+username ,
                    type: "get",
                    cache: false,
                    async: false,
                    headers: {Authorization: "Token " + $.cookie("token")},
                    datatype: 'json',
                    success:function(json){
                        if(json.code!=0){
                            b=false;
                        }
                    }
                });
                if(b){
                    //说明已经注册了，判断是否重复
                    //var username=$("#emailTest").val();
                    //var indexof=totalPer.indexOf(username);
                    //alert(indexof);
                    //if(indexof<0){
                        //$(".modal-body").empty();
                        //$(".modal-body").append("<div style='float:left;height:30px;background:#e5e5e5;margin-bottom:10px;width:100%;'><div style='float:left;height:30px;line-height:30px;'><input style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>"+username+"</input></div><div style='float:right;height:30px;line-height:30px;'><a class='deleteTest' href='javaScript:void(0);'>[删除]</a></div></div>");
                    var username = $("#emailTest").val();
                    var repname=$("#repnameInput").val();
                    $.ajax({
                        url: ngUrl + "/permission/" + repname+"?username="+username,
                        type: "GET",
                        cache: false,
                        async: false,
                        dataType: 'json',
                        headers: {Authorization: "Token " + $.cookie("token")},
                        success: function (json) {
                            //判断加的是不是自己
                            if($.cookie("tname")==username){
                                $("#mess").addClass("errorMess").css({"visibility": "visible","background-color":"#ffd1d1","color":"#ff0000"}).text("不能添加您自己").fadeIn();
                                $(".errorMess").fadeOut(3000);
                            }else{


                            //判断是否重复
                            if((json.data.total==0)&&($.cookie("tname")!=username))
                            {
                                $.ajax({
                                    url: ngUrl + "/permission/"+repname,//加入白名单
                                    type: "PUT",
                                    cache: false,
                                    //  data:{username:emailTest},
                                    data: JSON.stringify({"username": username}),
                                    async: false,
                                    dataType: 'json',
                                    headers: {Authorization: "Token " + $.cookie("token")},
                                    success: function (json) {
                                        if (json.code == 0) {
                                            $("#modalRep_list").prepend("<div style='float:left;height:30px;background:#e5e5e5;margin-bottom:10px;width:100%;'><div style='float:left;height:30px;line-height:30px;'><input style='margin-left:10px;margin-right:6px;' type='checkbox' name='funcusers'>" + username + "</input></div><div style='float:right;height:30px;line-height:30px;'><a class='deleteTest' href='javaScript:void(0);'>[删除]</a></div></div>");
                                            $("#emailTest").val("");
                                            $("#mess").addClass("successMess").css({"visibility":"visible","background-color":"#e8f7e6","color":"#1bd506"}).text("添加白名单成功").fadeIn();
                                            $(".successMess").fadeOut(3000);

                                        }
                                    },
                                    error: function (json) {
                                        errorDialog($.parseJSON(json.responseText).code);
                                        $('#errorDM').modal('show');
                                    }
                                });

                            }
                            else{
                                $("#mess").addClass("errorMess").css({"visibility": "visible","background-color":"#ffd1d1","color":"#ff0000"}).text("白名单已有此用户").fadeIn();
                                $(".errorMess").fadeOut(3000);

                            }
                            }
                        },
                        error:function(){
                            errorDialog($.parseJSON(json.responseText).code);
                            $('#errorDM').modal('show');
                        }

                    });
            } else {

                    $("#mess").addClass("errorMess").css({"visibility": "visible","background-color":"#ffd1d1","color":"#ff0000"}).text("名称未注册").fadeIn();
                    $(".errorMess").fadeOut(3000);
            }
        }
            }
            else{
                $("#mess").addClass("errorMess").css({"visibility": "visible","background-color":"#ffd1d1","color":"#ff0000"}).text("名称不能为空").fadeIn();
                $(".errorMess").fadeOut(3000);



        }
        });
    //返回键
    $(document).on('click', '#back_icon', function () {
        uuuuuuu();
    });

//删除单个记录
    $(document).on('click', '.deleteTest', function () {
        var username = $(this).parent().siblings().text();
        var repname=$("#repnameInput").val();
        $(this).parent().parent().remove();
        $.ajax({
            url: ngUrl + "/permission/"+repname+"?username=" + username,
            type: "DELETE",
            cache: false,
            //data:JSON.stringify({"username":username}),
            async: false,
            dataType: 'json',
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function (json) {
                if (json.code == 0) {
                    $("#mess").addClass("successMess").css({"visibility":"visible","background-color":"#e8f7e6","color":"#1bd506"}).text("删除成功").fadeIn();
                    $(".successMess").fadeOut(3000);
                    uuuuuuu();
                    $("#modalRep_list").opener.location.reload();
                    //$("#modalRep_list").reset();
                }
                else
                {
                    $("#mess").addClass("errorMess").css({"visibility": "visible","background-color":"#ffd1d1","color":"#ff0000"}).text("删除失败").fadeIn();
                    $(".errorMess").fadeOut(3000);

                }
            },
            error: function (json) {
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    });
$(document).ready(function(){
    //清空全部
    $("#delAll").click(function () {
        var repname=$("#repnameInput").val();
        $.ajax({
         url: ngUrl + "/permission/"+repname+"?delall=1",
         type: "DELETE",
         cache: false,
         async: false,
         dataType: 'json',
         headers: {Authorization: "Token " + $.cookie("token")},
         success: function (json) {
             if (json.code == 0) {
                 $("#mess").addClass("successMess").css({"visibility":"visible","background-color":"#e8f7e6","color":"#1bd506"}).text("清空成功").fadeIn();
                 $(".successMess").fadeOut(3000);
                 $("#modalRep_list div").remove();
                 uuuuuuu();

             }
         },
         error: function (json) {
         errorDialog($.parseJSON(json.responseText).code);
         $('#errorDM').modal('show');
         }
         });
    });
    //删除部分
    $("#delCurrent").click(function () {
        $('input:checkbox[name=users]:checked').each(function (i) {
            var users = $(this).parent().text();
            var repname=$("#repnameInput").val();
            $(this).parent().parent().remove();
            $.ajax({
                url: ngUrl + "/permission/"+repname+"?username="+users,
                type: "DELETE",
                cache: false,
                async: false,
                dataType: 'json',
                headers: {Authorization: "Token " + $.cookie("token")},
                success: function (json) {
                    if (json.code == 0) {
                        $("#mess").addClass("successMess").css({"visibility":"visible","background-color":"#e8f7e6","color":"#1bd506"}).text("删除成功").fadeIn();
                        $(".successMess").fadeOut(3000);
                        uuuuuuu();
                    }
                },
                error: function (json) {
                    errorDialog($.parseJSON(json.responseText).code);
                    $('#errorDM').modal('show');
                }
            });
        });
    });
    //查询
    $("#seList").click(function () {
       // var username = $(this).parent().siblings().text();
        var username=$("#emailTest").val();
        var repname=$("#repnameInput").val();
        $.ajax({
            url: ngUrl + "/permission/" + repname+"?username="+username,
            type: "GET",
            cache: false,
            async: false,
            dataType: 'json',
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function (json) {
                var total = json.data.total;
                if (total != 0) {
                    $("#modalRep_list").empty();
                    $("#modalRep_list").append("<div style='float:left;height:30px;background:#e5e5e5;margin-bottom:10px;width:100%;'><div style='float:left;height:30px;line-height:30px;'><input style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>"+username+"</input></div><div style='float:right;height:30px;line-height:30px;'><a class='deleteTest' href='javaScript:void(0);'>[删除]</a></div></div>");
                    $("#modalRep_list").append("<div id='back_icon'><p ><a href='javascript:void(0);' style='color:#0077aa;'>[返回]</a></p></div>");
                    $(".pagesPer").empty();
                }

            },
            error:function(){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    });


});



});


