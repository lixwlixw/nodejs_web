/**
 * Created by Administrator on 2015/11/25.
 */
$(function(){
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
    function judgeLabel (labels){
        var labeldata = {
            'label' : labels,
            'vvclass' : '',
            'labelV' : ''
        };
        if (labeldata.label == "single") {
            labeldata.vvclass = "api";
            labeldata.labelV = "API";
        }
        if (labeldata.label == "batch") {
            labeldata.vvclass = "period";
            labeldata.labelV = "批量数据";
        }
        if (labeldata.label == "flow") {
            labeldata.vvclass = "flot-data";
            labeldata.labelV = "流式数据";
        }
        return labeldata
    };
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
                        var pulltimes = msg.data[i].date;
                         str+='<div class="record"><div class="head ">'+
                                    '<span class="icon togglebox"></span>'+
                                    '<span class="date">'+pulltimes+'</span>'+
                                    '</div>'+
                                    '<div class="body">'+
                                    '<table>';
                        for(var j = 0;j<msg.data[i].pulls.length;j++){
                                var repname = msg.data[i].pulls[j].repname;
                                var itemname = msg.data[i].pulls[j].itemname;
                                var tagname = msg.data[i].pulls[j].tag;
                                var sypply_style = msg.data[i].pulls[j].sypply_style;
                                var Labels;
                                var times = msg.data[i].pulls[j].pulltime
                                    times = times.substr(11,8);
                                    Labels = judgeLabel(sypply_style);
                               
                             str += 
                                    
                                    '<tr>'+
                                    '<td class="first">'+times+'</td>'+
                                    '<td>'+tagname+'</td>'+
                                    '<td>'+Labels.labelV+'</td>'+
                                    '<td>'+itemname+'</td>'+
                                    '<td class="last">'+repname+'</td>'+
                                    '</tr>'
                                    ;

                        }
                    
                }
                str+= '</table></div></div></div>';
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