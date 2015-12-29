/**
 * Created by Administrator on 2015/12/28.
 */
$(function(){
    function getParam(key) {
        var value='';
        var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
        if (itemid.test(decodeURIComponent(window.location.href))) {
            value = itemid.exec(decodeURIComponent(window.location.href))[1];
        }
        return value;
    }
    var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var repname = getParam("repname");
    var itemname = getParam("itemname");
    var vvclass="";
    var label = '';
    function getAjax(url,fun){
        $.ajax({
            type: "get",
            async: false,
            headers:headerToken,
            url: url,
            success: function(msg){
                fun(msg);
            }
        });
    }

    function tophtml(currepnem,curitemnem,pricestate,datastyle,itemcomment,orilabel,vvclass,perlabel,showtime,tagnum,starvalue,subnum,pullnum,cur_user,createuser){
        var topstr = '<div class="reptitle borderb">'+
            '<div class="cur_link"></div>'+
            '<div class="repNamebg"></div>'+
            '<div class="repname">'+
            '<a href="repDetailsPhone.html?repname='+repname+'">'+
            '<span class="currepname">'+ currepnem+'</span> / <br/>'+
            '<span class="curitemname">'+ curitemnem +'</span><br/>'+
            '<span class="pricestate '+datastyle+'">'+ pricestate +'</span>'+
            '<div class="cur_link"></div>'+
            '</a>'+
            '</div>'+
            '</div>'+
            '<div class="repcomment borderb">'+
            '<div class="curitemcon">'+itemcomment+'</div>'+
            '<div class="curlabels">'+
            '<span class="'+vvclass+'">'+ orilabel +'</span>'+perlabel+
            '</div>'+
            '</div>'+
            '<div class="repnums borderb">'+
            '<div class="lefticon">'+
            '<span class="time-icon"></span>'+
            '<span class="showtime">'+showtime+'</span>'+
            '<span class="tag-icon"></span>'+
            '<span class="tagnum">'+tagnum+'</span>'+
            '</div>'+
            '<div class="righticon">'+
            '<span title="star量" class="star-icon"></span>'+
            '<span class="star-value">'+starvalue+'</span>'+
            '<span title="订阅量" class="subscript-icon"></span>'+
            '<span class="subscript-value">'+subnum+'</span>'+
            '<span title="pull量" class="downloaded-icon"></span>'+
            '<span class="downloaded-value">'+pullnum+'</span>'+
            '</div>'+
            '</div>'+
            '<div class="isrep borderb">'+
            '所属Repository<span class="iscuritemname">'+currepnem+'</span>'+
            '</div>'+
            '<div class="repcreate_user">'+
            '<a href="#">'+
            '<div class="cur_user"><a href="dataOfDetails.html?username='+createuser+'" >本数据由 <span id="cur_user">'+cur_user+'</span> 提供</a></div>'+
            '<div class="cur_link"><a href="dataOfDetails.html?username='+createuser+'"></a></div>'+
            '</a>'+
            '</div>';
        $('#topbox').append(topstr)
    }
    $('#goTagListPhone').attr('href','tagListPhone.html?repname='+repname+'&itemname='+itemname)
    $('#metahref').attr('href','metaAndsample.html?repname='+repname+'&itemname='+itemname+'&datas=Meta')
    $('#samplehref').attr('href','metaAndsample.html?repname='+repname+'&itemname='+itemname+'&datas=Sample')
    /////////////////////////查看item详情;
    $.ajax({
        url: ngUrl+"/repositories/"+repname+"/"+itemname,
        type: "get",
        cache:false,
        data:{},
        async:false,
        headers:headerToken,
        dataType:'json',
        success:function(datas){
            if(datas.code == 0){
                var itemcomment = datas.data.comment;
                var itemdatatype = datas.data.pricestate;
                var time=datas.data.optime;
                var createuser = datas.data.create_user;
                var cur_user = '';
                var tags = datas.data.tags;
                $('.curtagnum').html(tags)
                getAjax(ngUrl+"/users/"+createuser,function(json){
                    cur_user = json.data.nickName;
                })
                var showtime = time.substring(time.indexOf("|")+1,time.length);
                var datastyle = '';
                if(itemdatatype == '免费'){
                    datastyle = 'freedata';
                }else if(itemdatatype == '付费'){
                    datastyle = 'paydata';
                }else if(itemdatatype == '限量免费'){
                    datastyle = 'limitdata';
                }
                vvclass="";
                label=datas.data.label.sys.supply_style;
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
                if(datas.data.label != null && datas.data.label != ''){
                    var ptags = datas.data.label.owner;
                    var labelstr = '';
                    for(var j in ptags) {
                        labelstr+='<span class="personaltag">'+ptags[j]+'</span>';
                    }
                }
                var curstarnum = 0;
                getAjax(ngUrl+"/star_stat/"+repname+"/"+itemname,function(json){
                    curstarnum = json.data.numstars;
                })
                var cursubnum = 0;
                getAjax(ngUrl+"/subscription_stat/"+repname+"/"+itemname,function(json){
                    cursubnum = json.data.numsubs;
                })
                var curpullnum = 0;
                getAjax(ngUrl+"/transaction_stat/"+repname+"/"+itemname,function(json){
                    curpullnum = json.data.numpulls;
                })
                tophtml(repname,itemname,itemdatatype,datastyle,itemcomment,labelV,vvclass,labelstr,showtime,tags,curstarnum,cursubnum,curpullnum,cur_user,createuser)

            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
})