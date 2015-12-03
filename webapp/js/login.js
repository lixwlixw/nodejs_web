/**
 * Created by Administrator on 2015/11/13.
 */
$(function(){
//	$(document).ready(function(){
//		$(document).keydown(function(event){
//			if(event.keyCode==13){
//			$("#signs").click();
//			}
//		}); 
//	
//	})
//
	$(document).on('click','#sign-in',function(){	
				 $(document).keydown(function(event){
					if(event.keyCode==13){
					$("#signs").click();
					}
				});	 
	});
	


	$(document).on('click','#signs',function(){
        var exampleInputEmail1 = $('#exampleInputEmail1').val();
        var exampleInputPassword1 = $('#exampleInputPassword1').val();
        var mdpass =  $.md5(exampleInputPassword1);
        var b = new Base64();
        var basePass = b.encode(exampleInputEmail1+":"+mdpass);
  //    console.log("---"+b.decode(basePass))
        $.ajax({
			url: ngUrl,
    		type: "get",
    		cache:false,
    	   	async:false,
    	  	headers:{Authorization:"Basic "+basePass},
    	  	beforeSend:function(){
  		  		$('#signs').attr('disabled','disabled');
  		  	},
  		  	complete:function(){
  		  		$('#signs').removeAttr('disabled');
  		  	},
    		success:function(json){ 
    			$.cookie("tname",exampleInputEmail1,{path:"/"});
    			$.cookie("token",json.token,{path:"/"});
    			location.href=window.location.href;
    		},
    		error:function (XMLHttpRequest, textStatus, errorThrown){
    			if(XMLHttpRequest.status==500){
    				$("#messageModal").text("服务器内部错误").show();
    			}
    			if(XMLHttpRequest.status==401||XMLHttpRequest.status==504||XMLHttpRequest.status==403){
    				$("#messageModal").text("认证失败，请重试").show();
    			}
    		}
    	});        
        
    });	
    
	$(document).on('click','#logout',function(){
		$.cookie("tname",null,{path:"/"});
		$.cookie("token",null,{path:"/"}); 
		location.href=window.location.href;
 	});

});


