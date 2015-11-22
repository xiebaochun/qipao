function getData(cur_index) {
	canMore[cur_index] = 0;
	api_ajax(2, 
		url[cur_index], 
		{	
			page: page[cur_index],
			psize: psize[cur_index],
			t:	'topic'
		}, 
		after_getData,
		cur_index,
		0
		);    
}

function after_getData(ret, _, _, cur_index){
		if (ret.code == 101) {
			page[cur_index]  = -1;			
		} else if (ret.code == 100) {
    		data = ret.data;
			createHtml(data.info.list, cur_index);
			if (cur_index == 1 && page[cur_index] == 1) {
				$("#f_count").text(data.info.pageinfo.recordcount);
			}
    		if (data.info.pageinfo.curpage >= data.info.pageinfo.totalpage)
    			page[cur_index] = -1;  	  					
        }
    	else{
    		page[cur_index]  = -1;
    	}
   		canMore[cur_index] = 1;
}

function createHtml(dlist, cur_index) {
    var uid = $api.getStorage('uid');
	var cHtml = '';
    if(cur_index == 0){
		if (page[cur_index] == 1) $('.topic-list').empty();   
        listTopics(dlist,'.topic-list');
        return false;
    }
	for(var index in dlist){
		switch(cur_index) {
			case 1:
               // console.log(uid);
                if(dlist[index].userid == uid) break;
				cHtml +='<div class="user-item" onclick="openUserSpace(\''+dlist[index].userid+'\');">';
                cHtml += '        <div class="avator-wrap">';
                cHtml += '            <img class="default-avator avator-img" src="'+dlist[index].ui+'" alt="">';
                if (dlist[index].tag != '')
                	cHtml += '            <img class="avator-tag" src="../image/user_tag_ico.png">';
                cHtml += '        </div>';
                cHtml += '        <div class="user-info">';
                cHtml += '            <p>';
                cHtml += '                <span class="user-name">'+dlist[index].nickname+'</span>';
                if (dlist[index].sex == 1)
                	cHtml += '                <i class="gender-ico gender-male-ico fa fa-mars"></i>';
                else if (dlist[index].sex == 2)
                	cHtml += '                <i class="gender-ico gender-female-ico fa fa-mars"></i>';                	
                cHtml += '            </p>';
                cHtml += '            <span class="user-tag">'+dlist[index].tag+'</span>';
                cHtml += '        </div>';
                cHtml += '        <span class="arrow-right"></span>';
                cHtml += '    </div>';
				break;
			case 2:
                console.log("uid="+uid);
                if(dlist[index].userid == uid) break;
				cHtml +='<div class="user-item" ';
				cHtml +=' onclick="openUserSpace('+dlist[index].userid+');">';
                cHtml += '        <div class="avator-wrap">';
                cHtml += '            <img class="default-avator avator-img" src="'+dlist[index].ui+'" alt="">';
                if (dlist[index].tag != '')
                	cHtml += '            <img class="avator-tag" src="../image/user_tag_ico.png">';
                cHtml += '        </div>';
                cHtml += '        <div class="user-info">';
                cHtml += '            <p>';
                cHtml += '                <span class="user-name">'+dlist[index].nickname+'</span>';
                if (dlist[index].sex == 1)
                	cHtml += '                <i class="gender-ico gender-male-ico fa fa-mars"></i>';
                else if (dlist[index].sex == 2)
                	cHtml += '                <i class="gender-ico gender-female-ico fa fa-mars"></i>';                	
                cHtml += '            </p>';
                cHtml += '            <span class="user-tag">'+dlist[index].tag+'</span>';
                cHtml += '        </div>';
                if (dlist[index].be_fav == 1)
                	cHtml += '        <span class="arrow-right"></span>';
                else if (dlist[index].be_fav == 0) {
                	cHtml += '        <span id="fav_'+dlist[index].userid+'" ';
                	cHtml += 'class="follow-bt fav-ta-'+page[cur_index]+'" ';
                	cHtml += 'data-user="'+dlist[index].userid+'">关注</span>';
                	}
                cHtml += '    </div>';			
				break;
			default:
				break;
			}
    }
 
	var content = $("#"+item[cur_index]+"_list");
	if (page[cur_index] == 1) content.empty();
	content.append(cHtml);
	
	if (cur_index == 2 ){
	    $('.fav-ta-'+page[cur_index]).click(function(){
	    	$this = $(this);
	    	favoriteUser($this.data('user'), 'add');
	    	return false;
	    });		    
    }
}

function afterFavoriteUser(sid, act) {
	if (act == 'add') {
		$("#fav_"+sid).empty();
        $("#fav_"+sid).removeClass('follow-bt');
        $("#fav_"+sid).addClass('arrow-right');	
        page[1] = 1;
        getData(1);	
	}
}

function init(index) {
    var uid = $api.getStorage('uid');
	if(!uid || typeof(uid) == "undefined"){ //如果非登录状态，则返回推荐页面
	    var jsfun = "openTab('main', '71bbe');set_gd_new(0);";
	    api.execScript({
	        name: 'root',
	        script: jsfun
	    });
	    return true;	
	} else {
		if (index >= 0 && canMore[0]+canMore[1]+canMore[2] < 3) return;
		if (index < 0) {
			page = new Array(1,1,1);	
			canMore = new Array(0,0,0);
		} else {
			page[index] = 1;
			canMore[index] = 0;
		}	

        var headImgUrl = $api.getStorage('userimage');        
        if(headImgUrl && typeof(headImgUrl) !== undefined){
            $('#headImg').attr('src', headImgUrl);    
        }
        	
		var nickname = $api.getStorage('username');
		//nickname = nickname + "("+uid+")";
		$(".my-user-name").text(nickname);        
     
		api_ajax(2, 
			'my_info_get.php', 
			{	
			}, 
			after_init,
			index,
			0
			); 
	}
}

function after_init(ret, _, _, index) {
   //	console.log(ret);
	if(ret.code == 100){
		data = ret.data;
		var hr_str = "";
  		if (data.tag != "") {
  			hr_str = "我的文章";	//data.tag;
            $('.hongren-ico').attr('src','../image/hr_article_ico.png');
  			myHongren = 1;
  		} else {
  			hr_str = "红人认证";
  			myHongren = 0;
  		}
  		$(".hongren-txt").text(hr_str);
  		
        if(data.userimage && typeof(data.userimage) !== undefined){
        	$api.setStorage('userimage', data.userimage);
            $('#headImg').attr('src', data.userimage);    
        }
        $('#user-title').text(data.tag);
 		var d_count = Array(data.my_post, data.my_fav_user, data.fav_me_user, data.my_fav_topic);
 		for (var i=0; i<4; i++)
 			$("#"+item[i]+"_count").text(d_count[i]);

   		if (index < 0) {
   			var for_f = 0; 
   			var for_t = 3;
   		} else {
   			var for_f = index; 
   			var for_t = index;
   		}
   		for (var i=for_f; i<for_t; i++)	{
	  		if (d_count[i] <= 0) {
	  			$("#"+item[i]+"_none").show();
	  			$("#"+item[i]+"_list").hide();
	  		} else {
	  			$("#"+item[i]+"_none").hide();
	  			$("#"+item[i]+"_list").show();
	  			canMore[i] = 1;
	  			getData(i);
	  		}    		
   		}	
	}else{
  		myToast(ret.code+"/"+ret.msg);
	} 
	isFirst = 0;
}

$(function(){
    $('.nav-item').click(function(){
        $this = $(this);
        $this.siblings().removeClass('nav-active');
        $this.addClass('nav-active');
        $('.section').hide();
        switch($this.data('id')){
            case 't-section':
            	cur_index = 0;
            	break;
            case 'f-section':
            	cur_index = 1;
            	break;
            case 'bf-section':
				cur_index = 2;
            	break;
            default:
            	break;
        }        
        $('.'+$this.data('id')).show();
    });
    
    $('#t_none').click(function(){
		
   	    api.execScript({
            name: 'root',
            frameName: 'topic',
            script: "showFollow();"
            });
        gotoIndexTab('topic','21c8cf');
        //openWin('topic');

    });
        
    $('#f_none').click(function(){
        api.openWin({
            name:'my-follow',
            url:'my-follow.html',
            pageParam:{}
        });
    });
    
    $('#bf_none').click(function(){
        api.execScript({
            name: 'root',
            frameName: 'topic',
            script: "showFollow();"
            });
		gotoIndexTab('topic','21c8cf');
    });       
           
    $('.hongren-wrap').click(function(){
            // openWin('user-hr-apply');
        var uid = $api.getStorage('uid');
        if (myHongren == 0)
        	hUrl = 'my-hr-apply.html';
        else
        	hUrl = 'my-hr-sc.html';
         api.openWin({
            name:'my-hr',
            url: hUrl,
            pageParam:{
            	userid:uid,
            	page_title:'我的专栏',
            	api_file:'my_topic_list.php',
            	t: 'article'
            }
        });
    });
    
    $('#nav-collect').click(function(){
        openWin('my-collect');
    }); 
       
   
});


var myHongren = 0;
var item = new Array('t','f','bf','c');
var url = new Array('my_topic_list.php','my_favorite_user_list.php','my_favorite_me_list.php');	
var page = new Array(1,1,1);	
var psize = new Array(5,10,10);
var canMore = new Array(1,1,1);		
var cur_index = 0;
var isFirst = 1; 

apiready = function () {
        var header = $api.byId('my-header');
        $api.fixIos7Bar(header);
        isDev= false;
	    init(-1);
	    
	    api.addEventListener({
	      name:'viewappear'
	    },function(ret,err){
	        api.execScript({
    	        name: 'root',
        	    script: 'checkCurPid("root","my")'
        	});	        	
	    });
	    
	    api.setRefreshHeaderInfo({
	        visible: true,
	        // loadingImgae: 'wgt://image/refresh-white.png',
	        bgColor: '#f2f2f2',
	        textColor: '#4d4d4d',
	        textDown: '下拉刷新...',
	        textUp: '松开刷新...',
	        showTime: true
	    }, function (ret, err) {
	    	api.hideProgress();
	    	if (canMore[cur_index])
		       		init(cur_index);
	        api.refreshHeaderLoadDone();
	    });
	  
	    api.addEventListener({
	        name: 'scrolltobottom',
	        extra:{
	        	threshold:200
	    	}
	    }, function (ret, err) {	    	
	   	   if (page[cur_index] > 0 && canMore[cur_index])
		        {
			        page[cur_index] = page[cur_index] + 1;
			        getData(cur_index);
		        } 	
 	    }); 
 	    
 	    closeWinAboutLogin();  
};

function  view_appear(show) {
	init(-1);
	console.log("view_appear(my)");
}          

