/**
 * Created by Administrator on 2015/12/29.
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
    //µÇÂ½ºó
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var repname = getParam("repname");
    var itemname = getParam("itemname");
    var datas = getParam("datas");
    $.ajax({
        url:  ngUrl+"/repositories/"+repname+"/"+itemname,
        type: "get",
        cache:false,
        data:{},
        headers:headerToken,
        dataType:'json',
        success:function(json){
            if(json.code == 0){
                var thisdata = json.data[datas];
                $('.conment').html(marked(thisdata));
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
})