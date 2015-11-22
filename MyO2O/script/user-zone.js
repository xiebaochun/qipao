function getData(cur_index) {
 	canMore[cur_index] = 0;
	api_ajax(2, 
		url[cur_index], 
		{	
			sid: sid,
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
		if (ret.code == 100) {
    		data = ret.data;
			createHtml(data.info.list, cur_index);
    		if (data.info.pageinfo.curpage >= data.info.pageinfo.totalpage)
    			page[cur_index] = -1;  	  					
        } else {
    		page[cur_index]  = -1;
    	}
    	canMore[cur_index] = 1;	
}

function createHtml(dlist, cur_index) {
	var uid = $api.getStorage('uid'); 
	var cHtml = '';	
	switch(cur_index) {
			case 0:
				if (page[cur_index] == 1) $("#"+item[cur_index]+"_list").empty();
                listTopics(dlist,'#t_list');
                return false;	
				break;
			case 1:
              for(var index in dlist){
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
             if (dlist[index].me_fav_ta == 1 || dlist[index].userid == uid)
                	cHtml += '        <span class="arrow-right"></span>';
                else if (dlist[index].me_fav_ta == 0)
                	cHtml += '        <span id="fav_'+dlist[index].userid+'" class="follow-bt fav-ta-'+page[cur_index]+'" data-user="'+dlist[index].userid+'">关注</span>';
                cHtml += '    </div>';  
             }              
 				break;
			case 2:
                //listArticle(dlist,'#a_list');  
             	for(var index in dlist){
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
	                if (dlist[index].me_fav_ta == 1 || dlist[index].userid == uid)
	                	cHtml += '        <span class="arrow-right"></span>';
	                else if (dlist[index].me_fav_ta == 0) {
	                	cHtml += '        <span id="fav_'+dlist[index].userid+'" ';
	                	cHtml += 'class="follow-bt ta-fav-'+page[cur_index]+'" ';
	                	cHtml += 'data-user1="'+dlist[index].userid+'">关注</span>';
	                	}
	                cHtml += '    </div>';	 
                }               
  				break;
			default:
				break;
			}
    
	var content = $("#"+item[cur_index]+"_list");
	if (page[cur_index] == 1) content.empty();
	content.append(cHtml);
	
	if (cur_index == 1 ){
	    $('.fav-ta-'+page[cur_index]).click(function(){
	    	$this = $(this);	    	
	    	favoriteUser($this.data('user'), 'add');
	    	return false;
	    });	
    }
	if (cur_index == 2 ){
	    $('.ta-fav-'+page[cur_index]).click(function(){
	    	$this = $(this);
	    	favoriteUser($this.data('user1'), 'add');
	    	return false;
	    });	
    }    
}

function afterBlacklistUser(sid, act) {
	if (act == 'add') {
		bl_ta = 1;
		myToast('将ta加入了黑名单');
	} else {
		bl_ta = 0;
		myToast('取消ta黑名单成功');
	}
	if (bl_ta == 0)
		$("#blacklist").html('加入黑名单');
	else
		$("#blacklist").html('取消黑名单');			
}

function afterFavoriteUser(sid, act) {
	if (act == 'add') {
		me_fav_ta = 1;
	    $("#follow-wraper").css('background-color','#eee');
		$("#follow-label").text('取消关注');
		$("#follow-wraper").show();
		var count = parseInt($("#"+item[2]+"_count").text());
		$("#"+item[2]+"_count").text(count+1);
	} else {
		me_fav_ta = 0;
		$("#follow-wraper").css('background-color','#ffc72a');
		$("#follow-label").text('关注');
		$("#follow-wraper").show();
		var count = parseInt($("#"+item[2]+"_count").text());
		$("#"+item[2]+"_count").text(count-1);		
	}
    //page[2] = 1;
    //getData(2);		
}

function init(index) {
    var uid = $api.getStorage('uid');
	if(!uid || typeof(uid) == "undefined"){
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
		
		api_ajax(2, 
			'user_info_get.php', 
			{	
				sid:sid
			}, 
			after_init,
			index,
			0
			); 
	}
}

function after_init(ret, _, _, index) {
   	console.log(ret);
	if(ret.code == 100){
		var uid = $api.getStorage('uid');
		
		data = ret.data;	
		user_info = data;
		username = data.nickname;
		$("#headImg").attr("src",data.userimage);
		var nickname = data.nickname;
		//nickname = nickname + "("+sid+")";
		$("#usernickname").text(nickname);
		$("#user_title").text(data.tag);		
	
		set_profile();
		
		$("#nick-name").val(data.nickname);
		$("#uniqueid").val(data.uniqueid);
		if (data.resume == '')
			$("#resume").val('(未填写)');
		else
			$("#resume").val(data.resume);
		if (data.city == '')
			$("#city").val('(未填写)');
		else
			$("#city").val(data.city);
		if (data.age == '' || data.age == 0)
			$("#age").val('(未填写)');
		else
			$("#age").val(data.age);
		if (data.lookingfor == '')
			$("#sex-trend").val('(未填写)');
		else
			$("#sex-trend").val(data.lookingfor);		
		
  		if (data.ta_article > 0) {
  			$('.hongren-wrap').show();
  			taHongren = 1;
  		} else {
  			$('.hongren-wrap').hide();
  			taHongren = 0;
  		}
  		
  		if (uid == sid) {
  			$("#login_register").hide();
  			$(".more-bt").hide();
  		} else {
  			$("#login_register").show();
  			$(".more-bt").show();
  			//alert(data.me_fav_ta);
      		if (data.me_fav_ta == 1) {
      			me_fav_ta = 1;
      			$("#follow-wraper").css('background-color','#eee');
      			$("#follow-label").text('取消关注');
      			$("#follow-wraper").show();
      		} else {
      			me_fav_ta = 0;
      			$("#follow-wraper").css('background-color','#ffc72a');
      			$("#follow-label").text('关注');
      			$("#follow-wraper").show();
      		}
	  		bl_ta = data.bl;
	  	 	if (bl_ta == 0)
	 			$("#blacklist").html('加入黑名单');
	 		else
	 			$("#blacklist").html('取消黑名单');	
  		}
  					
  		var d_count = Array(data.ta_post, data.ta_fav_user, data.fav_ta_user);
 		for (var i=0; i<3; i++)
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

function set_profile() {
	var uid = $api.getStorage('uid');
	var sex = $api.getStorage('sex');
	var plaform = $api.getStorage('platform');
	var mobile = $api.getStorage('mobile');
	
	if(typeof(sex) == "undefined"  || sex == 0
		|| (plaform != 'qp_phone' && (typeof(mobile) == "undefined") || mobile == "")) { 
		$('.more-get').hide();
		$('#profile_more').show();
	} else {
		$('.more-get').show();
		$('#profile_more').hide();
	}
}

function checkSendPM(sid, username) {
	var canSendPM = $api.getStorage('canSendPM');
	if(!canSendPM || typeof(canSendPM) == "undefined") {
		api_ajax(2, 
			'gd_pm_add_cond.php', 
			{	
			}, 
			after_checkSendPM,
			{
				sid:sid,
				username:username
			},
			0
			);
		return;
	}	
    openPM(sid, username);
}   	

function after_checkSendPM(ret, _, _, others) {
	if (ret.code == 100) {
    //取消私信条件
    openPM(others.sid, others.username);
    return;

		if (ret.data.my_forum_count >= 	ret.data.need_forum_count
			&& ret.data.my_like_forum_count >= ret.data.need_like_forum_count) {
				$api.setStorage('canSendPM', 1);
				openPM(others.sid, others.username);
				return;
			}
			/*
			                            <div><span class="label" id="t_count_1">发表话题(1/3)</span>
                            <span class="bt" id="t_btn_1">去话题</span></div>
                            <div><span class="label" id="t_count_2">关注话题(1/3)</span>
                            <span class="bt" id="t_btn_2">已完成</span></div> 
			 */
    ret.data.my_forum_count = ret.data.my_forum_count > ret.data.need_forum_count?ret.data.need_forum_count:ret.data.my_forum_count;
    ret.data.my_like_forum_count = ret.data.my_like_forum_count > ret.data.need_like_forum_count?ret.data.need_like_forum_count:ret.data.my_like_forum_count;
		var t_count_1 = "发表话题("+ret.data.my_forum_count+"/"+ret.data.need_forum_count+")";	
		var t_count_2 = "关注话题("+ret.data.my_like_forum_count+"/"+ret.data.need_like_forum_count+")";
		$('#t_count_1').html(t_count_1);
		$('#t_count_2').html(t_count_2);
		if (ret.data.my_forum_count >= 	ret.data.need_forum_count) {
			$('#t_btn_1').html('已完成').css('background-color','#ddd');
			$('#t_btn_1').click(function(){
				return false;
			});
		} else {
			$('#t_btn_1').html('发表话题');
			$('#t_btn_1').click(function(){
				openWin('publish-topic');
			});
		}
		if (ret.data.my_like_forum_count >= ret.data.need_like_forum_count) {
			$('#t_btn_2').html('已完成').css('background-color','#ddd');;
			$('#t_btn_2').click(function(){
				return false;
			});
		} else {
			$('#t_btn_2').html('关注话题');
			$('#t_btn_2').click(function(){
				openWin('topicAllCircle');
			});
		}
		$('#send-pm').show();	
	}
}    	

//打开发布话题页面
function openPublishWin(){
        api.openWin({
            name:'publish-topic',
            url:'publish-topic.html',
            pageParam:{
                fid:fid
            }
        });
    }
  
function get_profile(){
	var uid = $api.getStorage('uid');
	if (uid == sid) return; 
	//$('.nav-item').removeClass('nav-active');
	//$('.section').hide();
	//$('.profile-section').show();
	  api.openWin({
	    name:'user-info',
	    url:'user-info.html',
	    pageParam:{sid:sid}
	  });
	//cur_index = 3;
}
    
$(function(){
    $('.nav-item').click(function(){
    	$('.profile-section').hide();
        $this = $(this);
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
               
        $this.siblings().removeClass('nav-active');
   		$this.addClass('nav-active');
        $('.section').hide();
        $('.'+$this.data('id')).show();
    });
    
    $('#headImg').click(function(){
    	//cur_index = -1;
    });
    
    $('#private-mail-wraper').click(function(){
    	checkSendPM(sid, username);
	});
	
    $('#follow-wraper').click(function(){
    	var act = 'add';
    	if (me_fav_ta == 1){
        if(!confirm('确定取消关注?')) return false;
    		act = 'cancel';
      }
    	favoriteUser(sid, act);
	});
	    
    $('#t_none').click(function(){
 		gotoIndexTab('topic','21c8cf');
 		api.closeWin();
    });
      
    $('#a_none').click(function(){
		gotoIndexTab('main','71bbe');
		api.closeWin();
    });
     
    //举报用户
    $('.more-bt').click(function(){
        $('.report-user').fadeIn(200);
        $('.report-user').show();
        //$('.choose-item-list').slideToggle();   
    }); 
    $('.select-cancel-bt').click(function(){
        
        $(this).parent().parent().fadeOut(200);
        //$('.choose-item-list').slideToggle();
    });
    $('.pop-wrap').click(function(){
        $(this).fadeOut(200);
         
    });   
    
    $('.dialog-close-bt').click(function(){        
        $(this).parent().parent().hide();
        //$('.choose-item-list').slideToggle();
    });
    
   $('.hongren-wrap').click(function(){
         api.openWin({
            name:'user_topic_list',
            url: 'my-hr-sc.html',
            pageParam:{
            	userid:sid,
            	page_title: username+'的文章',
            	api_file:'user_topic_list.php',
            	t: 'article'
            }
        });
    });
    
    $('.report-option').click(function(){
   			$this = $(this);		
   			if ($this.data('msg') == "bl") {
	   	    	var act = 'add';
		    	if (bl_ta == 1)
		    		act = 'cancel';
		    	blacklistUser(sid, act);			
   			} else {
    			var message = "被举报人："+sid+"。[个人空间]。理由："+$this.data('msg');    		
    			myReport(message);
    		}    		
    		$('.report-user').fadeOut(200);
    		$('.report-user').hide();
    });  

    initDev();

});

var sid = 0;
var user_info = null;
var username = "";
var taHongren = 0;
var item = new Array('t','f','bf');
var url = new Array('user_topic_list.php','user_favorite_user_list.php','user_favorite_ta_list.php');	
var page = new Array(1,1,1);	
var psize = new Array(5,10,10);
var canMore = new Array(1,1,1);	
var cur_index = 0;
var me_fav_ta = 0;
var bl_ta = 0;
var isFirst = 1;  

apiready = function () {
    	var header = $api.byId('header');
    	$api.fixIos7Bar(header);
    
        isDev = false;
        // console.log($api.getStorage('uid'));
		sid = api.pageParam.sid;
	
	    api.addEventListener({
	      name:'viewappear'
	    },function(ret,err){
	    	//$("#login_register").hide();
	    	//$(".more-bt").hide();
	    	//if (isFirst == 0) 
	    	{
	        	init(-1);
	        }
	    });
//myToast("user_zone:  hhhhhh__"+isFirst);
//		init(-1);
	    
	    api.setRefreshHeaderInfo({
	        visible: true,
	        loadingImg: '../image/refresh.png',
	        bgColor: '#f2f2f2',
	        textColor: '#4d4d4d',
	        textDown: '下拉刷新...',
	        textUp: '松开刷新...',
	        showTime: false
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
	   	   if (page[cur_index]>0 && canMore[cur_index])
		        {
			       page[cur_index] = page[cur_index] + 1;
			       getData(cur_index);
		        } 	
 	    }); 
 	    
		closeWinAboutLogin(); 	      
};


