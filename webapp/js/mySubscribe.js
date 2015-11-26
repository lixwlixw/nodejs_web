/**
 * Created by Administrator on 2015/11/25.
 */
$(function(){
	//得到用户登录token;
    var account= $.cookie('token');
    //区分时间
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
      //填充订阅列表
     
     function getSubsnum(){
     	var isgo = true;
     	$.ajax({
            type: "get",
            url:ngUrl+"/subscriptions",
            cache:false,
            async:false,
            headers:{Authorization: "Token "+account},
            success: function(msg){
               	var fornum = msg.data.length;
               	$('.allsubnum').html(fornum)
               	for(var i = 0;i < fornum;i++){
               		var repname = msg.data[i].repname;
               		var itemname = msg.data[i].itemname;
               		var subtime = msg.data[i].subtime;
               			subtime = subtime.replace(/[A-Z]/g, " ");
               		var itemcomment
               		 $.ajax({
           					type: "get",
       			    		async: false,
       			    		url: ngUrl+"/repositories/"+repname+"/"+itemname,
       			    		success: function(msg){	  
       			    				itemcomment = msg.data.comment;
       			    		},
       			    		error:function(XMLHttpRequest, textStatus, errorThrown) {
       			    				isgo = false;
       			    				// alert(JSON.stringify(XMLHttpRequest))
       			    				var code = JSON.parse(XMLHttpRequest.responseText).code;
       			    				if(isgo == false && code != 0){
       			    					alert(JSON.parse(XMLHttpRequest.responseText).msg)
       			    					return 
       			    				}
       			    		}
       					});
               		  	if(isgo == false){return}
               				var rbg;
               				var colors;
               				var pullnum = '';
               				getAjax(ngUrl+"/transaction_stat/"+repname+"/"+itemname,function(datas){
               						pullnum = datas.data.numpulls;	
               				});
               				
               				if(pullnum == 0){
               						rbg = 'righticon rbg1';
               						colors = 'col-md-4 subtitler color1';
               				}else if(pullnum != 0){ 
               						rbg = 'righticon rbg2';
               						colors = 'col-md-4 subtitler color2';
               				}
               	 			var str = '<div class="sublist_con">'+
                  				'<div class="row subtitle">'+
                  				'<div class="col-md-4 subtitlel"><a href="myItemDetails.html?repname='+repname+'&itemname='+itemname+'">'+repname+'/'+itemname+'</a></div>'+
                  				'<div class="col-md-4 subtitlec"><span class="centericon" title="订阅时间"></span>'+subtime+'</div>'+
                  				'<div class="'+colors+'"><span title="pull量" class="'+rbg+'"></span>pull:'+pullnum+'</div>'+
                  				'</div>'+
                  				'<div class="subcomment">'+itemcomment+'</div>'+
                  				'</div>';
                  			$('.sublist').append(str);
               	}
               
            }
        });
     	
     }
     getSubsnum();
})