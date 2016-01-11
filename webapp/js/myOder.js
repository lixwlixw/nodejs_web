/**
 * Created by Administrator on 2016/1/6.
 */
$(function(){
    $('.mypushcomment li').eq(0).show();
    $('.top_nav div').click(function(){
        $(this).addClass('cur').siblings().removeClass('cur');
        $('.mypushcomment li').eq($(this).index()).show().siblings().hide();
    });
    var odertotal = '';
    function getoderList(oderpages){
        $.ajax({
            url: ngUrl+"/subscriptions/push?groupbydate=1&page="+oderpages+"&size=30",
            type: "get",
            cache:false,
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                if(json.code == 0){
                    odertotal = json.data.total;
                    addOrderhtml(json);
                }
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    }
    getoderList(1)
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
    function oderstate(phase){
        var thisstate = '';
        switch (phase){
            case 1:
                thisstate ="订单生效";
                break;
            case 2:
                thisstate ="冻结";
                break;
            case 3:
                thisstate ="订单完成";
                break;
            case 5:
                thisstate ="item被删除订单失效";
                break;
            case 6:
                thisstate ="管理员删除";
                break;
            case 7:
                thisstate ="等待您审核";
                break;
            case 8:
                thisstate ="撤回申请";
                break;
            case 9:
                thisstate ="申请订购被拒绝";
                break;
            case 10:
                thisstate ="申诉中";
                break;
        }
        return thisstate;
    }
    $(document).on('click','.nobtn',function(){
        var thisrepname = $(this).parents('.chethisbtn').attr('datare');
        var thisitemname =  $(this).parents('.chethisbtn').attr('datait');
        var subscriptionid = parseInt($(this).parents('.chethisbtn').attr('dataspid'));
        var thisplanid =  $(this).parents('.chethisbtn').attr('dataplanid');
        var _this = $(this);
        var dataison = {
            "action": "deny",
            "subscriptionid": subscriptionid,
            "planid": thisplanid
        }
        $.ajax({
            url: ngUrl+"/subscription/"+thisrepname+"/"+thisitemname+"/apply",
            type: "put",
            cache:false,
            //async:false,
            dataType:'json',
            data:JSON.stringify(dataison),
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                _this.parents('.thisoder').html('申请订购被拒绝');
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    })
    $(".oderpages").pagination(odertotal, {
        maxentries:odertotal,
        items_per_page: 5,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:oderfenS,
        load_first_page:false
    });
    function oderfenS(new_page_index){
        getoderList(new_page_index+1);
    }
    $(document).on('click','.yesbtn',function(){
        var thisrepname = $(this).parents('.chethisbtn').attr('datare');
        var thisitemname =  $(this).parents('.chethisbtn').attr('datait');
        var subscriptionid = parseInt($(this).parents('.chethisbtn').attr('dataspid'));
        var thisplanid = $(this).parents('.chethisbtn').attr('dataplanid');
        var _this = $(this);
        var dataison = {
            "action": "agree",
            "subscriptionid": subscriptionid,
            "planid": thisplanid
        }
        $.ajax({
            url: ngUrl+"/subscription/"+thisrepname+"/"+thisitemname+"/apply",
            type: "put",
            cache:false,
            //async:false,
            dataType:'json',
            data:JSON.stringify(dataison),
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                _this.parents('.thisoder').html('订单生效');
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    })
    function addOrderhtml(jsonoder){
        $('.dingcon').empty();
        for(var i =0 ;i<jsonoder.data.results.length;i++) {
            var html =
                '<div class="mucon">' +
                '<div class="mutime">' + jsonoder.data.results[i].date + '</div>';
            for (var j = 0; j < jsonoder.data.results[i].subscriptions.length; j++) {
                var username = '';
                var thisrepname = jsonoder.data.results[i].subscriptions[j].repname;
                var thisitemname = jsonoder.data.results[i].subscriptions[j].itemname;
                var subscriptionid = jsonoder.data.results[i].subscriptions[j].subscriptionid;
                var thisplanid = jsonoder.data.results[i].subscriptions[j].plan.id;
                getAjax(ngUrl+'/users/'+jsonoder.data.results[i].subscriptions[j].buyername,function(userjson){
                    username = userjson.data.userName;
                })
                var ischethisbtn = '';
                if(jsonoder.data.results[i].subscriptions[j].phase == 7){
                    ischethisbtn = '<div class="chethisbtn" datare="'+thisrepname +'" datait="'+thisitemname+'" dataspid="'+subscriptionid+'" dataplanid="'+thisplanid+'" ><span class="nobtn">忽略</span> <span class="yesbtn">同意</span></div>';
                }
                var thisphase = oderstate(jsonoder.data.results[i].subscriptions[j].phase);
                var oderdate = jsonoder.data.results[i].subscriptions[j].signtime.substr(11,8);
                var expiretime = jsonoder.data.results[i].subscriptions[j].expiretime.replace(/[A-Z]/g, " ");
                html += '<table class="table tabcon">' +
                    '<tr>' +
                    '<td style="width: 10%">'+subscriptionid +'</td>' +
                    '<td style="width: 10%">' + oderdate + '</td>' +
                    '<td style="width: 22%;" style="word-wrap:break-word">' + thisrepname + '/' + thisitemname + '</td>' +
                    '<td style="width: 18%;">' + username + '</td>' +
                    '<td style="width: 20%;"><div>' + jsonoder.data.results[i].subscriptions[j].plan.money + '￥/' + jsonoder.data.results[i].subscriptions[j].plan.units + '</div><div>有效期：' + jsonoder.data.results[i].subscriptions[j].plan.expire + '</div><div>失效日期：' + expiretime + '</div></td>' +
                    '<td style="width: 12%;"><div class="thisoder">' + thisphase + ischethisbtn+'</div></td>' +
                    '<td style="width: 8%;"></td>' +
                    '</tr>' +
                    '</table>';
            }
            html += '</div>';
            $('.dingcon').append(html);
        }
    }

})
