var errorDialog=function(num){
	var str="";
	switch(num)
	{
		case 1001:
			str="未知错误"
		break;
		case 1002:
			str="json解释失败";
		break;
		case 1001:
			str="不支持的URL"
		break;
		case 1002:
			str="DB没有初始化";
		break;
		case 1003:
			str="未知错误"
		break;
		case 1004:
			str="json解释失败";
		break;
		case 1005:
			str="认证失败"
		break;
		case 1006:
			str="没有权限";
		break;
		case 1007:
			str="参数违法"
		break;
		case 1008:
			str="数据库操作";
		break;
		case 1009:
			str="查询字段出错";
		break;
		case 1010:
			str="文件操作失败"
		break;
		case 1400:
			str="参数缺失";
		break;
		case 1011:
			str="连接其他服务错误"
		break;
		case 6001:
			str="用户名不能为空"
		break;
		case 6002:
			str="用户未注册"
		break;
		case 6003:
			str="用户没有Entrypoint"
		break;
		case 6101:
			str="缺少验证信息"
		break;
		case 6201:
			str="缺少Daemonid"
		break;
		case 6202:
			str="EntryPoint不可达"
		break;
		case 8001:
			str="没有该用户配额信息"
		break;
		case 8002:
			str="注册用户已存在"
		break;
		case 8004:
			str="原始密码错误"
		break;
		case 8005:
			str="未登录"
		break;
		case 8006:
			str="用户配额信息已存在"
		break;
		case 8007:
			str="余额不足"
		break;
		default:
			str="未知错误";	
		
	}
	
	
	$("body").append("<div id='errorDM' class='modal fade bs-example-modal-sm' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>" +
	"<div class='modal-dialog modal-sm' style='width:196px;margin-top:200px;'>"+
	"<div class='modal-content'>"+
	
		"<div class='modal-header' style='padding:5px 15px;'>"+
	    	"<button aria-label='Close' data-dismiss='modal' class='close' type='button'><span aria-hidden='true'>×</span></button>"+
	    	"<h4 class='modal-title' style='font-family:Lucida Console'>Sorry</h4>"+
	    "</div>"+
	    "<div class='modal-body'>"+str+"！</div>"+
		
	"</div>"+
	"</div>");
	
	
}
