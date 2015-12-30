/**
 * Created by Administrator on 2015/12/30.
 */
$(function(){


    var account= $.cookie('token');
    var tname= $.cookie('tname');
    if(account != 'null'){
        $.ajax({
            type: "get",
            url:ngUrl+"/daemon/id",
            cache:false,
//            async:false,
            headers:{Authorization:"Token "+account},
            success: function(msg){
                $('.havetoken').html(msg.data.daemonid);
            }
        });
    }
    var indexs = 0;
    var thisheight = 0;
    var  datalistnum = 0;
    function getrecord(){
        if(account != 'null'){
            $.ajax({
                type: "get",
                url:ngUrl+"/daemon/log/"+indexs+"?range=50",
                cache:false,
//            async:false,
                headers:{Authorization:"Token "+account},
                success: function(msg){
                    datalistnum = msg.data.log;
                    if(msg.data.log){
                        for(var i = 0;i<msg.data.log.length;i++){
                            var str = '<p class="recordconList">'+msg.data.log[i]+'</p>';
                            $('#conList').prepend(str);
                        }
                        if(indexs == 0){
                            thisheight = $('#conList').height();
                            $(".recordcon").animate({scrollTop:thisheight},30);
                        }
                        indexs += 50;
                    }


                }
            });
        }
    }

    getrecord();
    if(account == null || account == 'null'){
        $('.havetoken').html('xxxxxxxxxx');
    }

    if(account != 'null'){
        $.ajax({
            type: "get",
            url:ngUrl+"/daemon/status",
            cache:false,
//            async:false,
            headers:{Authorization:"Token "+account},
            success: function(msg){
                if(msg.data.status == 'offline'){
//                        $('.havePoint').html("N/A");
                    $('.statecolor').html('Client端失去连接');
                    $('.stateicon').addClass('stateiconrgred').removeClass('stateiconrgre');
                    $('.statecolor').addClass('statecolorgred').removeClass('statecolorgre');
                }
                if(msg.data.status == 'online') {
//                        $('.havePoint').html(msg.data.entrypoint);
                    $('.statecolor').html('Client端正常连接');
                    $('.stateicon').addClass('stateiconrgre').removeClass('stateiconrgred');
                    $('.statecolor').addClass('statecolorgre').removeClass('statecolorgred');

                }
                if(msg.data.entrypoint){
                    $('.havePoint').html(msg.data.entrypoint[0]);
                }else{
                    $('.havePoint').html("N/A");
                }
            }
        });
    }


    var nScrollTop = 0;   //滚动到的当前位置
    $(".recordcon").scroll(function() {
        nScrollTop = $(this)[0].scrollTop;
        if (nScrollTop == 0){
            if(datalistnum != null || datalistnum == 'undefined'){
                getrecord();
            }

        }

    });

})