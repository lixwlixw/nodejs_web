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
    $('.itemnameitem').html("/"+itemname);
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
    function tagbox(pages){
        $('.con-main').empty();
        	getAjax(ngUrl+'/repositories/'+repname+"/"+itemname+'?size=6&page='+pages,function(msg){
            tagallnum = msg.data.tags;
            taglist = msg.data.taglist;
            var supply_style = msg.data.label.sys.supply_style;
            var classjson = judgeLabel(supply_style)
            $("#supply_style").attr('class',classjson.vvclass);
            $("#supply_style").html(classjson.labelV);
            if(msg.data.meta != null){
                meta = msg.data.meta;
            } else{
                meta = '';
            }
            if(msg.data.sample != null){
                sample = msg.data.sample;
            } else{
                sample = '';
            }
            paegetags = msg.data.tags;
           var jsonTime = getTimes(msg.data.optime);
           var itemaccesstype = msg.data.itemaccesstype;
           	if(itemaccesstype == 'public'){
           		$('.itemaccesstype').html('公开');
           	}else if(itemaccesstype == 'private'){
           		$('.itemaccesstype').html('私有');
           	}
           $('.itemoptime').html(jsonTime.showTime);
           $('.itemoptime').attr('title',jsonTime.jdTime);
           $('.itemcon').html(msg.data.comment)

        });
        var str = ' <div class="tagbox"> '+
            '<div class="head">'+
            '<span class="icon"></span>'+
            '<span class="date">'+paegetags+'Tag</span>'+
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
            items_per_page: 6,
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
            '<div class="metadatatop">样例 <div class="metadata-icon"></div></div>'+
            '<div class="metadata-con">'+meta+'</div>'+
            '<div class="metadatatop">元数据 <div class="metadata-icon"></div></div>'+
            '<div class="metadata-con">'+sample+'</div>'+
            '</div>';
        $('.con-main').append(str);
    }


})