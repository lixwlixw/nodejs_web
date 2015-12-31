/**
 * Created by Administrator on 2015/12/9.
 */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var type=0;
var size=0;

//type类型，size分页数
function init(type,size){
	//总数
	var totalnum=ajaxTotal(type,size);
	window.type=type;
	window.size=size;
	pagechange(0);
}

function pagechange(new_page_index){
	var page=new_page_index+1;
	var type=window.type;
	var size=window.size;
	ajaxFunHtml(type,size,page);
}


//获取列表集合 1.rep 2.item 3.tag 4.user

function ajaxFunHtml(type,size,page){
	
	var list=[];
	var url="";
	var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $("#terminal-content-body").empty();
    
	if(type=="1"){
		
	}
	if(type=="2"){
		
	}
	if(type=="3"){
		
	}
	if(type=="4"){	
		url=ngUrl+"/repositories?username="+getParam("username")+"&size="+size+"&page="+page;
		$.ajax({
	        url: url,
	        type: "get",
	        cache:false,
	        async:false,
	        headers:headerToken,
	        dataType:'json',
	        success:function(json){
	            if(json.data.length!=0){
	                var pages=json.data.length;
	                for(var i=0;i<pages;i++){
	                    list.push([json.data[i].repname]);
	                }
	            }else{
	                console.log("报错");
	            }
	        },
	        error:function(json){
	            errorDialog($.parseJSON(json.responseText).code);
	            $('#errorDM').modal('show');
	        }
	    });		
		
		forList(list,4);			
	}

}


function forList(list,type){
	
	var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
	var url="";
	if(type=="1"){
		
	}
	if(type=="2"){
		
	}
	if(type=="3"){
		
	}
	if(type=="4"){
		
	}
	
	//没有判断空
	
    for(var i=0;i<list.length;i++){
        $.ajax({
            url: ngUrl+"/repositories/"+list[i],
            type: "get",
            cache:false,
            async:false,
            headers:headerToken,
            dataType:'json',
            success:function(json){
                $("#loading").empty();
                var times=json.data.optime;
                var jdTime=times.substring(0, times.indexOf("."));
                var xdTime="";
                var showTime="";
                var nums=times.indexOf("|");
                if(nums!="-1"){
                    showTime=times.substring(times.indexOf("|")+1,times.length);
                }else{
                    showTime=times.substring(0, times.indexOf("."));
                }
                var subnum="";
                $.ajax({
                    url: ngUrl+"/subscription_stat/"+list[i],
                    type: "get",
                    cache:false,
                    data:{},
                    async:false,
                    dataType:'json',
                    success:function(json){
                        if(json.code == 0){
                            subnum=json.data.numsubs;
                        }else {
                            console.log("报错");
                        }
                    },
                    error:function(json){
                        errorDialog($.parseJSON(json.responseText).code);
                        $('#errorDM').modal('show');
                    }
                });

                var transnum="";
                $.ajax({
                    url: ngUrl+"/transaction_stat/"+list[i],
                    type: "get",
                    cache:false,
                    data:{},
                    async:false,
                    dataType:'json',
                    success:function(json){
                        if(json.code == 0){
                            transnum=json.data.numpulls;
                        }else {
                            console.log("报错");
                        }
                    },
                    error:function(json){
                        errorDialog($.parseJSON(json.responseText).code);
                        $('#errorDM').modal('show');
                    }
                });

                var starsnum="";
                $.ajax({
                    url: ngUrl+"/star_stat/"+list[i],
                    type: "get",
                    cache:false,
                    data:{},
                    async:false,
                    dataType:'json',
                    success:function(json){
                        if(json.code == 0){
                            starsnum=json.data.numstars;
                        }else {
                            console.log("报错");
                        }
                    },
                    error:function(json){
                        errorDialog($.parseJSON(json.responseText).code);
                        $('#errorDM').modal('show');
                    }
                });
                
                if(type=="1"){
            		
            	}
            	if(type=="2"){
            		
            	}
            	if(type=="3"){
            		
            	}
            	if(type=="4"){
            		 $("#terminal-content-body").append(""+
                     		
                         	"<div class='repo'>"+
         						"<div class='left'>"+

     	    					"<div class='subtitle'>"+ 
     	    						"<a style='color:#0077aa' href='repDetails.html?repname="+list[i]+"'>"+list[i]+"</a>"+ 
     	    					"</div>"+

     	    					"<div class='description'>"+	
     	    						"<p>"+json.data.comment+"</p>"+
     	    					"</div>"+

     	    					"<div class='subline'>"+  	
     	    						"<div class='icon'>"+
     	    							"<img style='margin-right:15px;margin-left:30px' src='images/selects/images_17.png'/>"+
     	    							"<span title='"+jdTime+"'>"+showTime+"<span>"+
     	    							"<img style='margin-right:15px;margin-left:50px' src='images/selects/images_19.png' data-toggle='tooltip' datapalecement='top' title='Paste' Paste/>"+
     	    							"<span>"+json.data.items+"</span>"+
     	    						"</div>"+
     	    					"</div>"+
     	    					
     	    				"</div>"+	

         				"<div class='right'>"+	
         					"<div class='iconGroup' style='margin-right:0px;float:right;border-top:0px;margin-top:60px;'>"+
         						"<div class='like'>"+
         							"<img src='images/selects/images_39.png'>"+
         							"<span style='margin-left: 20px;'>"+subnum+"</span>"+
         						"</div>"+	
         						"<div class='cart'>"+
         							"<img src='images/selects/images_32.png'>"+
         							"<span style='margin-left: 20px;'>"+transnum+"</span>"+
         						"</div>"+
         						"<div class='download'>"+
         							"<img src='images/selects/images_10.png'>"+
         							"<span style='margin-left: 20px;'>"+starsnum+"</span>"+ 
         						"</div>"+
         					"</div>"+
         				"</div>"+
         			"</div>"	                    		
                             
                         ); 
            	}
                
                             
                
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    }
	
}




//获取所有集合total,初始化分页 1.rep 2.item 3.tag 4.user
function ajaxTotal(type,size){
	var url="";
	var allrepnum="";
	var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    if(type=="1"){
		
	}
	if(type=="2"){
		
	}
	if(type=="3"){
		
	}
	if(type=="4"){
		url=ngUrl+"/repositories?username="+getParam("username")+'&size=-1';
	}
    
    
    
    $.ajax({
        url: url,
        type: "get",
        cache:false,
        async:false,
        headers:headerToken,
        dataType:'json',
        success:function(json){
            if(json.data.length!=0){
               allrepnum =json.data.length;
            }else{
                console.log("报错");
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
    
	$(".pages").pagination(allrepnum, {
        maxentries:allrepnum,
        items_per_page: size,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:pagechange,
        load_first_page:false
    });
    
	return allrepnum;
}

//获取数据拥有方详情
function ajaxReUser(){
    var username = getParam("username");
    $.ajax({
        url: ngUrl+"/users/"+username,
        type: "get",
        cache:false,
        data:{},
        async:false,
        dataType:'json',
        success:function(json){
            if(json.code == 0){
                $("#userName").text(json.data.userName);
                $("#userCom").text(json.data.comment);
            }else {
                console.log("报错");
            }
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
}

//获取url参数
function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
}

