/**
 * Created by Administrator on 2015/12/9.
 */

$(document).ready(function(){
    ajaxRe();
    var nextpages=1;
    /////////返回用户下的所有rep//////////
    var allrepnum = 0;
    var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var loginname = getParam("username");
    $.ajax({
        url: ngUrl+"/vip/"+loginname,
        type: "get",
        cache:false,
        data:{},
        headers:headerToken,
        dataType:'json',
        success:function(json){
            if(json.code == 0){
                var vipgrade = json.data.userType;
                if(vipgrade == 3){
                    $('#thisvip').attr('class','vipgrade vipgrade3');
                    $('#thisvip').show();
                }else if(vipgrade == 4){
                    $('#thisvip').attr('class','vipgrade vipgrade4');
                    $('#thisvip').show();
                }else if(vipgrade == 5){
                    $('#thisvip').attr('class','vipgrade vipgrade5');
                    $('#thisvip').show();
                }else{
                    $('#thisvip').hide();
                }
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
    $.ajax({
        url: ngUrl+"/repositories?username="+getParam("username")+'&size=-1',
        type: "get",
        cache:false,
        async:false,
        headers:headerToken,
        dataType:'json',
        success:function(json){
            if(json.data.length!=0){
               allrepnum =json.data.length;
            }else{
                console.log("报错");
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });

    function getpagecon(nextpages){
        var headerToken={};
        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }
        var repos=[];
        $.ajax({
            url: ngUrl+"/repositories?username="+getParam("username")+"&size=10&page="+nextpages,
            type: "get",
            cache:false,
            async:false,
            headers:headerToken,
            dataType:'json',
            success:function(json){
                repos=[];
                if(json.data.length!=0){
                    var pages=json.data.length;
                    for(var i=0;i<pages;i++){
                        repos.push([json.data[i].repname]);
                    }
                }else{
                    console.log("报错");
                }
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
        addhtml(repos);
    }
    getpagecon(1);
    $(".pages").pagination(allrepnum, {
        maxentries:allrepnum,
        items_per_page: 10,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:nextpageadd,
        load_first_page:false
    });
    function nextpageadd(nextpages){
        getpagecon(nextpages+1)
    }
    function addhtml(repos){
        var headerToken={};
        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }
        $("#terminal-content-body").empty();
        for(var i=0;i<repos.length;i++){
            $.ajax({
                url: ngUrl+"/repositories/"+repos[i],
                type: "get",
                cache:false,
                async:false,
                headers:headerToken,
                dataType:'json',
                success:function(json){
                    $("#loading").empty();
                    var times=json.data.optime;
                    var jdTime=times.substring(0, times.indexOf("."));
                    var xdTime="";
                    var showTime="";
                    var nums=times.indexOf("|");
                    if(nums!="-1"){
                        showTime=times.substring(times.indexOf("|")+1,times.length);
                    }else{
                        showTime=times.substring(0, times.indexOf("."));
                    }
                    var subnum="";
                    $.ajax({
                        url: ngUrl+"/subscription_stat/"+repos[i],
                        type: "get",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){
                                subnum=json.data.numsubs;
                            }else {
                                console.log("报错");
                            }
                        },
                        error:function(json){
                            errorDialog($.parseJSON(json.responseText).code);
                            $('#errorDM').modal('show');
                        }
                    });

                    var transnum="";
                    $.ajax({
                        url: ngUrl+"/transaction_stat/"+repos[i],
                        type: "get",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){
                                transnum=json.data.numpulls;
                            }else {
                                console.log("报错");
                            }
                        },
                        error:function(json){
                            errorDialog($.parseJSON(json.responseText).code);
                            $('#errorDM').modal('show');
                        }
                    });

                    var starsnum="";
                    $.ajax({
                        url: ngUrl+"/star_stat/"+repos[i],
                        type: "get",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){
                                starsnum=json.data.numstars;
                            }else {
                                console.log("报错");
                            }
                        },
                        error:function(json){
                            errorDialog($.parseJSON(json.responseText).code);
                            $('#errorDM').modal('show');
                        }
                    });


                    $("#terminal-content-body").append(""+
                        "<div class='selectBody' style='background:#fff;float:left;margin-bottom:30px;'>"+
                        "<div class='repo-head'>"+
                        "<div class='tab-head-div'><a style='color:#0077aa' href='repDetails.html?repname="+repos[i]+"'>"+repos[i]+"</a></div>"+
                            //	"<div class='tab-head-icon'></div>"+
                        "</div>"+
                        "<div class='repo-body'>"+
                        "<div id='repo-text'>"+json.data.comment+"</div>"+
                        "<div class='repo-body-tail'>"+
                        "<div class='repo-body-tail-left'>"+
                        "<div class='updatetime-icon' title='更新时间'></div>"+
                        "<div class='updatetime-value' title='"+jdTime+"'>"+showTime+"</div>"+
                        "<div class='tag-iconItem' title='item数量'></div>"+
                        "<div class='tag-value'>"+json.data.items+"</div>"+
                        "</div>"+
                        "<div class='repo-body-tail-mid'>&nbsp;&nbsp;&nbsp;"+
                        "</div>"+
                        "<div class='repo-body-tail-right'>"+
                        "<div class='shwr'>"+
                        "<div class='star-icon' title='star量'></div>"+
                        "<div class='star-value'>"+starsnum+"</div>"+
                        "<div class='subscript-icon' title='订阅量'></div>"+
                        "<div class='subscript-value'>"+subnum+"</div>"+
                        "<div class='downloaded-icon' title='pull量'></div>"+
                        "<div class='downloaded-value'>"+transnum+"</div>"+
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
        }

    }


});

//////、、、、、、、、、、、、、、获取数据拥有方详情
function ajaxRe(){
    var username = getParam("username");
    $.ajax({
        url: ngUrl+"/users/"+username,
        type: "get",
        cache:false,
        data:{},
        async:false,
        dataType:'json',
        success:function(json){
            if(json.code == 0){
                $("#thisusername").text(json.data.userName);
                $("#userCom").text(json.data.comment);
            }else {
                console.log("报错");
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
}
function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
}