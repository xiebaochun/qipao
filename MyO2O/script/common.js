var API_URL =  'http://qipaobbs.91qipao.com/api/app_s/'


isDev = false;

if($api.getStorage('isDev') == 'true'){
    isDev = true;

}else{
    window.console.log = function(){}
}
function initDev(){
	if(isDev) {
        setDevEv();
        apiready();
    }
}
function setDevEv(){
    // var tid = 6266;
    console.log('dev...');
    //alert('dev...');
    $api.setStorage('uid','3078');
    window.api = {}; 
    api.pageParam = {};
    api.pageParam.id = 10308;//7855;
    api.pageParam.tid = 10308;//7855;
    api.pageParam.sid = 1789;
    api.pageParam.userid = 3344;
    api.pageParam.fid = 98;
    api.pageParam.topicType = 'article';
    api.alert = function(data){
        console.log(data);
    }
    api.execScript = function(){

    }
    api.showProgress = function(){
    
    }
    api.hideProgress = function(){
    }
    api.parseTapmode = function(){
    }
    api.setPrefs = function(){
    }
    api.setRefreshHeaderInfo = function(){

    }
    api.openFrame = function(){

    }
    api.toast = function(data){
        console.log(data.msg);
    }
    api.ajax = function(option,callback){
        //alert('fsdf');
        var options = {};// = option;
        options.url = option.url;
        options.method = option.method;
        options.dataType = option.dataType;
        
        if(option.hasOwnProperty('data')){
            options.data = option.data.values;    
        }
        
        options.success = callback;
        //console.log('1');
        $.ajax(options);
    }
    api.closeToWin = function(){
    }
    api.addEventListener = function(option,callback){
        //滚动到底部
        console.log('swdf');
        if(option.name == 'scrolltobottom'){
            $(window).scroll(function() {
                
                if ($(document).scrollTop()<=0){
                    //alert("滚动条已经到达顶部为0");
                }
         
                if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    //alert("滚动条已经到达底部为" + $(document).scrollTop());
                    callback();
                }
            });
        }
        if(option.name == 'viewappear'){
            callback();
        }
    }

} 
var ajax_waring = "";
var ajaxRuning = false;
function api_ajax_new(checklogin, app_file, values, _callback, others, progress) {
		/*
	 		checklogin:	是否判断已登录(0:不检查；1：检查[未登录即返回false]；2：强制去登陆)
	 		app_file:		服务器端的文件名(例如：util_login.php)
	 		values:			数据数组
	 		_callback:		回调函数		
	 		others:			其他参数
			progress:		0:不需要；1：'加载中...',2:'上传中...',3:'正在登录...'
	 	*/
	 var uid = $api.getStorage('uid');	
	 if (checklogin > 0) {	
	 	if(!uid || typeof(uid) == "undefined") {
	 		if (checklogin == 1 )
	 			return false;
	 		else if (checklogin == 2) {
	 			api.openWin({
					name: 'utilLogin',
					url: './util-login.html',
					opaque: true,
					vScrollBarEnabled:false
	 			});	
	 			return;	
	 		}	 		
	 	}
	 } else {
	 	if(!uid || typeof(uid) == "undefined") { 
	 		uid = 0;
	 	}
	 }

	 if (progress)
	 {
		var progress_str = "";
	    switch(progress) {
			case 1: progress_str = '加载中...';
				break;
			case 2: progress_str = '上传中...';
				break;
			case 3: progress_str = '正在登录...';
				break;
			default:
				break;
	    }
		api.showProgress({
			title:  '', //progress_str,
            text:'',
			modal: false
		});
	 }
	 values['uid'] = uid;
     var ajaxUrl = API_URL + app_file; 
     ajaxRuning = true;
     $.ajax({
        url:ajaxUrl,
        type:'post',
        dataType:'json',
        cache: true,
        //timeout: 60,
        data: values,
 	    error:function(ret){
 	    	api.alert({msg:ret});
	        },       
        success:function(ret){
        	api.hideProgress();
        	if (ret) {
        		ajax_waring = "";
        		try {
        			if (_callback) {
        				_callback(ret, app_file, values, others);
//console.warn("hh_"+app_file+"____"+window.location);       				
        			} else {
					}
			     } catch(e) {
			        alert(e + "_("+_callback+")")
			    }  
			         		
		    } else {
		    	if (ajax_waring == "") {
		    		//myToast("网络连接不畅,请稍后重试。"+"_"+app_file);
		    		myToast("网络连接不畅,请稍后重试。");
		    	}
		    	/*
			    api.alert({
    		        msg:('错误码：'+err.code+'; 错误信息：'+err.msg+'; 网络状态码：'+err.statusCode+";"+app_file)
        		});
        		*/
		    } 
		    ajaxRuning = false;
         }
      });
 //console.warn("here_9900_");      
      return true;
}

function api_ajax(checklogin, app_file, values, _callback, others, progress) {
		/*
	 		checklogin:	是否判断已登录(0:不检查；1：检查[未登录即返回false]；2：强制去登陆)
	 		app_file:		服务器端的文件名(例如：util_login.php)
	 		values:			数据数组
	 		_callback:		回调函数		
	 		others:			其他参数
			progress:		0:不需要；1：'加载中...',2:'上传中...',3:'正在登录...'
	 	*/
	 	
	 var uid = $api.getStorage('uid');	
	 if (checklogin > 0) {	
	 	if(!uid || typeof(uid) == "undefined") {
	 		if (checklogin == 1 )
	 			return false;
	 		else if (checklogin == 2) {
	 			api.openWin({
					name: 'utilLogin',
					url: './util-login.html',
					opaque: true,
					vScrollBarEnabled:false
	 			});	
	 			return;	
	 		}	 		
	 	}
	 } else {
	 	if(!uid || typeof(uid) == "undefined") { 
	 		uid = 0;
	 	}
	 }

	 if (progress)
	 {
		var progress_str = "";
	    switch(progress) {
			case 1: progress_str = '加载中...';
				break;
			case 2: progress_str = '上传中...';
				break;
			case 3: progress_str = '正在登录...';
				break;
			default:
				break;
	    }
		api.showProgress({
			title:  '', //progress_str,
            text:'',
			modal: false
		});
	 }
	 values['uid'] = uid;
     var ajaxUrl = API_URL + app_file; 
     ajaxRuning = true;
     api.ajax({
        url:ajaxUrl,
        method:'post',
        dataType:'json',
        cache: true,
        timeout: 60,
        data:{
        	values: values
         	}
        },
        function(ret, err){
        	api.hideProgress();
        	if (ret) {
        		ajax_waring = "";
        		try {
        			if (_callback) {
        				_callback(ret, app_file, values, others);
// console.warn("hh_"+app_file+"____"+window.location);       				
        			} else {
					}
			     } catch(e) {
			        alert(e + "_("+_callback+")")
			    }  
			         		
		    } else {
		    	if (ajax_waring == "") {
		    		//myToast("网络连接不畅,请稍后重试。"+"_"+app_file);
		    		myToast("网络连接不畅,请稍后重试。");
		    	}
		    	/*
			    api.alert({
    		        msg:('错误码：'+err.code+'; 错误信息：'+err.msg+'; 网络状态码：'+err.statusCode+";"+app_file)
        		});
        		*/
		    } 
		    ajaxRuning = false;
         }
      );
 //console.warn("here_9900_");      
      return true;
}

function get_gouda_datainfo(from) {
	if (from == 0 && ajaxRuning) return;
	var uid = $api.getStorage('uid');
	if(!uid || typeof(uid) == "undefined") return;
	api_ajax(2, 
			'gd_datainfo_get.php', 
			{}, 
			after_gouda_datainfo,
			from,
			0
		);	
}

function after_gouda_datainfo(ret, _,  _, from){
       if (ret.code == 100)
       {
           data = ret.data;
           if (from == 1) {
           	set_div('n_count', data.n);
           	set_div('l_count', data.r);
           	set_div('r_count', data.c);
           	set_div('p_count', data.p);
           }
           var 	gouda_data  = '_' + data.n;
           		gouda_data += '_' + data.r;
           		gouda_data += '_' + data.c;
           		gouda_data += '_' + data.p;  
       		var jsfun = '';     
       		if (gouda_data != "____") {       
            	jsfun = 'set_gd_new(1);';
        	} else {
            	jsfun = 'set_gd_new(0);';       
       		 }
        	api.execScript({
            	name: 'root',
            	script: jsfun
        	}); 
    } 
	canMore = 1;
}  

String.prototype.gblen = function() {    
    var len = 0;    
    for (var i=0; i<this.length; i++) {    
        if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {    
             len += 2;    
         } else {    
             len ++;    
         }    
     }    
    return len;    
}   

String.prototype.trim=function(){
　　    return this.replace(/(^\s*)|(\s*$)/g, "");
　　 }

String.prototype.ltrim=function(){
　　    return this.replace(/(^\s*)/g,"");
　　 }

String.prototype.rtrim=function(){
　　    return this.replace(/(\s*$)/g,"");
　　 }
 
//是否省流量
var isLimitData = $api.getStorage('isLimitData');
if(typeof isLimitData == 'undefined'){
    $api.setStorage('isLimitData',false);   
    isLimitData = 'false'; 
}
function isInArray(array,value){
    if(array.length<1){
        return false;
    }
    for(var index in array){
        var temp = recommenderUidArray[index];
        if(temp == value){
            return true;
        }
    }
    return false;
}
function replyToUser(self){
    $(self).find('.reply-to-user').trigger('click');
}

function openWin(name) { 
    api.openWin({ 
        name: name,
        url: name + '.html',
        opaque: true,
        vScrollBarEnabled: false

    });
}

//user
function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function edit(el) {
    var del = $api.next(el, '.del');
    if (el.value) {
        $api.addCls(del, 'show');
    }
    $api.addCls(el, 'light');
}

function cancel(el) {
    var del = $api.next(el, '.del');
    $api.removeCls(del, 'show');
    $api.removeCls(el, 'light');
}

function myToast(msg) {
	myToast(msg, 1000, 'middle');
}
function myToast(msg, duration) {
	myToast(msg, duration, 'middle');
}
function myToast(msg, duration, location) {
    var duration = duration || 1000;
    var location = location || 'middle';
   api.toast({
			msg : msg,
			duration: duration,
			location : location
 			});
}	

//play heart
function playHeart(id){
    
    var heartHtml = '<div class="heart-wrap" id="'+id+'"style="position:fixed;top:0;left:0;width:100%;height:100%;"><div class="heart" style="position:absolute;top:50%;left:50%;margin-top:-45px;margin-left:-50px;"></div></div>';

    var $heart = $(heartHtml);
    
    $('body').append($heart);
    
    setTimeout(function(){

        $heart.remove();

    },800);
}
//play star
function playStar(){
    var starHtml = '<div class="heart-wrap" style="position:fixed;top:0;left:0;width:100%;height:100%;-webkit-transform: rotate(35deg);transform: rotate(35deg);"><div class="star-five" style="position:absolute;top:50%;left:50%;margin-top:-45px;margin-left:-100px;"></div></div>';

    var $star = $(starHtml);
    
    $('body').append($star);
    
    setTimeout(function(){

            $star.remove();

    },800);
}
function gotoIndexTab(type,tid) {
    var jsfun = "openTab('"+type+"', '"+tid+"')";
    api.execScript({
        name: 'root',
        script: jsfun
    });
    return true;
}

function checkLogin(action, from, winName){
	var uid = $api.getStorage('uid'); 
	if(!uid || typeof(uid) == "undefined") {
		if (typeof(winName) == "undefined") winName = '';
		$api.setStorage('login_after', {action:action, from:from, winName:winName});
 		var url = './util-login.html';
 		if (from == "root" )
 			url = './html/util-login.html';
		api.openWin({
			name: 'userLogin',
			url: url,
			opaque: true,
			vScrollBarEnabled:false
		});	
        return false;
    }
    return true;
}

function after_login_action() {
	var login_after = $api.getStorage('login_after');
	$api.rmStorage('login_after');
	if (login_after) {
		if (login_after.from == "my" ) login_after.from = "root";
		if (login_after.from == "root" ) {
			api.closeToWin({name: 'root'});
	   	    api.execScript({
	            name: 'root',
	            script: login_after.action
	            });			 
		} else if (login_after.from == "" ) {
			api.openWin({
				name: login_after.winName,
				url: login_after.action,
				opaque: true,
				vScrollBarEnabled:false
			});					
		} else {
	   	    api.execScript({
	            name: 'root',
	            frameName: login_after.from,
	            script: login_after.action
	            });		
		}				
		return;
	}
	
 	//api.closeWin({});
	closeWinAboutLogin();
	return;
}

function closeWinAboutLogin() {
	setTimeout(function(){
		api.closeWin({name: 'userLogin'});
		api.closeWin({name: 'userLoginByPhone'});
		api.closeWin({name: 'userRegister'});
		api.closeWin({name: 'userLoginFillInfo'});
	}, 500);
}

function closeMainSlide() {
	var	jsfun = 'slideSwitch(0);';
    api.execScript({
         name: 'root',
         frameName:'main',
         script: jsfun
    });	
}

//open new window
function openNewWin(w_name,tid){
	api.openWin({
		name: w_name,
		url: w_name + '.html',
		pageParam:{tid:tid},
		reload:false,
		opaque:true,
		cScrollBarEnabled:false,
		softInputMode:'resize'
	});
}

//打开帖子详细页
function openTopicDetail(tid, fid, timoeout,topicType) {
	closeMainSlide();
        
 	var action = "openTopicDetail('"+tid+"', '"+fid+"',500)";
 	if (!checkLogin(action, 'main')) 
 		return;
 	if (typeof(timoeout) == "undefined") timoeout = 0;
 		
    var _topicType = topicType || 'article';
    //alert(topicType);
    var id = tid.replace("index#","");
    setTimeout(function(){
                api.openWin({        
		        name:  'topicDetail-'+tid,
		        url:   'topicDetail.html',
		        pageParam: {id:id, fid:fid,topicType:_topicType},
		        reload: false,
		        opaque: true,
		        delay: 5,
		        vScrollBarEnabled: false,
		        softInputMode: 'resize'
		    });
		}, timoeout);		  
}

//打开话题圈列表
function openTopicCircle(fid, fname, e, timeout) {

	var action = "openTopicCircle('"+fid+"','"+fname+"', '"+0+"',500)";
 	if (!checkLogin(action, 'topic')) 
 		return;
 	if (typeof(timoeout) == "undefined") timoeout = 0; 
  	
    if(e){e.cancelBubble = true;}
    setTimeout(function(){
	    api.openWin({
	        name:'topic-circle',
	        url:'topic-circle.html',
	        pageParam:{
	            fid:fid,
	            fname:fname
	        }
	    });

	}, timoeout);	    
	return false;
}

//打开个人空间
//参数：userid(用户id) e(可选，事件)
function openUserSpace(userid,e,timout) {
	closeMainSlide();
	//var action = "openUserSpace('"+userid+"', '"+0+"',500)";
	var action = "openTab('my', '1c8d1')";
 	if (!checkLogin(action, 'my')) 		//'main'
 		return;
 	if (typeof(timoeout) == "undefined") timoeout = 0;
 	
    if(e){e.cancelBubble = true;}
    if($api.getStorage('uid') == userid){
        return false;
    }
    setTimeout(function(){
	    api.openWin({        
	        name:   'user-zone_'+userid,
	        url:    'user-zone.html',
	        pageParam: {sid:userid},
	        reload: false,
            bounces:true,
	        opaque: true,
	        vScrollBarEnabled: false,
	        softInputMode: 'resize'
	    });	
	}, timoeout);    
    
	return true;
}

//关注/取消关注某人
function favoriteUser(sid, act) {
	//act:	add/cancel
    var info = {
			sid: sid,
			act: act
			};
	api_ajax(2, 
		'my_favorite_user_set.php', 
		info, 
		after_favoriteUser,
		info,
		0
		); 		

    return true;
}

function after_favoriteUser(ret, _, _, info) {
	if (ret.code == 100) {
		try{ 
			afterFavoriteUser(info.sid, info.act);
		}catch(e){
		} 		
    }
}

//加入/取消黑名单
function blacklistUser(sid, act) {
	//act:	add/cancel
    var info = {
			sid: sid,
			act: act
			};
	api_ajax(2, 
		'my_blacklist_set.php', 
		info, 
		after_blacklistUser,
		info,
		0
		); 		

    return true;
}

function after_blacklistUser(ret, _, _, info) {
	if (ret.code == 100) {
		try{ 
			afterBlacklistUser(info.sid, info.act);
		}catch(e){
		} 		
    }
}

//举报
/*
 * 
		举报理由:
			——被举报人：id。[话题：id]。理由：{广告/色情/骚扰/泄露隐私/其他}
			——被举报人：id。[私信]。理由：{色情/欺诈/侮辱诋毁/广告骚扰/政治}
			——被举报人：id。[个人空间]。理由：{头像违规/昵称违规/发表违规内容}
 */
function myReport(message) {
	//act:	add/cancel
    var info = {
			username: $api.getStorage('username'),
			message: message
			};
	api_ajax(2, 
		'my_report.php', 
		info, 
		after_myReport,
		info,
		0
		); 		

    return true;
}

function after_myReport(ret, _, _, info) {
	if (ret.code == 100) {
		try{ 
			//afterMyReport();
			myToast("感谢您的举报，我们将及时做出处理。");
		}catch(e){
		} 		
    }
}

//关注/取消关注话题圈
function favoriteCircle(fid, act , e , dom) {
	//act:	add/cancel
    //阻止事件冒泡
    if(e){e.cancelBubble = true;}
    var info = {
			fid: fid,
			act: act,
			dom: dom
			};

	api_ajax(2, 
		'my_favorite_circle_set.php', 
		{
			fid: fid,
			act: act		
		}, 
		after_favoriteCircle,
		info,
		0
		); 	
    console.log(fid);
 
    return true;
}

function after_favoriteCircle(ret, _, _, info) {
	if (ret.code == 100) {

		try{ 
            if(info.dom){
                afterFavoriteCircle(info.act,info.dom)
            }
		}catch(e){
		} 		
    }
}

//发送验证码
function sendAuthcode(phone) {
	 if(phone == ''){
        myToast('请填写正确的手机号码');
        return;
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
	  if(!myreg.test(phone)){ 
	  	  myToast('请填写正确的手机号码');
	  	  return;
		}

    var info = {
			phone: phone
			};
	api_ajax(0, 
		'util_authcode_get.php', 
		info, 
		after_sendAuthcode,
		info,
		0
		); 		

    return true;
}

function after_sendAuthcode(ret, _, _, info) {
	if (ret.code == 100) {
		myToast("验证码发送成功，请在30分钟内使用。");
		try{ 
             setAuthCodeTime(60);
		}catch(e){
		} 		
    } else {
    	myToast(ret.msg);
    }
}

//与人聊私信
function openPM(sid, username) {
	//alert("PM:"+sid +"/"+username);
	api.openWin({
		name: 'gouda-pm-chat',
		url:  'gouda-pm-chat.html',
		pageParam:{sid:sid, username:username},
	    reload: false,
		opaque:true,
		cScrollBarEnabled:false,
		softInputMode:'resize'
	});	
    return true;
}

//处理广告点击信息
function clickAD(action) {
	//myToast("AD_1:"+action);
	//action = "webview#http://www.baidu.com";
	action = action.toLowerCase();
	actStr = action.split("#");
	/*
					1、首页轮播广告：	index#2345
				2、活动：		activity#123	【暂未用】
					3、外链：		webview#2#url	【暂未用】		（#2#中的2表示话题圈fid）
					4、话题：		topic#3456
					5、话题圈：		circle#3456
					6、专题：		subject#123	【暂未用】 
	 */
	if (actStr.length >= 2) {
		 if (actStr[0] == "index" || actStr[0] == "article" || actStr[0] == "topic") {
                var topicType = 'article';
                if(actStr[0] == "index" || actStr[0] == "article"){
                    topicType = 'article';
                }else if(actStr[0] == "topic"){
                    topicType = 'topic';
                }
		 		if (actStr.length == 2)
		 			openTopicDetail(actStr[1], 0, 0, topicType);
		 		else if (actStr.length == 3)
		 			openTopicDetail(actStr[2], 0, 0, topicType);

		 } else if (actStr[0] == "circle" || actStr[0] == "subject") {
	 			openTopicCircle(actStr[1], '');
		 }  if (actStr[0] == 'webview') {
		 		var title = "返回气泡";
		 		var url = "";
		 		if (actStr.length == 2)
		 			url = actStr[1];
		 		else if (actStr.length == 3)
		 			url = actStr[2];	
		 		if (url.indexOf('http://') < 0)
		 			url = "http://"+url;
		 		closeMainSlide();	
	 			api.openWin({
					name: 'webview',
					url:  'webview.html',
					pageParam:{title:title, url:url},
				    reload: false,
					opaque:true,
					cScrollBarEnabled:false,
					softInputMode:'resize'
				});		
		 		/*	
		 		api.openApp({
                            androidPkg : 'android.intent.action.VIEW',
                            mimeType : 'text/html',
                            uri : url
                        }, function(ret, err) {
                            var msg = JSON.stringify(ret);
                          });
                 */         
  	 	}
	 }
	return true;
}
//回复文章
function replyTopic(fid,tid,e){
    if(e){
        e.cancelBubble =true;    
    }
    api.openWin({
            name:'reply',
            url:'reply.html',
            pageParam:{
                fid:fid,
                tid:tid
            }
        });
}
// 点赞文章
function recommendTopic(tid,dom,e){
    if(e){e.cancelBubble = true;}
    playHeart();
    var info = {
			tid: tid,
			dom: dom
			};	   
	api_ajax(2, 
		'topic_recommend_add.php', 
		{
			tid: tid	
		}, 
		after_recommendTopic,
		info,
		0
		); 	

}

function after_recommendTopic(ret, _, _, info) {
  //console.log(ret);
    if (ret.code == 100) {
        //alert('success');
        var uid = $api.getStorage('uid');
        $api.setStorage(info.tid+''+uid,1);
        var $topic_dianzan_count = $(info.dom).siblings('.count');
        var currentCount = parseInt($topic_dianzan_count.text()); 
        currentCount++;
        if(currentCount>99){
           currentCount = 99+'+';
        }
        //console.log(currentCount);
        $topic_dianzan_count.text(currentCount).css('color','#ff6263');
        // if($('.topic-dianzan-ico').hasClass('fa-heart-o')){
        //     $('.topic-dianzan-ico').removeClass('fa-heart-o').addClass('fa-heart').css({'color':'#ff6263'});    
        // }
        $(info.dom).css({'background-image':'url(../image/dianzan_selected_ico.png)'});
      }  
}


/*
描述：添加话题列表
参数:
    topics:      话题贴列表
    holderclass: 要添加到的class节点（可选，默认为：'.topic-list'）
*/
function listTopics(topics, holderclass){
    var uid = $api.getStorage('uid');
    var topicHtml = '';
     for(var index in topics){

        var topic = topics[index];


        topic.tid = topic.tid || topic.id;
        topic.ui = topic.ui || topic.authorimage;
        topic.un = topic.un || topic.nickname;
        topic.date = topic.date || topic.createdate;
        topic.content = topic.content.replace(/\[.+\]|\[|\]/ig,'');
        //topic.content = topic.content.substring(0,80);
        var sexHtml = '<i class="gender-ico gender-male-ico fa fa-mars"></i>';
        switch(topic.sex){
            case '0':
            sexHtml = '';;
            break;
            case '1':
            sexHtml = '<i class="gender-ico gender-male-ico fa fa-mars"></i>';
            break;
            case '2':
            sexHtml = '<i class="gender-ico gender-female-ico fa fa-venus"></i>';
            break;
            default:
            break;
        }
        //图片数量
        var picCountHtml = '';
        if(topic.pic_num>1){
            picCountHtml = '<span class="topic-pic-num"><div class="pic-num-wrap"><span style="font-size:0.5rem;vertical-align:top;">'+topic.pic_num+'</span><span style="font-size:0.4rem;vertical-align:top;margin-right:0.21rem;">张</span></div></span>';
        }
        
        var imgHtml = '';
        if(topic.images != ''){
            imgHtml = '<img class="topic-img" src="'+topic.images+'" alt="" >'
        }
        //topic.recommend = topic.recommend>99?'99+':topic.recommend;
        var dianzanHtml = '<i class="fa fa-heart-o" onclick="recommendTopic('+topic.tid+',this,event);"></i><div class="count">'+topic.recommend+'</div>';
        //console.log(uid);

        if($api.getStorage(topic.tid+''+uid) == 1){
            dianzanHtml = '<i class="fa fa-heart-o" style="background-image:url(../image/dianzan_selected_ico.png);" onclick="recommendTopic('+topic.tid+',this,event);"></i><div class="count" style="color:rgb(255, 98, 99);">'+topic.recommend+'</div>';
        }

        //来自哪个话题圈
        var fromWhereHtml = '';
        if(topic.fname){
            fromWhereHtml = '<span class="from-where" onclick="openTopicCircle('+topic.fid+',\''+topic.fname+'\',event);">#'+topic.fname+'</span>';
        }

        
        //topic.commentcount = topic.commentcount>99?'99+':topic.commentcount;

        var html = '<div class="topic-item topic-item-'+topic.tid+'" onclick="openTopicDetail(\''+topic.tid+'\','+topic.fid+',0,\'topic\')">'+

                        '<div class="topic-item-header">'+
                            '<img class="user-avator default-avator" src="'+topic.ui+'" alt="" onclick="openUserSpace('+topic.authorid+',event);">'+
                            '<span class="user-name" onclick="openUserSpace('+topic.authorid+',event);">'+topic.un+'</span>'+
                                sexHtml+
                            fromWhereHtml+
                        '</div>'+
                        // '<p class="topic-item-title">'+topic.content+'</p>'+
                        '<div class="topic-item-body">'+
                            picCountHtml+
                            imgHtml+
                        '</div>'+
                        '<div class="topic-item-footer">'+
                            '<p class="topic-item-title">'+topic.content+'</p>'+
                            '<div class="footer-info">'+
                                '<span class="create-time">'+topic.date+'</span>'+
                                '<div class="topic-footer-ico comment-ico">'+
                                    '<i class="fa fa-commenting-o"></i>'+
                                    //'<i class="fa fa-commenting-o" onclick="replyTopic('+topic.fid+','+topic.tid+',event);"></i>'+
                                    '<div class="count">'+topic.commentcount+'</div>'+
                                '</div>'+  
                                '<div class="topic-footer-ico dianzan-ico">'+dianzanHtml
                                    +
                                '</div>'+  
                            '</div>'+
                        '</div>'+
                    '</div>';
        topicHtml += html;
    }
    if(holderclass){
        $(holderclass).append($(topicHtml));    
    }else{
        $('.topic-list').append($(topicHtml));    
    }
}

//添加文章
function listArticle(topics,holderclass){
    var uid = $api.getStorage('uid');
    var topicHtml = '';
    
    for(var index in topics){         
        /*
          
        var topic = topics[index]; 
        topic.ui = topic.ui || topic.userimage;
        topic.un = topic.un || topic.nickname;
        topic.tid = topic.tid || topic.id;
        topic.images = topic.images || topic.ad_image;
        topic.viewcount = topic.viewcount || topic.views;
        topic.recommend = topic.recommend || topic.recommend_add;
        // if(topic.recommend>99){
        //     topic.recommend = '99+';
        // }
        var dianHtml = '<i class="dianzan-ico fa fa-heart" data-tid="'+topic.tid+'"></i><span class="count">'+topic.recommend+'</span>';
        
        var tagIcoHtml = '';
        if(topic.icon){
            tagIcoHtml = '<img class="topic-tag" src="'+topic.icon+'" style="position:absolute;left:0;top:20px;">';
        }
        // if($api.getStorage(topic.tid+''+ uid) == 1){
        //     dianHtml = '<i class="dianzan-ico fa fa-heart" onclick="clickZan(this);" data-tid="'+topic.tid+'" style="color:#ff6263;"></i><span class="count" style="color:#ff6263;">'+topic.recommend+'</span>';    
        // }
        //var dianHtml = '';
        var html = '<div class="item topic-item" data-added="0">'+
                        '<img class="article-bg" src="'+topic.images+'" style="width:100%;" onclick="openTopicDetail(\''+topic.tid+'\',\''+topic.fid+'\');">'+
                           
                        tagIcoHtml+          
                           
                        '<div class="topic-footer">'+
                            '<div class="topic-title">'+topic.title+'</div>'+
                            '<div class="author-avator" onclick="openUserSpace('+topic.authorid+',event);">'+
                                '<img class="default-avator" src="'+topic.ui+'"/>   '+
                            '</div>'+
                            '<div class="author-nickname" onclick="openUserSpace('+topic.authorid+',event);">'+topic.un+'</div>'+

                            '<span class="like-ico like-selected">' +
                                '<i class="view-ico fa fa-eye"></i><span class="count view-count">'+topic.viewcount+'</span>'+
                                dianHtml+
                            '</span>'+
                        '</div>'+
                    '</div>';
                    */
        topicHtml += getArticleItem(topics[index]);
    }
    if(holderclass){
        $(holderclass).append($(topicHtml));
    } else {
    	$('#topic-content').append($(topicHtml));
    }
    
    //isTopicLoaded = true;
}

function getArticleItem(topic) {
        topic.ui = topic.ui || topic.userimage;
        topic.un = topic.un || topic.nickname;
        topic.tid = topic.tid || topic.id;
        topic.images = topic.images || topic.ad_image;
        topic.viewcount = topic.viewcount || topic.views;
        topic.recommend = topic.recommend || topic.recommend_add;
        // if(topic.recommend>99){
        //     topic.recommend = '99+';
        // }
        var dianHtml = '<i class="dianzan-ico fa fa-heart" data-tid="'+topic.tid+'"></i><span class="count">'+topic.recommend+'</span>';
        
        var tagIcoHtml = '';
        if(topic.icon){
            tagIcoHtml = '<img class="topic-tag" src="'+topic.icon+'" style="position:absolute;left:0;top:20px;">';
        }
        // if($api.getStorage(topic.tid+''+ uid) == 1){
        //     dianHtml = '<i class="dianzan-ico fa fa-heart" onclick="clickZan(this);" data-tid="'+topic.tid+'" style="color:#ff6263;"></i><span class="count" style="color:#ff6263;">'+topic.recommend+'</span>';    
        // }
        //var dianHtml = '';
        var html = '<div class="item topic-item" data-added="0">'+
                        '<img class="article-bg" src="'+topic.images+'" style="width:100%;" onclick="openTopicDetail(\''+topic.tid+'\',\''+topic.fid+'\');" onload="imgLoad(this);">'+
                           
                        tagIcoHtml+          
                           
                        '<div class="topic-footer">'+
                            '<div class="topic-title">'+topic.title+'</div>'+
                            '<div class="author-avator" onclick="openUserSpace('+topic.authorid+',event);">'+
                                '<img class="default-avator" src="'+topic.ui+'"/>   '+
                            '</div>'+
                            '<div class="author-nickname" onclick="openUserSpace('+topic.authorid+',event);">'+topic.un+'</div>'+

                            '<span class="like-ico like-selected">' +
                                '<i class="view-ico fa fa-eye"></i><span class="count view-count">'+topic.viewcount+'</span>'+
                                dianHtml+
                            '</span>'+
                        '</div>'+
                    '</div>';
         return html;
}
function imgLoad(self){
    console.log('load');
    var $this = $(self);
    $this.parent().css({'height':$this.height()+'px'});
}
//文章点赞
function clickZan(dom,e) {
    if(e){e.cancelBubble = true;}
    // 播放点赞动画
    playHeart();
    $dianzan_dom = $(dom);
    var tid = $dianzan_dom.data('tid');
    // var tid = api.pageParam.id;
    
    var info = {
			tid: tid,
			dom: dom
			};
	api_ajax(2, 
		'topic_recommend_add.php', 
		{
	        tid:tid		
		}, 
		after_clickZan,
		info,
		0
		); 		
    return false;
}

function after_clickZan(ret, _, _, info) {
    $dianzan_dom = $(info.dom);
    var tid = $dianzan_dom.data('tid');
    var uid = $api.getStorage('uid');
    console.log(ret);
    if (ret['code'] == 100) {
        //alert('success');
         $api.setStorage(tid+''+uid,1);
         var $topic_dianzan_count = $dianzan_dom.next(); 
         var currentCount = parseInt($topic_dianzan_count.text()); 
         currentCount++;
         // if(currentCount>99){
         //    currentCount = 99+'+';
         // }
         console.log(currentCount);
        $topic_dianzan_count.text(currentCount);
        
        $dianzan_dom.css({'color':'#ff6263'});    
        $topic_dianzan_count.css({'color':'#ff6263'});  
    }      
}

//调整html的字体大小
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
    };
 
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


