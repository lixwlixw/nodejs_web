/**
 * Created by Administrator on 2015/11/25.
 */
$(function(){
    //得到用户登录token;
    var account= $.cookie('token');
    function getcurrpullnum(){
        $.ajax({
            type: "get",
            url:ngUrl+"/transactions/pull?groupbydate=1",
            cache:false,
            async:false,
            headers:{Authorization: "Token "+account},
            success: function(msg){
                $('#pull-body').empty();
                var str = '<div class="pullbox">';
                for(var i= 0 ;i<msg.data.length;i++){
                    str+='<div class="record"><div class="head ">'+
                        '<span class="icon togglebox"></span>'+
                        '<span class="date">'+msg.data[i].date+'</span>'+
                        '</div>'+
                        '<div class="body">'+
                        '<table>';
                    for(var j=0;j<msg.data[i].pulls.length;j++){
                        var times = msg.data[i].pulls[j].pulltime
                        times = times.substr(11,8);
                        str+=
                            '<tr>'+
                            '<td class="first">'+times+'</td>'+
                            '<td>'+msg.data[i].pulls[j].tag+'</td>'+
                            '<td>'+msg.data[i].pulls[j].repname+'</td>'+
                            '<td>'+msg.data[i].pulls[j].itemname+'</td>'+
                            '<td class="last">'+msg.data[i].pulls[j].tag+'</td>'+
                            '</tr>';
                    }
                    str+= '</table></div></div>';
                }
                str+= '</div>';
                $('#pull-body').append(str);
            }
        });
    }
    getcurrpullnum();
    var head = $("#pull-body .record .head");
            head.click(function () {
                 var body = $(this).closest(".record").children("div[class=body]:first");
                body.slideToggle("fast");
     });
})