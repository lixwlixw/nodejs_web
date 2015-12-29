/**
 * Created by Administrator on 2015/12/28.
 */
$(function(){
    var tagNum="";
    var i="";
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    //item标题
    var titleName=(repoName+"/"+itemName);
    $("#titleName").text(titleName);
    //判断是否注册
    if($.cookie("token")!=null&&$.cookie("token")!="null") {
        request();
        var nextpages = 0;
        var i=0;
        gonextpage(nextpages,i);
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
    tagNum="";
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
function gonextpage(nextpages,i){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    var nextpages = nextpages + 1;
    $.ajax({
        url: ngUrl+"/repositories/"+repoName+"/"+itemName+"?page="+nextpages,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                var price_times=json.data.price[0].times;
                $("#LT-right select option").text(price_times+"次/天");
                //tag信息
                //tagNum=json.data.taglist.length;
                    i++;
                    var tag_tag=json.data.tags.tag;
                    var tag_comment=json.data.tags.comment;
                    var tag_time=json.data.tags.optime;
                    //alert(tag+tag_comment+tag_time);
                    $("#content"+i+"").css("display","block");
                    $("#content"+i+" .content1_title p:nth-child(1)").text(tag_tag);
                    $("#content"+i+" .content1_title p:nth-child(2)").text(tag_comment);
                    $("#content"+i+" .content1_time span:nth-child(2)").text(tag_time);
            }
        },
        error:function(){
        }
    });
}
//点赞功能
function star(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        url: ngUrl+"/star/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json) {
            alert(json.data.starred);
        }
    });
}
