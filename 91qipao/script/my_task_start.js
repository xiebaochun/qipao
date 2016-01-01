$(function(){
    $('.start-bt').click(function(){
        $this = $(this);
        var search1 = new RegExp('开始任务');
        var search2 = new RegExp('已完成：');
        if (search1.test($this.html()) || search2.test($this.html())){
	        switch($this.attr('id')){
	            case 't110':
            	        api.execScript({
				            name: 'root',
				            script: "start_task(110);"
				            });
				        api.closeWin();
	            	break;
	            case 't120':
	            		$api.setStorage('action_task_id', 120);
	            		openWin('my-account-security');
				        api.closeWin();
	            	break;	            	
	            case 't210':
	            		$api.setStorage('action_task_id', 210);
            	        api.execScript({
				            name: 'root',
				            script: "start_task(210);"
				            });
				        api.closeWin();
	            	break;
	            case 't220':
	            		$api.setStorage('action_task_id', 220);
            	        api.execScript({
				            name: 'root',
				            frameName: 'my',
				            script: "goto_topic(1);"
				            });	 
				        api.closeWin();               
					break;
	            case 't230':
	            		$api.setStorage('action_task_id', 230);
            	        api.execScript({
				            name: 'root',
				            frameName: 'my',
				            script: "goto_topic(0);"
				            });
				        api.closeWin();
					break;
	            case 't240':
	            		$api.setStorage('action_task_id', 240);
            	        api.execScript({
				            name: 'root',
				            frameName: 'my',
				            script: "goto_topic(0);"
				            });	
				        api.closeWin();            
					break;
	            case 't250':
	            		openWindow('free-reward');
					break;
	            default:
	            	break;
	        } 
        }
    });
});

function openWindow(name){
 	var action = "";  //"openWindow('"+name+"')";
 	if (!checkLogin(action, 'my')) 
		return;   
    api.openWin({        
        name:   name,
        url:    name+'.html',
        pageParam: {},
        reload: false,
        opaque: true,
        bounces:false,
        vScrollBarEnabled: false,
        softInputMode: 'resize'
    });
}
