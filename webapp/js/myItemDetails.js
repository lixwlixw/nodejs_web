/**
 * Created by Administrator on 2015/11/24.
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
    var repname = getParam("repname");
    var itemname = getParam("itemname");
    $('.renameitem').html(repname);
    $('.renameitem').attr("href","myPublish.html?repname="+repname);
    $('.itemnameitem').html("&nbsp;/&nbsp;"+itemname);
	$(document).on('click','.togglebox',function(){
		 var body = $(this).closest(".record").children("div[class=body]:first");
				body.slideToggle("fast");

	});
	//得到用户登录token;
	 var account= $.cookie('token');
    // 左侧导航切换；
    $('.leftnav li').click(function(){
        var str = '<span class="curbg"></span>'
        var curr = $('.leftnav li.cur').index();
        var indexs = $(this).index();
        $(this).addClass('cur').siblings('li').removeClass('cur');
        $('.leftnav li').eq(curr).children('span').remove();
        $(this).append(str);
        if(indexs == 0){
        	$('.pages').show();
            tagbox(1);
        }else if(indexs == 1){
        	$('.pages').hide();
            getcurrpullnum();
        }else if(indexs == 2){
        	$('.pages').hide();
           metadatabox();
        }
    });
    tagbox(1);
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
    function getTimes(times){
        var jsonTime = {};
        jsonTime.nums=times.indexOf("|");
        if(jsonTime.nums!="-1"){
            jsonTime.jdTime=times.substr(0,19);
            jsonTime.xdTime=times.substring(jsonTime.nums+1,times.length);
            jsonTime.showTime=jsonTime.xdTime;
        }else{
            jsonTime.showTime=times;
        }
        return jsonTime;
    };
    ///////////////判断数据类型//////////////////
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
     //返回该DataItem的订阅量
      getAjax(ngUrl + "/subscription_stat/"+itemname,function(msg){
          $('.myitempull').html(msg.data.numsubs);
      });
      //返回该DataItem的pull量
      getAjax(ngUrl + "/transaction_stat/"+repname+"/"+itemname,function(msg){
          $('.myitemdy').html(msg.data.numpulls);
      });
      // 返回item的star量
      getAjax(ngUrl + "/star_stat/"+repname+"/"+itemname,function(msg){
          $('.myitemstar').html(msg.data.numstars);
      });
    // 得到tag的下载量
   
    function gettagpullnum(tagname){
        var tagpullnum ;
        if(account != 'null'){
            $.ajax({
                type: "get",
                url:ngUrl+"/transaction_stat/"+repname+"/"+itemname+"/"+tagname,
                cache:false,
                async:false,
                headers:{Authorization: "Token "+account},
                success: function(msg){
                    tagpullnum = msg.data.nummypulls;

                }
            });
        }else{
        	alert('请先登录');
        }
        return tagpullnum;
    }
    // 得到用户的pull记录
     function getcurrpullnum(){
     		$.ajax({
                type: "get",
                url:ngUrl+"/transactions/push?groupbydate=1",
                cache:false,
                async:false,
                headers:{Authorization: "Token "+account},
                success: function(msg){
                   $('.con-main').empty();
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
		            	 				  '<td class="first">'+msg.data[i].pulls[j].buyername+'</td>'+
		            	 				  '<td>'+times+'</td>'+
		            	 				  '<td class="last">'+msg.data[i].pulls[j].tag+'</td>'+
		            	 				  '</tr>';   
		         				}   
		         			str+= '</table></div></div>';		
        				}
		            
		           
          			 str+= '</div>';
       				 $('.con-main').append(str);
                }
            });
     }
    //tag信息
    var tagallnum;
    var taglist = [];
    var meta ;
    var sample;
    var paegetags;

    var itemshowtime;
    var itemaccesstype;
    var supply_style;
    function tagbox(pages){
        $(".filletspan .personaltag").remove();
        var ispagetags = 0;
        $('.con-main').empty();
        	//getAjax(ngUrl+'/repositories/'+repname+"/"+itemname+'?size=20&page='+pages,function(msg){
        $.ajax({
            type: "get",
            async: false,
            headers:{Authorization: "Token "+account},
            url:ngUrl+'/repositories/'+repname+"/"+itemname+'?size=20&page='+pages,
            success: function(msg) {
                tagallnum = msg.data.tags;
                taglist = msg.data.taglist;
                supply_style = msg.data.label.sys.supply_style;
                var classjson = judgeLabel(supply_style)
                $("#supply_style").attr('class', classjson.vvclass);
                $("#supply_style").html(classjson.labelV);
                if (msg.data.Meta != null) {
                    meta = msg.data.Meta;
                } else {
                    meta = '';
                }
                if(msg.data.label != null && msg.data.label != ''){
                    var ptags = msg.data.label.owner;
                    var labelstr = '';
                    for(var j in ptags) {
                        labelstr+='<span class="personaltag">'+ptags[j]+'</span>';
                    }
                }
                $(".filletspan").append(labelstr);
                if (msg.data.Sample != null) {
                    sample = msg.data.Sample;
                } else {
                    sample = '';
                }
                paegetags = msg.data.tags;

                if (paegetags == 0) {
                    ispagetags = "该Item下还没有发布任何Tags";
                } else {
                    ispagetags = paegetags + "Tag";
                }
                var jsonTime = getTimes(msg.data.optime);
                 itemaccesstype = msg.data.itemaccesstype;
                if (itemaccesstype == 'public') {
                    $('.itemaccesstype').html('公开');
                } else if (itemaccesstype == 'private') {
                    $('.itemaccesstype').html('私有');
                }
                $('.itemoptime').html(jsonTime.showTime);
                $('.itemoptime').attr('title', jsonTime.jdTime);
                $('.itemcon').html(msg.data.comment)
            }

        });


        var str = ' <div class="tagbox"> '+
            '<div class="head">'+
            '<span class="icon"></span>'+
            '<span class="date">'+ispagetags+'</span>'+
            '</div>'+
            '<div class="body">'+
            '<table>';
        for(var i = 0;i<taglist.length;i++){
            var tagpullnum = gettagpullnum(taglist[i].tag);
            var times = getTimes(taglist[i].optime);
            str+=
                '<tr>'+
                '<td class="first">'+taglist[i].tag+'</td>'+
                '<td>'+taglist[i].comment+'</td>'+
                '<td>'+times.showTime+'</td>'+
                '<td class="last"><span class="downloaded-icon" title="pull量"></span>'+tagpullnum+'</td>'+
                '</tr>';      
        }
        str+='</table>'+
             '</div>'+
             '</div>';
             
        $('.con-main').append(str);
    }
    //tag信息分页
    $(".pages").pagination(paegetags, {
            maxentries:paegetags,
            items_per_page: 20,
            num_display_entries: 1,
            num_edge_entries: 5 ,
            prev_text:"上一页",
            next_text:"下一页",
            ellipse_text:"...",
//          num_edge_entries:1,
            link_to:"javascript:void(0)",
            callback:fenS,
            load_first_page:false
        });
        $('.pagination a').attr('href','javascript:void(0)');
        function fenS(new_page_index){
        		tagbox(new_page_index+1)
        }

    //操作记录/////////////////////
    function operationbox(){
        $('.con-main').empty();
        var str = '<div class="operationbox">'+
            '<div class="head">'+
            '<span class="icon"></span>'+
            '<span class="date">2015-11-01</span>'+
            '</div>'+
            '<div class="body">'+
            '<table>'+
            '<tr>'+
            '<td class="first">13:21:34</td>'+
            '<td>Tag名称名称</td>'+
            '<td class="last">Repository名称名称</td>'+
            '</tr><tr>'+
            '<td class="first">13:21:34</td>'+
            '<td>Tag名称名称</td>'+
            '<td class="last"><span class="upload-icon" title="上传"></span>Repository名称名称</td>'+
            '</tr><tr>'+
            '<td class="first">13:21:34</td>'+
            '<td>Tag名称名称</td>'+
            '<td class="last"><span class="upload-icon" title="上传"></span>Repository名称名称</td>'+
            '</tr><tr>'+
            '<td class="first">13:21:34</td>'+
            '<td>Tag名称名称</td>'+
            '<td class="last"><span class="upload-icon" title="上传"></span>Repository名称名称</td>'+
            '</tr><tr>'+
            '<td class="first">13:21:34</td>'+
            '<td>Tag名称名称</td>'+
            '<td class="last"><span class="upload-icon" title="上传"></span>Repository名称名称</td>'+
            '</tr>'+
            '</table>'+
            '</div>'+
            '</div>';
        $('.con-main').append(str);
    }
    //////////////////////元数据、样例数据/////////////////////
    function metadatabox(){
        $('.con-main').empty();
         var str =  '<div class="metadatabox">'+
            '<div class="metadatatop">样例 <div class="metadata-icon"><a href="myMark.html?repname='+repname+'&itemname='+itemname+'&type=sample" ></a></div></div>'+
            '<div class="metadata-con markdown-body">'+marked(sample)+'</div>'+
            '<div class="metadatatop">元数据 <div class="metadata-icon"><a href="myMark.html?repname='+repname+'&itemname='+itemname+'&type=meta" ></a></div></div>'+
            '<div class="metadata-con markdown-body">'+marked(meta)+'</div>'+
            '</div>';
        $('.con-main').append(str);
    }

        $("#editItem .itemtag .key .addbtn .btnicon").click(function() {
                createItemTag();
        });
    $("#editItem .itemtagmoney .keymoney .divmoney .btniconmoney").click(function() {
        createItemTagmoney();
    });
        $(".itemListName-icon").click(function() {
            if(itemaccesstype == 'private'){
                $('.xiugaiwrop').show();
            }else{
                $('.xiugaiwrop').hide();
            }
            $('.valuemoney').empty();
            $('.itemtag .value').empty();
            $.ajax({
                type: "get",
                url:ngUrl+"/permission/"+repname+"/"+itemname,
                cache:false,
                headers:{Authorization: "Token "+account},
                success: function(msg){
                    var fornum = msg.data.total;
                    $('.xiugaiwrop .baimingdannum').html('('+ fornum +')');
                }
            });
                $.ajax({
                        url: ngUrl+"/repositories/"+repname+"/"+itemname,
                        type: "GET",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        headers:{ Authorization:"Token "+$.cookie("token") },
                        success:function(json){
                                if(json.code == 0){
                                     var itemaccesstype = '开放';
                                     if(json.data.itemaccesstype == 'private'){
                                         itemaccesstype = '私有'
                                     }else{
                                         itemaccesstype = '开放'
                                     }
                                        var itemNameInput = $("#editItem .itemname .value input");
                                        var itemCommentTextArea = $("#editItem .itemcomment .value textarea");
                                        var itemProSelect = $("#editItem .itempro .value span");
                                        var itemtagDiv = $("#editItem .itemtag .value");
                                        itemNameInput.val(repname).attr("disabled", "disabled");
                                        itemCommentTextArea.val(json.data.comment);
                                        itemProSelect.html(itemaccesstype);
                                        if(json.data.label != undefined && json.data.label != null && json.data.label != "null" &&
                                                json.data.label.owner != undefined && json.data.label.owner != null && json.data.label.owner != "null") {
                                                var lables = json.data.label.owner;
                                                $("#editItem .itemtag .value").html("");
                                                for(var i in lables) {
                                                    createItemTag(i, lables[i], false,'disabled');
                                                }
                                        }
                                    var jsonobj = json.data.price;
                                    for(var i = 0;i<jsonobj.length;i++){
                                        var islimit = false;
                                        var limitvalue = ''
                                       if (jsonobj[i].limit){
                                           islimit = true;
                                           limitvalue = jsonobj[i].limit;
                                       }
                                        var itemdatatype = supply_style;
                                        createItemTagmoney(jsonobj[i].units, jsonobj[i].money, jsonobj[i].expire,jsonobj[i].plan_id,false,islimit,itemdatatype,limitvalue);
                                    }                                
                                }
                        },
                        error:function(json){
                                alert(json.msg);
                        }
                });
                $('#editItem').modal('toggle');
        });
////////修改白名单/////////////////////////////////////////////
var totals = 0;
function getpagesF(){
    getpermissions(1);
    $(".baipages").pagination(totals, {
        items_per_page: 6,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:Fens,
        load_first_page:false
    });
}
function getpermissions(pages){
    $('.namelist').empty();
    $.ajax({
        type: "get",
        url:ngUrl+"/permission/"+repname+"/"+itemname+'?size=6&page='+pages,
        cache:false,
        async:false,
        headers:{Authorization: "Token "+account},
        success: function(msg){
            var fornum = msg.data.permissions.length;
            totals =  msg.data.total;
            for(var i = 0;i<fornum;i++)
            {
                var lis = '<li class="lis">'+ '<input class="ischeck" type="checkbox"/><span class="namelistcon"></span><span class="thisusername">'+msg.data.permissions[i].username+'</span><span class="namelistdel">[删除]</span>'+
                '</li>';
              $('.namelist').append(lis);
            }


        }
    });

}
function Fens(new_page_index){
    getpermissions(new_page_index+1);
}
 $('.xiugainame').click(function(){
     $('.namelist').empty();
     getpagesF();
     $('#editItem').modal('toggle');
     $('#editBox').modal('toggle');

 })



////////查询单个白名单/////////////////////////////////////////////

        
        
////////新增白名单/////////////////////////////////////////////
$('.addnamebtn').click(function(event) {
    /* Act on the event */
    var username = $.trim($('#addvalue').val());
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(username == ''){
        $('#mess').html('用户不能为空').addClass('errorMess').removeClass('successMess').show().fadeOut(800)
         return false;
    }else if(!filter.test(username)){
          $('#mess').html('邮箱格式不正确').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
        return false;
    }else if(checkloginusers(username) == 1){
        $('#mess').html('该用户还未注册').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
        return false;
    }else if(checkname(username) == 2){
         $('#mess').html('已添加该用户').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
    }else if($.cookie("tname") == username){
        $('#mess').html('不能添加自己').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
        return false;
    }else{
         
          $.ajax({
                type:"put",
                url:ngUrl+"/permission/"+repname+"/"+itemname,
                cache:false,
                dataType:'json',
                async:false,
                headers:{Authorization: "Token "+account},
                data:JSON.stringify({"username":username}),  
                success: function(adduser){
                    $('#mess').html('成功添加白名单').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
                    getpagesF();
                }
            });
    }
});             
/////////////////////////////////////////////////////////////////清空白名单
$('.emptylist').click(function(){
     $.ajax({
               type:"DELETE",
               url:ngUrl+"/permission/"+repname+"/"+itemname+"?delall=1",
               cache:false,
               dataType:'json',
               headers:{Authorization: "Token "+account},
               success: function(deluser){
                     if(deluser.code == 0){
                        $('.namelist').empty();
                         $(".baipages").pagination(0, {
                             items_per_page: 6,
                             num_display_entries: 1,
                             num_edge_entries: 5 ,
                             prev_text:"上一页",
                             next_text:"下一页",
                             ellipse_text:"...",
                             link_to:"javascript:void(0)",
                             callback:Fens,
                             load_first_page:false
                         });
                     }
               }
    });

})
////////////////////////////////////////////////////////////////单个删除白名单
$(document).on('click','.namelistdel',function(){
var thisusername = $(this).siblings('.thisusername').html();
var _this = $(this);
     $.ajax({
               type:"DELETE",
               url:ngUrl+"/permission/"+repname+"/"+itemname+"?username="+thisusername,
               cache:false,
               headers:{Authorization: "Token "+account},
               success: function(deluser){
                    if(deluser.code == 0){
                       _this.parent().remove();
                        getpagesF();
                    }
               }
    });

})


////////////////////////////////////////////////////////////////批量删除白名单
$('.dellist').click(function(){
var thisusername = [];
var namejson = {}
var lilist = $('.namelist li');
    for(var i = 0;i<lilist.length;i++){
        if($('.namelist li').eq(i).children('.ischeck').is(':checked')==true){

              var thisval = $(lilist[i]).children('.thisusername').html();
               namejson[$('.namelist li').eq(i).index()] = thisval;
              thisusername.push(thisval);
        }
    }
    for(var j in namejson){
         $.ajax({
                   type:"DELETE",
                   url:ngUrl+"/permission/"+repname+"/"+itemname+"?username="+namejson[j],
                   cache:false,
                   dataType:'json',
                   headers:{Authorization: "Token "+account},
                   success: function(deluser){
                         if(deluser.code == 0){
                             getpagesF();
                         }
                   }
        })
    };

})
//////////////////搜索白名单
    $('.selectbtn').click(function(){
        var curusername = $.trim($('#addvalue').val());
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+repname +'/'+itemname+'?username='+curusername,
            cache: false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                   if(datas.code == 0){
                       var lis = '<li class="lis">'+
                           '<input class="ischeck" type="checkbox"/><span class="namelistcon"></span><span class="thisusername">'+datas.data.permissions[0].username+'</span><span class="namelistdel">[删除]</span>'+
                           '</li>';
                       $('.namelist').empty().append(lis);
                       $('.gobackbtnwrop').show();
                       $(".baipages").pagination(0, {
                           items_per_page:6,
                           num_display_entries: 1,
                           num_edge_entries: 5 ,
                           prev_text:"上一页",
                           next_text:"下一页",
                           ellipse_text:"...",
                           link_to:"javascript:void(0)",
                           callback:Fens,
                           load_first_page:false
                       });
                   }
            }
        });

    })
//////////////////////////返回按钮
$('.gobackbtnwrop').click(function(){
     $('.namelist').empty();
     getpagesF();
     $(this).hide();
})

///////////////提交修改
    $("#editItem .submit input").click(function() {
        var reg = new RegExp("^[0-9]*$");
        var newmoney = new RegExp("^([1-9][0-9]*)+(.[0-9]{1,2})?$");

        var itemtagDiv = $("#editItem .itemtag .value");
        var labels = itemtagDiv.children(".persontag");
        var itemtagDivmoney = $("#editItem .itemtagmoney .valuemoney");
        var moneydivs = itemtagDivmoney.children(".persontag");
        var dataitem = {};
        var dataarr = [];
        for(var i=0; i<moneydivs.length; i++) {
            dataarr[i] = {};
            var moneydiv = $(moneydivs[i]);
            var dataid = moneydiv.attr('dataid')
            var tagtime = moneydiv.children(".tagtime:first").val();
            var tagmoney = moneydiv.children(".tagmoney:first").val();
            var tagexpire = moneydiv.children(".tagexpire:first").val();
            var limitnum = moneydiv.children(".ishiddenbox").children(".limitnum:first").val();
            if(!reg.test(tagtime) || tagtime ==0 || tagtime == ""){
                $('#itemmess').html('次数（天数）需为大于0的整数').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                 //alert("");
                 return;
             }
            if(tagmoney == "" || tagmoney <= 0 || !reg.test(tagmoney)){
                $('#itemmess').html('价格需大于0').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                //alert('价格需大于0');
                return;
            }
            if(newmoney.test(tagmoney) == false){
                $('#itemmess').html('价格精确到小数点后2位').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                //alert('价格精确到小数点后2位');
                return;
            }
            if(tagmoney.indexOf('.') == -1){
                tagmoney = tagmoney+'.00';
            }

            if(tagexpire == ""){
                $('#itemmess').html('有效期不能为空').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                //alert('有效期不能为空');
                return;
            }
            if(!reg.test(tagexpire) || tagexpire == 0){
                $('#itemmess').html('有效期需为大于0的整数').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                //alert("有效期需为大于0的整数");
                return;
            }
            if(limitnum){
                if(!reg.test(limitnum)){
                    $('#itemmess').html('限购次数必须为数字').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                    //alert("限购次数必须为数字");
                    return;
                }
                if(limitnum <= 0){
                    $('#itemmess').html('限购次数必须大于0').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                    //alert("限购次数必须大于0");
                    return;
                }
                dataarr[i].limit = parseInt(limitnum);
            }
            dataarr[i].units = parseInt(tagtime);
            dataarr[i].money = parseFloat(tagmoney);
            dataarr[i].expire = parseInt(tagexpire);
            dataarr[i].plan_id = dataid;

        }
        dataitem.price = dataarr ;
        dataitem.comment = $.trim($("#editItem .itemcomment .value textarea").val());
        if(dataitem.comment.length > 200) {
            alert('"DataItem 描述"太长！');
            return;
        }
        $('.itemcon').html(dataitem.comment)
        //修改item
        var datalabel = {};
        $.ajax({
            url: ngUrl+"/repositories/"+repname+"/"+itemname,
            type: "PUT",
            cache:false,
            async:false,
            dataType:'json',
            data:JSON.stringify(dataitem),
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                var labelstr = '';
                if(json.code == 0){
                    //修改label
                    var priceobj = {};

                    for(var i=0; i<labels.length; i++) {
                        var label = $(labels[i]);
                        var labelkey = $.trim(label.children(".tagkey:first").val());
                        var labelvalue = $.trim(label.children(".tagvalue:first").val());
                        if(labelkey == "" || labelvalue == "") {
                            alert("标签名和标签值不能为空！");
                            return;
                        }
                        datalabel["owner."+labelkey] = labelvalue;
                        labelstr+='<span class="personaltag">'+labelkey+'</span>';
                    }
                    $(".filletspan .personaltag").remove();
                    $(".filletspan").append(labelstr);
                    $.ajax({
                        url: ngUrl+"/repositories/"+repname+"/"+itemname+"/label",
                        type: "PUT",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        data:datalabel,
                        headers:{ Authorization:"Token "+$.cookie("token") },
                        success:function(json){
                            if(json.code == 0){
                                $('#editItem').modal('toggle');
                            }
                        },
                        error:function(json){
                            alert(json.msg);
                        }
                    });
                }
            },
            error:function(json){
                alert(json.msg);
            }
        });

    });
    function createItemTag(tagkey, tagvalue,newlabel,isdisabled) {
        tagkey = tagkey == undefined ? "": tagkey;
        tagvalue = tagvalue == undefined ? "": tagvalue;
        var itemtag = $("#editItem .itemtag .value");
        var strinput = '';
        if(isdisabled){
            strinput = '<input type="text" class="tagkey" disabled="disabled" value="'+tagkey+'"/>';
        }else{
            strinput = '<input type="text" class="tagkey" value="'+tagkey+'"/>';
        }
        if(itemtag.children("div").length < 5) {
            var persontag = $("<div></div>").addClass("persontag").attr("newlabel",newlabel?true:false).appendTo(itemtag);
            persontag.append(strinput);
            persontag.append($("<div>=</div>").addClass("tagequal"));
            persontag.append($("<input/>").addClass("tagvalue").attr("type", "text").val(tagvalue));
            persontag.append($("<div class='delitemlabelicon'></div>").click(function() {
                if(persontag.attr("newlabel") != "true") {
                   var other = $(this);
                    var owname = $(this).siblings('.tagkey').val();
                    var thistagvalue = $(this).siblings('.tagvalue').val();
                    $.ajax({
                        type:"DELETE",
                        url: ngUrl+"/repositories/"+repname+"/"+itemname+"/label?owner."+owname+"="+thistagvalue,
                        cache: false,
                        async: false,
                        headers:{ Authorization:"Token "+$.cookie("token") },
                        success: function (datas) {
                            other.parent().remove();
                        }
                    });

                }else {

                    $(this).parent().remove();
                }
            }));
        }
    }

    function checkname(curusername){
        var iscurname = 1;
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+repname +'/'+itemname+'?username='+curusername,
            cache: false,
            async:false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                if(datas.code == 0 && datas.data.permissions.length>0){ 
                    if(datas.data.permissions[0].username == curusername){
                        iscurname = 2;
                    }
                }
            }
        });
        return iscurname;
    }

    function checkloginusers(loginusers){
        var isloginusers = 1;
        $.ajax({
            url: ngUrl + "/users/"+loginusers ,
            type: "get",
            cache: false,
            async: false,
            headers: {Authorization: "Token " + $.cookie("token")},
            datatype: 'json',
            success:function(json){
                if(json.code == 0){
                    isloginusers = 2;
                }
            }
        });
        return isloginusers;
    }

})



function createItemTagmoney(tagtime, tagmoney,tagexpire,dataid,newlabel,ischecked,itemdatatype,limitvalue) {
    var isday = '';
    if(itemdatatype == 'flow'){
        isday = '天';
    }else{
        isday = '次';
    }
    if(limitvalue == '' || limitvalue == null || null== 'limitvalue'){
        limitvalue = '';
    }
    var itemtagmoney = $("#editItem .itemtagmoney .valuemoney");
    var thisstr = '<div class="ishiddenbox"><div class="tagequal">限购&nbsp;每个用户限购多少次</div><input class="limitnum" type="text" value="'+limitvalue+'"/></div>';
    if(itemtagmoney.children("div").length < 6) {
        var ishidestr = '<div class="tagequal gohide">限购&nbsp;</div>'
        var persontag = $("<div></div>").addClass("persontag").attr("newlabel",newlabel?true:false).attr('dataid',dataid).appendTo(itemtagmoney);
        persontag.append($("<input/>").addClass("tagtime").attr("type", "text").val(tagtime));
        persontag.append($("<div> "+isday +"=</div>").addClass("tagequal"));
        persontag.append($("<input/>").addClass("tagmoney").attr("type", "text").val(tagmoney));
        persontag.append($("<div>元&nbsp;&nbsp;有效期</div>").addClass("tagequal"));
        persontag.append($("<input/>").addClass("tagexpire").attr("type", "text").val(tagexpire));
        persontag.append($("<div>天</div>").addClass("tagequal"));
        persontag.append($("<input type='checkbox'/>").attr("checked",ischecked).addClass("isnimitid").click(function() {
            if($(this).attr('checked') == 'checked') {
                $(this).removeAttr("checked");
                persontag.children('.ishiddenbox').remove();
                $(this).after(ishidestr)
            }else {
               $(this).attr("checked",'checked');
                persontag.children('.gohide').remove();
                $(this).after(thisstr)
            }
        }));
        persontag.append(ishidestr);
        if(persontag.children('.isnimitid').attr('checked') == "checked") {
            persontag.children('.gohide').remove();
            persontag.children('.isnimitid').after(thisstr)
        }else {
            persontag.children('.ishiddenbox').remove();
        }
        persontag.append($("<div class='delitemmoneyicon'></div>").click(function() {
            if(persontag.attr("newlabel") != "true") {
                $(this).parent().remove();
            }else {
                $(this).parent().remove();
            }
        }));
    }
}
