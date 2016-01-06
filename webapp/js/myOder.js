/**
 * Created by Administrator on 2016/1/6.
 */
$(function(){
    $('.mypushcomment li').eq(0).show();
    $('.top_nav div').click(function(){
        $(this).addClass('cur').siblings().removeClass('cur');
        $('.mypushcomment li').eq($(this).index()).show().siblings().hide();
    });
    $.ajax({
        url: ngUrl+"/subscriptions/push?groupbydate=1",
        type: "get",
        cache:false,
        //async:false,
        dataType:'json',
        headers:{ Authorization:"Token "+$.cookie("token") },
        success:function(json){
            if(json.code == 0){
                addOrderhtml(json);
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
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
        for(var i =0 ;i<jsonoder.data.length;i++) {
            var html =
                '<div class="mucon">' +
                '<div class="mutime">' + jsonoder.data[i].date + '</div>';
            for (var j = 0; j < jsonoder.data[i].subscriptions.length; j++) {
                var username = '';
                var thisrepname = jsonoder.data[i].subscriptions[j].repname;
                var thisitemname = jsonoder.data[i].subscriptions[j].itemname;
                var subscriptionid = jsonoder.data[i].subscriptions[j].subscriptionid;
                var thisplanid = jsonoder.data[i].subscriptions[j].plan.id;
                getAjax(ngUrl+'/users/'+jsonoder.data[i].subscriptions[j].buyername,function(userjson){
                    username = userjson.data.userName;
                })
                var ischethisbtn = '';
                if(jsonoder.data[i].subscriptions[j].phase == 7){
                    ischethisbtn = '<div class="chethisbtn" datare="'+thisrepname +'" datait="'+thisitemname+'" dataspid="'+subscriptionid+'" dataplanid="'+thisplanid+'" ><span class="nobtn">忽略</span> <span class="yesbtn">同意</span></div>';
                }
                var thisphase = oderstate(jsonoder.data[i].subscriptions[j].phase);
                var oderdate = jsonoder.data[i].subscriptions[j].signtime.substr(11,8);
                var expiretime = jsonoder.data[i].subscriptions[j].expiretime.replace(/[A-Z]/g, " ");
                html += '<table class="table tabcon">' +
                    '<tr>' +
                    '<td style="width: 10%">'+subscriptionid +'</td>' +
                    '<td style="width: 10%">' + oderdate + '</td>' +
                    '<td style="width: 22%;">' + thisrepname + '/' + thisitemname + '</td>' +
                    '<td style="width: 18%;">' + username + '</td>' +
                    '<td style="width: 20%;"><div>' + jsonoder.data[i].subscriptions[j].plan.money + '￥/' + jsonoder.data[i].subscriptions[j].plan.units + '</div><div>有效期：' + jsonoder.data[i].subscriptions[j].plan.expire + '</div><div>失效日期：' + expiretime + '</div></td>' +
                    '<td style="width: 12%;"><div class="thisoder">' + thisphase + ischethisbtn+'</div></td>' +
                    '<td style="width: 8%;">投诉中</td>' +
                    '</tr>' +
                    '</table>';
            }
            html += '</div>';
            $('.dingcon').append(html);
        }
    }

})
