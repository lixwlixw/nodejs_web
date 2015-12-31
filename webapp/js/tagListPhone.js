/**
 * Created by Administrator on 2015/12/28.
 */
$(function() {
    function getParam(key) {
        var value='';
        var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
        if (itemid.test(decodeURIComponent(window.location.href))) {
            value = itemid.exec(decodeURIComponent(window.location.href))[1];
        }
        return value;
    }
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
    var repname = getParam("repname");
    var itemname = getParam("itemname");
    function addgatlist(tagname,tagcomment,tagpullnum) {
        var html =
            '<li class="taglistcon borderb">' +
            '<div class="infobox">'+
            '<div class="listTop">' +
            '<div class="tagName">'+tagname+'</div>' +
            '<div class="tagpullnum"><span class="downloaded-icon"></span><span class="pullnum">'+tagpullnum+'</span></div>' +
            '</div>' +
            '<div class="tagcomment">'+tagcomment+'</div>' +
            '</div>'+
            '</li>';

        $('.listbox').append(html);
    }




        $.ajax({
            type: "get",
            async: false,
            url: ngUrl+"/repositories/"+repname+"/"+itemname,
            success: function(msg){
                var tagsnum = msg.data.tags;
                $('.tagnum').html(tagsnum);
                var taglist  = msg.data.taglist;
                for(var i = 0; i < taglist.length;i++){
                    var tagname = msg.data.taglist[i].tag;
                    var tagcomment = msg.data.taglist[i].comment;
                    var tagpullnum = 0;
                    getAjax(ngUrl+"/transaction_stat/"+repname+"/"+itemname+"/"+tagname,function(json){
                       tagpullnum = json.data.numpulls;
                    })

                    addgatlist(tagname,tagcomment,tagpullnum)
                }
            }
        });

})