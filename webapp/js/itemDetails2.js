/**
 * Created by Administrator on 2015/12/28.
 */
$(function(){
    var tagNum="";
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    //item标题
    var titleName=(repoName+"/"+itemName);
    $("#titleName").text(titleName);
    //判断是否注册
    if($.cookie("token")!=null&&$.cookie("token")!="null") {
        gonextpage(0);
        request();

        star();
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

                }

            }
        },
        error:function(){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
    //获取pull量
    $.ajax({
        url: ngUrl+"/transaction_stat/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                $(".content1_pullNumber span:nth-child(2)").text("pull:"+json.data.numpulls);
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

