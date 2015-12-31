/**
 * Created by Administrator on 2015/12/28.
 */
$(function(){
    var tagNum="";
    var create_user="";
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    //item标题
    var titleName=(repoName+"/"+itemName);
    $("#titleName").text(titleName);
    //判断是否注册
    if($.cookie("token")!=null&&$.cookie("token")!="null") {
        gonextpage(0);//请求tag数据
        request();//请求tag数据

        star();//点赞

        itemName_pull();//itemName_pull量
        numsubs();//itemName_订购量
        about_item();//关于item

        company();//repo提工者
    }
    else
    {
        alert("100");
    }
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
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    var nextpages = nextpages + 1;
    $("#left_content").empty();
    //tag信息
    $.ajax({
        url: ngUrl+"/repositories/"+repoName+"/"+itemName+"?page="+nextpages,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                tagNum=json.data.tags;
                $("#nav1 > sup > span").text(tagNum);
                var list_length=json.data.taglist.length;
                var taglist=json.data.taglist;
                for(var i=0;i<list_length;i++)
                {
                    var tag_tag=taglist[i].tag;
                    var tag_comment=taglist[i].comment;
                    var tag_time=taglist[i].optime;

                    var $left_content = $("#left_content");
                    var $content=$("<div></div>").addClass("content").appendTo($left_content);
                    var $content1_title=$("<div></div>").addClass("content1_title").appendTo($content);
                    $content1_title.append($("<p></p>").text(tag_tag));
                    $content1_title.append($("<p></p>").text(tag_comment));

                    var $content1_time=$("<div></div>").addClass("content1_time").appendTo($content);
                    $content1_time.append("<span></span>");
                    $content1_time.append($("<span>2分钟以前</span>").text(tag_time));

                    var $content1_pullNumber=$("<div></div>").addClass("content1_pullNumber").appendTo($content);
                    $content1_pullNumber.append("<span></span>");
                    $content1_pullNumber.append("<span>Pull:0</span>");

                    var $content1_copy=$("<div></div>").addClass("content1_copy").appendTo($content);
                    $content1_copy.append($("<div></div>").append("<input type='text'>").append("<button>复制</button>"));

                    var content1_download=$("<div></div>").addClass("content1_download").appendTo($content);
                    content1_download.append("<span></span>");
                    content1_download.append("<p>890266</p>");

                    //获取tag的pull量
                    $.ajax({
                        url: ngUrl+"/transaction_stat/"+repoName+"/"+itemName+"/"+tag_tag,
                        type: "GET",
                        cache:false,
                        async:false,
                        dataType:'json',
                        headers:{Authorization:"Token "+$.cookie("token")},
                        success:function(json){
                            if(json.code == 0){
                                $(".content1_pullNumber span:nth-child(2)").text("pull:"+json.data.nummypulls);
                                $(".content .content1_download>p").text(json.data.numpulls);
                            }
                        },
                        error:function(){
                            errorDialog($.parseJSON(json.responseText).code);
                            $('#errorDM').modal('show');
                        }
                    });
                }

            }
        },
        error:function(){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
}
//点赞功能
function star(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    var numstars="";
    //对star数据进行更新
    $.ajax({
        url: ngUrl+"/star_stat/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json) {
            numstars=json.data.numstars;
            $("#icon_heart_number").text(numstars);

        },
        error:function(){

        }
    });
    $("#icon_heart").click(function(){
        $.ajax({
            //获取star状态
            url: ngUrl+"/star/"+repoName+"/"+itemName,
            type: "GET",
            cache:false,
            async:false,
            dataType:'json',
            headers:{Authorization:"Token "+$.cookie("token")},
            success:function(json){
                if(json.data.starred){
                    $("#icon_heart").css({"background-image":"url('/images/icon_heart.png')",
                        "background-repeat":"no-repeat",
                        "background-position":"0px 1px",
                        "display":"inline-block",
                        "width":"25px",
                        "height":"25px"});
                    //返回去star==0状态
                    $.ajax({
                        url: ngUrl+"/star/"+repoName+"/"+itemName+"?star=0",
                        type: "PUT",
                        cache:false,
                        async:false,
                        dataType:'json',
                        headers:{Authorization:"Token "+$.cookie("token")},
                        success:function(json) {
                            if(json.code==0){
                                //对star数据进行更新
                                $.ajax({
                                    url: ngUrl+"/star_stat/"+repoName+"/"+itemName,
                                    type: "GET",
                                    cache:false,
                                    async:false,
                                    dataType:'json',
                                    headers:{Authorization:"Token "+$.cookie("token")},
                                    success:function(json) {
                                        numstars=json.data.numstars;
                                        $("#icon_heart_number").text(numstars);
                                    },
                                    error:function(){

                                    }
                                });
                            }

                        },
                        error:function(){

                        }
                    });
                }
                else{
                    $("#icon_heart").css({"background-image":"url('/images/icon_heart2.png')",
                        "background-repeat":"no-repeat",
                        "background-position":"0px 1px",
                        "display":"inline-block",
                        "width":"25px",
                        "height":"25px"});
                    //返回去star==1状态
                    $.ajax({
                        url: ngUrl+"/star/"+repoName+"/"+itemName+"?star=1",
                        type: "PUT",
                        cache:false,
                        async:false,
                        dataType:'json',
                        headers:{Authorization:"Token "+$.cookie("token")},
                        success:function(json) {
                            if(json.code==0){
                                //对star数据进行更新
                                $.ajax({
                                    url: ngUrl+"/star_stat/"+repoName+"/"+itemName,
                                    type: "GET",
                                    cache:false,
                                    async:false,
                                    dataType:'json',
                                    headers:{Authorization:"Token "+$.cookie("token")},
                                    success:function(json) {
                                        numstars=json.data.numstars;
                                        $("#icon_heart_number").text(numstars);
                                    },
                                    error:function(){

                                    }
                                });
                            }

                        },
                        error:function(){

                        }
                    });
                }
            }
        });
    })
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
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                //$(".content1_pullNumber span:nth-child(2)").text("pull:"+json.data.nummypulls);
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
        headers:{Authorization:"Token "+$.cookie("token")},
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
        headers:{Authorization:"Token "+$.cookie("token")},
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
function company(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        url: ngUrl+"/repositories/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json) {
            //company
            var create_user=json.data.create_user;
            $.ajax({
                url: ngUrl+"/users/"+create_user,
                type: "GET",
                cache:false,
                async:false,
                dataType:'json',
                headers:{Authorization:"Token "+$.cookie("token")},
                success:function(json) {
                    //company
                    var company_username=json.data.username;
                    alert(company_username);

                },
                error:function(){

                }
            });
        },
        error:function(){

        }
    });

}

//这是复制功能
/*
<script src='js/clipboard.min.js'></script>
    <input id="foo" type="text" value="http://vvvvvvvvv.baidu.com">
    <button data-clipboard-action="copy" data-clipboard-target="#foo" id="test">test</button>*/
