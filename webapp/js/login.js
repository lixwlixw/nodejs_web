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
				$("#exampleInputEmail1").blur(function(){
					var reg =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
			　　	if (!reg.test($("#exampleInputEmail1").val())) {
					alert("100");
					$("#messageModa2").css("display","block");
					$("#messageModal").css("display","none");
					$("#messageModa3").css("display","none");
					$("#messageModa2").fadeOut(4000);
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
    				$("#messageModa3").css("display","block");
					$("#messageModa2").css("display","none");
					$("#messageModal").css("display","none");
					$("#messageModa3").fadeOut(5000);
    			}
    			if(XMLHttpRequest.status==401||XMLHttpRequest.status==504||XMLHttpRequest.status==403){
    				$("#messageModa2").css("display","none");
					$("#messageModa3").css("display","none");
					$("#messageModal").css("display","block");
					$("#messageModal").fadeOut(4000);
					
					
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


