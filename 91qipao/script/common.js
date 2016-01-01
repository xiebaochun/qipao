var API_URL =  'http://qipaobbs.91qipao.com/api/app_s_210/';


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
// $api.rmStorage('uid');
function setDevEv(){
    // var tid = 6266;
    console.log('dev...');
    //alert('dev...');
    $api.setStorage('uid','3078');//3078
    $api.setStorage('current_topic_tid','13149');
    window.api = {}; 
    api.pageParam = {};
    api.pageParam.id = 38686;//6636;//10308;//7855;
    api.pageParam.tid = 38686;//6636;//10308;//7855;
    api.pageParam.sid = 4305;//4325;
    api.pageParam.userid = 3078;
    api.pageParam.fid = 98;
    api.pageParam.topicType = 'article';
    api.appVersion = '0.0.0';
    api.systemType = 'android';
    api.alert = function(data){
        console.log(data);
    }
    api.require = function(){}
    api.execScript = function(){

    }
    api.showProgress = function(){
    
    }
    api.hideProgress = function(){
    }
    api.parseTapmode = function(){
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
var isNetConnected = true;
function api_ajax(checklogin, app_file, values, _callback, others, progress) {
        /*
            checklogin: 是否判断已登录(0:不检查；1：检查[未登录即返回false]；2：强制去登陆)
            app_file:       服务器端的文件名(例如：util_login.php)
            values:         数据数组
            _callback:      回调函数        
            others:         其他参数
            progress:       0:不需要；1：'加载中...',2:'上传中...',3:'正在登录...'
        */      
     var uid = $api.getStorage('uid');  
     if (checklogin > 0) {  
        if(!uid || typeof(uid) == "undefined") {
            if (checklogin == 1 )
                return false;
            else if (checklogin == 2) {
                openLogin();
                return true;    
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
//console.warn("200__"+ api.frameName + "/" + api.winName);     
     values['uid'] = uid;
	 var active_id = $api.getStorage('active_id');
	 if(active_id){
	    	values['active_id'] = active_id;
	 }
	 var online_id = $api.getStorage('online_id');
	 if(online_id){
	    	values['online_id'] = online_id;
	 }	       
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
            	if (ret.code == 999) {
            		var from_parms = {
            			from: 1,
            			checklogin: chechlogin, 
            			app_file: app_file, 
            			values: values,
            			callback: _callback, 
            			others: others, 
            			progress:progress            			
            		};
            		ajaxRuning = false;
            		login_to_server(from_parms);
            		return;
            	}
                ajax_waring = "";
                isNetConnected = true;
                //缓存 “推荐和发现”的第一页
                if ((app_file == 'index_api.php' && values.page == 1)
                	|| 	(app_file == 'topic_list.php' && values.page == 1 && values.fid == 0)
                	){
                		$api.setStorage(app_file + '_' + values.page, ret);
                }                
                if (ret.code == 100 && ret.m_change) {
                		//有泡币变化，则刷新“我的”
					    api.execScript({
					        name: 'root',
					        frameName: 'my',
					        script:  'view_appear();'
					    });
                }
            } else {
                if (ajax_waring == "") {
                     myToast("网络连接不畅,请稍后重试。");
                }
                //获取缓存 “推荐和发现”的第一页
                if ((app_file == 'index_api.php' && values.page == 1)
                	|| 	(app_file == 'topic_list.php' && values.page == 1 && values.fid == 0)
                	){
                		ret = $api.getStorage(app_file + '_' + values.page);
                }                

                if (!ret) {
	                ret = new Object();
	                ret.code = 988;
	                isNetConnected = false;                
              	}
                /*
                api.alert({msg:('错误码：'+err.code+'; 错误信息：'+err.msg+'; 网络状态码：'+err.statusCode+";"+app_file)
                });
                */
            } 
            try {
                if (_callback) {
                    _callback(ret, app_file, values, others);
                } 
            } catch(e) {}
            ajaxRuning = false;
         }
      );

      return true;
}
function openLogin(){
    api.openWin({
        name: 'userLogin',
        url: './util-login.html',
        opaque: true,
        vScrollBarEnabled:false
    }); 
}
//启动时，自动登录；或检测到服务器999时，重新连接。
function login_to_server(from_parms) {
	 var uid = $api.getStorage('uid');
	 if(!uid || typeof(uid) == "undefined") {return;}	
	 var platform = $api.getStorage('platform');
	 var app_file = "";
	 var parms = null;
	 if (platform == 'qp_phone') {
	 	 app_file = 'util_login.php';
		 parms = {
        		phone:$api.getStorage('phone'),
        		authcode:$api.getStorage('authcode'),
        		isphone:$api.getStorage('isphone'),
        		platform: platform
        		}		 
	 } else {
		 app_file = 'util_SDKlogin.php'; 
		 parms = 
        		{
	              userid: $api.getStorage('platform_userid'),
	              username: $api.getStorage('platform_username'),
	              headimgurl: $api.getStorage('platform_headimgurl'),
	              platform: platform
	            }	 
	 }	

	api_ajax(0, 
			app_file, 
			parms,
			after_login_to_server,
			from_parms,
			0
		);	
}

function after_login_to_server(ret, _, parms, from_parms) {
	if (ret.code == 988) {
		return;
	}
	if (ret.code == 100) {
	    setStorage_after_login(ret, 1);

		if (from_parms.from == 1) {
			api_ajax(from_parms.checklogin, from_parms.app_file, from_parms.values, 
					from_parms._callback, others, from_parms.progress);
			return;
		}      	       
	} 
}

function setStorage_after_login(ret, from) {
	   if (ret.phone_login == 1) {
			    $api.setStorage('phone', ret.phone);
			    $api.setStorage('authcode', ret.authcode);
			    $api.setStorage('userimage',ret.userimage);
			    $api.setStorage('platform', 'qp_phone');			    
		} else {
				$api.setStorage('userimage', ret.headimg);
				$api.setStorage('platform', ret.platform);
				$api.setStorage('platform_userid', ret.id);
				$api.setStorage('platform_username', ret.username);
				$api.setStorage('platform_headimgurl', ret.headimg);
		}	
		
		$api.setStorage('isphone', ret.phone_login);
		$api.setStorage('uid', ret.uid);	
		$api.setStorage('token', ret.token);
			    
		$api.setStorage('username', ret.username);
		$api.setStorage('uniqueid',ret.uniqueid);    	
		$api.setStorage('sex', ret.sex);
		$api.setStorage('mobile', ret.mobile);	
		$api.setStorage('is_ours', ret.is_ours);	
		
        $api.setStorage('b_phone', ret.b_phone);              
        $api.setStorage('b_qq', ret.b_qq);              
        $api.setStorage('b_wx', ret.b_wx);              
        $api.setStorage('b_wb', ret.b_wb); 	
		if (from == 1)
		{
			var today_signed = ret.today_signed;
			if (typeof(today_signed) == "undefined" ) today_signed = 1;
			today_signed = parseInt(today_signed);
			if (!today_signed)
			{
				$api.setStorage('action_task_id', 210);
				api.execScript({
					name: 'root',
					script: "start_task(210);"
					});
			}
		}
}

function getCommentContent(content){
    var html = '';
    var length = content.replace(/<img .*?>/g, '').length;
    if(length > 60){
         html = content.substring(0, (COMMENT_MAX_LENGTH)) + '<span class="comment-content-more" data-content="'+content.substring(COMMENT_MAX_LENGTH)+'" onclick="openMoreCommentContent(this,event);">全文</span>';
    }else{
        html = content;
    }
    return html;
}
function openMoreCommentContent(self,e){
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
    var $this = $(self);
    
    var thisContent = $this.data('content');
    var $parent = $this.parent();
    $this.remove();

    var originHtml = $parent.html();
    $parent.html(originHtml + thisContent);
}

function switchScroll(isScroll){
    if(isScroll){
        $('body').css({'overflow':'scroll'});
        api.setFrameAttr({
            // name: 'topic-circlecon',
            bounces: true,
            vScrollBarEnabled:true,
        });
    }else{
        $('body').css({'overflow':'hidden'}); 
        api.setFrameAttr({
            // name: 'topic-circlecon',
            bounces: false,
            vScrollBarEnabled:false,
        });   
    }    
}

function get_gouda_datainfo(from) {
    if (from == 0 && ajaxRuning) return;
    var uid = $api.getStorage('uid');
    if(!uid || typeof(uid) == "undefined") return;
//console.warn("100__"+ api.frameName + "/" + api.winName);
    api_ajax(0, 
            'gd_datainfo_get.php', 
            {},             
            after_gouda_datainfo,
            from,
            0
        );  
}

var gouda_lasttime = '';
var isAppInFront = true;
var lastDate = (new Date()).getDate();
function after_gouda_datainfo(ret, _,  _, from){
	if (ret.code == 988)
	{
		 canMore = 1;
		return;
	}
    if (ret.code == 100)
       {  
           data = ret.data;
           if (from == 1) {
            set_div('n_count', data.n);
            set_div('l_count', data.r);
            set_div('r_count', data.c);
            set_div('p_count', data.p);
           }
           var  gouda_data  = '_' + data.n;
                gouda_data += '_' + data.r;
                gouda_data += '_' + data.c;
                gouda_data += '_' + data.p;  
            
            var jsfun = '';     
            if (gouda_data != "____") {      
                var is_ours = $api.getStorage('is_ours');
                if (is_ours) {
                    if (from == 0 && !isAppInFront && (data.p > 0 || data.n > 0)) {  
                            var new_gouda_lasttime = data.n_t +"/"+data.p_t;
                            var storage_gouda_lasttime = $api.getStorage('gouda_lasttime');
                            if (gouda_lasttime != new_gouda_lasttime
                                && storage_gouda_lasttime != new_gouda_lasttime) { 
                                $api.setStorage('gouda_lasttime', new_gouda_lasttime);
                                gouda_lasttime = new_gouda_lasttime;            
                                api.notification({
                                    sound:'default',
                                    notify: {
                                        title:'气泡提示',            //标题，默认值为应用名称，只Android有效
                                        content: '您有新消息了哦',
                                        extra: gouda_lasttime,   //传递给通知的数据，在通知被点击后，该数据将通过监听函数回调给网页
                                        updateCurrent: false     //是否覆盖更新已有的通知，取值范围true|false。只Android有效
                                    }
                                }, function(ret, err){
                                    if(ret && ret.id){
                                        //api.cancelNotification({id: ret.id});
                                    }
                                }); 
                            }                   
                    };
                }
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
	
	var now = new Date();
	var curDate = now.getDate();
	if (curDate != lastDate)
	{
		lastDate = curDate;
	    var from_parms = {
			from: 0          			
		};
		login_to_server(from_parms);
	}

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
    event.cancelBubble = true;
}

function openFramecon(fname,pageParam){
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
    headerPos =  headerPos = $api.offset(header);
    var height = api.winHeight - headerPos.h;
    width = $api.winWidth;

    var pageParam = pageParam;
    
    api.openFrame({
          name: fname,
          url: fname+'.html',
          reload: false,
          bounces : false,
          //opaque: true,
          vScrollBarEnabled : false,
          pageParam : pageParam,
          rect : {
              x : 0,
              y : headerPos.h,
              w : width,
              h : height
          }
      });  
}

function stopEvent(e){
    if(e){e.cancelBubble = true;}
}
//user
function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function edit(el) {
    return;
    var del = $api.next(el, '.del');
    if (el.value) {
        $api.addCls(del, 'show');
    }
    $api.addCls(el, 'light');
}

function cancel(el) {
    return;
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

function openInputField(callback){
    // input.open({
    //     bgColor:'#eee',
    //     lineColor:'#ddd',
    //     fileBgColor:'#fff',
    //     borderColor:'#ddd',
    //     sendImg:'widget://image/sendImg.png'
    // },function(ret,err) {
    //     //api.alert({title: '输入的内容', msg: ret.msg});
    //     postReply(ret.msg);
    // });
    // 初始化聊天组件
    var uiChatBox = api.require('UIChatBox');
    uiChatBox.open({
        placeholder : '',
        maxRows : 4,
        emotionPath : 'widget://image/chatBox/emotion',
        texts : {
            recordBtn : {
                normalTitle : '按住 说话',
                activeTitle : '松开 结束'
            }
        },
        styles : {
            inputBar : {
                borderColor : '#d9d9d9',
                bgColor : '#f2f2f2'
            },
            inputBox : {
                borderColor : '#B3B3B3',
                bgColor : '#FFFFFF'
            },
            emotionBtn : {
                normalImg : 'widget://image/chatBox/chatBox_face1.png'
            },
            keyboardBtn : {
                normalImg : 'widget://image/chatBox/chatBox_key1.png'
            },
            recordBtn : {
                normalBg : '#c4c4c4',
                activeBg : '#999999',
                color : '#000',
                size : 14
            },
            indicator : {
                target : 'both',
                color : '#c4c4c4',
                activeColor : '#9e9e9e'
            }
        },
        extras : {
            titleSize : 10,
            titleColor : '#a3a3a3',
            btns : [{
                title : '图片',
                normalImg : 'widget://image/chatBox/chatBox_album1.png',
                activeImg : 'widget://image/chatBox/chatBox_album2.png'
            }, {
                title : '拍照',
                normalImg : 'widget://image/chatBox/chatBox_cam1.png',
                activeImg : 'widget://image/chatBox/chatBox_cam2.png'
            }]
        }
    }, callback);
    
    // 监听输入框弹动事件
    uiChatBox.addEventListener({
        target : 'inputBar',
        name : 'move'
    }, function(ret, err) {
        //alert(ret.inputBarHeight+'move'+ret.panelHeight+FRAME_NAME);
        setChatInit(FRAME_NAME, ret.panelHeight + ret.inputBarHeight + (_isIOS() ? 0 : 10));
    });
    // 监听输入框改变事件
    uiChatBox.addEventListener({
        target : 'inputBar',
        name : 'change'
    }, function(ret, err) {
        //alert('change');

        setChatInit(FRAME_NAME, ret.panelHeight + ret.inputBarHeight + (_isIOS() ? 0 : 10));
    });
}
// 重新调整frame会话区域
function setChatInit(frameName, inputAreaHeight) {
    //var headerOffset = $api.offset($api.byId('aui-header'));
    var Y = _isIOS() ? 65 : 50;
    api.setFrameAttr({
        name : frameName,
        rect : {
            x : 0,
            y : Y,
            w : api.winWidth,
            h : api.winHeight - 50 - inputAreaHeight
        }
    });
    setTimeout(function() {
        // 通知会话页面滚动到底部
        // api.sendEvent({
        //     name : 'scrollButton',
        //     extra : {}
        // });
        _scrollToEnd();
    }, 300);
}
//文字表情转换
function transEmo(emoMsg){
    var emoPath, transMsg;
    var reg = /\[(.*?)\]/gm;
    transMsg = emoMsg.replace(reg, function(match) {
            for (var i = 0, len = emoData.length; i < len; i++) {
                    if (emoData[i].text === match) {
                            emoPath = '../image/chatBox/emotion/' + emoData[i].name + '.png';
                            return '<img width="20" height="20" style="vertical-align:middle;" src="' + emoPath + '" />'
                    }
            }
            return match;
    });
    return transMsg;
}
// 滚动到底部
function _scrollToEnd() {
    document.getElementsByTagName('body')[0].scrollTop = document.getElementsByTagName('body')[0].scrollHeight;
}
// 判断是否是IOS
function _isIOS() {
    return api.systemType == "ios" ? true : false;
}
//play heart
function playHeart(id){
    
    var heartHtml = '<div class="heart-wrap" id="'+id+'" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;"><div class="heart" style="position:absolute;top:50%;left:50%;margin-top:-45px;margin-left:-50px;"></div></div>';

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

function gotoIndexTab(type, tid, other) {
    var jsfun = "openTab('"+type+"', '"+tid+"',"+other+")";
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
	api.execScript({
        name: 'root',
        frameName: 'topic-con1',
        script:  'init();'
    });

    api.execScript({
        name: 'root',
        frameName: 'my',
        script:  'view_appear();'
    });  
		    
    var login_after = $api.getStorage('login_after');
//api.alert({msg:login_after});
    $api.rmStorage('login_after');
    if (login_after) {
        if (login_after.from == "root" ) {
            //api.closeToWin({name: 'root'});
            api.execScript({
                name: 'root',
                script: login_after.action
                });          
        } else if (login_after.from == "" ) {
            api.openWin({
                name: login_after.winName,
                url: 'html/'+login_after.action,
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
    return;
}

function closeMainSlide() {
    var jsfun = 'slideSwitch(0);';
    api.execScript({
         name: 'root',
         frameName:'mainCon',
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
function openTopicDetail(tid, fid, timeout, imgUrl) {
    closeMainSlide();
    var _imgUrl = 'http://www.91qipao.com/img/logo/logo.png';
    ///_imgUrl = 'https://www.baidu.com/cache/aladdin/ui/honourCard3/img/honourCard3.png';
    if(imgUrl){
        _imgUrl = imgUrl;
    }
    var _timeout = 500;
    if (api.systemType == 'ios')
    {
        _timeout = 50;
    }            
    
    if (typeof(timeout) == "undefined") timeout = 0;
        
// api.alert({msg:tid+"/"+fid+"/"+timeout});        
    var id = tid.replace("index#","");
    setTimeout(function(){
                api.openWin({        
                name:  'topicDetail-'+id,
                url:   'topicDetail.html',
                pageParam: {id:id, fid:fid, imgUrl:_imgUrl},
                reload: false,
                opaque: true,
                delay: 5,
                vScrollBarEnabled: false,
                softInputMode: 'resize'
                });
        }, timeout);          
}

//打开问答详情
function openQaDetail(tid,fid){
    api.openWin({        
        name:  'qa-detail',
        url:   'qa-detail.html',
        pageParam: {tid:tid, fid:fid},
        reload: false,
        opaque: true,
        delay: 5,
        vScrollBarEnabled: false,
        softInputMode: 'resize'
    });
}

//打开话题圈列表
function openTopicCircle(fid, fname, e, timeout) {
    var _timeout = 500;
    if (api.systemType == 'ios')
    {
        _timeout = 50;
    } 
    var action = "openTopicCircle('"+fid+"','"+fname+"', '"+0+"',"+_timeout+")";
    if (!checkLogin(action, 'topic')) 
        return;
    if (typeof(timeout) == "undefined") timeout = 0; 
    
    if(e){e.cancelBubble = true;}
    setTimeout(function(){
        api.openWin({
            name:'topic-circle',
            url:'topic-circle.html',
            slidBackEnabled:false,
            pageParam:{
                fid:fid,
                fname:fname
            }
        });

    }, timeout);        
    return false;
}
function openUserSpace_pop(userid){
    api.openWin({        
        name:   'user-zone_'+userid,
        url:    '../user-zone.html',
        pageParam: {sid:userid},
        reload: false,
        bounces:true,
        opaque: true,
        vScrollBarEnabled: false,
        softInputMode: 'resize'
    }); 
}
//打开个人空间
//参数：userid(用户id) e(可选，事件)
function openUserSpace(userid,e,timeout) {
    closeMainSlide();
    //var action = "openUserSpace('"+userid+"', '"+0+"',"+timeout+")";
	//if (!checkLogin(action, 'my_shell'))     
    //    return;
    if (typeof(timeout) == "undefined") timeout = 0;
    
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
    }, timeout);    
    
    return true;
}

function openShare(tid,title,desc,imgurl){
    $api.setStorage('current_title',title);
    $api.setStorage('current_url','http://share.91qipao.com/index.php?tid='+tid);
    $api.setStorage('current_desc',desc);
    $api.setStorage('current_img_url',imgurl);

    popShareBox();
}

function popShareBox() {
    //$api.addCls(shareBox,'on');
    api.openFrame({
        name: 'share',
        url: 'component/share-pop-frame.html',
        bounces: false,
        opaque: true,
        vScrollBarEnabled: false,
        pageParam: {},
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight
        }
    });
}

//关注红人或者用户
function article_followUser(sid,self){
    favoriteUser(sid,'add',function(){
        myToast('关注用户成功!');
        var $parent = $(self).parent();
        $parent.html('<span class="color-999 f5" onclick="openUserSpace('+sid+');">进入TA</span>'); 
    });
}

//关注/取消关注某人
function favoriteUser(sid, act, callbacnk) {
    var _callback =  after_favoriteUser;
    if(callbacnk){
        _callback = callbacnk;
    }
    //act:  add/cancel
    var info = {
            sid: sid,
            act: act
            };
    api_ajax(2, 
        'my_favorite_user_set.php', 
        info, 
        _callback,
        info,
        0
        );      

    return true;
}

function after_favoriteUser(ret, _, _, info) {
	if (ret.code == 988)
	{
		return;
	}
    if (ret.code == 100) {
        $api.setStorage('set_my_change', 1);
        try{ 
            afterFavoriteUser(info.sid, info.act);
        }catch(e){
        }       
    }
}

//加入/取消黑名单
function blacklistUser(sid, act) {
    //act:  add/cancel
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
	if (ret.code == 988)
	{
		return;
	}
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
    //act:  add/cancel
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
	if (ret.code == 988)
	{
		return;
	}
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
    //act:  add/cancel
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
	if (ret.code == 988)
	{
		return;
	}
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
        return false;
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
      if(!myreg.test(phone)){ 
          myToast('请填写正确的手机号码');
          return false;
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
	if (ret.code == 988)
	{
		return;
	}
    if (ret.code == 100) {
        myToast("验证码发送成功，请在30分钟内使用。", 2000);
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

//与人聊私信
function openPM_pop(sid, username) {
    //alert("PM:"+sid +"/"+username);
    if(!$api.getStorage('uid')){
        openLogin();
        return false;
    }
    api.openWin({
        name: 'gouda-pm-chat',
        url:  '../gouda-pm-chat.html',
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
                    1、首页轮播广告：   index#2345
                2、活动：       activity#123    【暂未用】
                    3、外链：       webview#2#url   【暂未用】       （#2#中的2表示话题圈fid）
                    4、话题：       topic#3456
                    5、话题圈：      circle#3456
                    6、专题：       subject#123 【暂未用】 
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
                    openTopicDetail(actStr[1], 0, 0);
                else if (actStr.length == 3)
                    openTopicDetail(actStr[2], 0, 0);

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

//打开
function openGuide(url){
    return false;
    if(typeof $api.getStorage(url) == 'undefined'||!$api.getStorage(url)){
        $api.setStorage(url,'true');
        var url = url;
        api.openFrame({
            name:'guide',
            url:'component/guide-pop-frame.html',
            bounces:false,
            bgColor:'rgba(255,255,255,0.4)',
            pageParam:{imgUrl:url+'.png'},
            scaleEnabled:false,
            vScrollBarEnabled:false,
            // animation:{type:'none',subType:'from-bottom',duration:0}
        });
    } 
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
	if (ret.code == 988)
	{
		return;
	}
  //console.log(ret);
    if (ret.code == 100) {
        //alert('success');
        var uid = $api.getStorage('uid');
        $api.setStorage(info.tid+''+uid,1);
        var $topic_dianzan_count = $(info.dom).siblings('.count');
        var currentCount = parseInt($topic_dianzan_count.text()); 
        currentCount++;
        // if(currentCount>99){
        //    currentCount = 99+'+';
        // }
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
        
        if($('#topic-tid-'+topic.tid).length>0) continue;
        
        topic.ui = topic.ui || topic.authorimage;
        topic.un = topic.un || topic.nickname;
        topic.date = topic.date || topic.createdate;
        topic.content = topic.content.replace(/\[.+\]|\[|\]/ig,'');
        topic.sex = topic.sex || topic.us;
        //topic.content = topic.content.substring(0,80);
        var sexHtml = '';
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

        var html = '<div class="topic-item topic-item-'+topic.tid+'" id="topic-tid-'+topic.tid+'" onclick="openTopicDetail(\''+topic.tid+'\','+topic.fid+', 0, \'' + topic.images + '\')">'+

                        '<div class="topic-item-header">'+
                        '<div class="user-avator"  alt="" onclick="openUserSpace('+topic.authorid+',event);" style="background-image:url(../image/avator_bg.jpg);background-size:100% 100%;"><img src="'+topic.ui+'" alt="" onload="avatorOnload(this);" style="display:none;"/></div>'+
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
    console.log('into list article');
    var uid = $api.getStorage('uid');
    var topicHtml = '';
    for(var index in topics){      
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
        if(topic.recommend>99){
            topic.recommend = '99+';

        }

        var isFollowUserHtml = '<span class="v2-article-follow-bt" onclick="article_followUser('+topic.authorid+',this);">+关注</span>';
        if(topic.me_fav_ta){
            isFollowUserHtml = '<span class="color-999 f4">'+topic.createdate+'</span>';//'<i class="iconfont icon-arrow-right" onclick="openUserSpace('+topic.authorid+');"></i>';

        }

        // if($('#topic-item-'+topic.tid).length>0) return '';

        // var dianHtml = '<i class="dianzan-ico fa fa-heart" data-tid="'+topic.tid+'"></i><span class="count">'+topic.recommend+'</span>';
        
        // var tagIcoHtml = '';
        // if(topic.icon){
        //     tagIcoHtml = '<img class="topic-tag" src="'+topic.icon+'" style="position:absolute;left:0;top:20px;">';
        // }
        // if($api.getStorage(topic.tid+''+ uid) == 1){
        //     dianHtml = '<i class="dianzan-ico fa fa-heart" onclick="clickZan(this);" data-tid="'+topic.tid+'" style="color:#ff6263;"></i><span class="count" style="color:#ff6263;">'+topic.recommend+'</span>';    
        // }
        //var dianHtml = '';
        // var html = '<div class="item topic-item" id="topic-item-'+topic.tid+'" data-added="0" onclick="openTopicDetail(\''+topic.tid+'\',\''+topic.fid+'\', 0, \'' + topic.images + '\');" >'+
        //                 '<img class="article-bg" src="' + topic.images + '" style="width:100%;">' +  
        //                 tagIcoHtml +          
        //                 '<div class="topic-footer">' +
        //                     '<div class="topic-title">' + topic.title + '</div>' +
        //                     '<div class="author-avator default-avator" onclick="openUserSpace('+topic.authorid+',event);" style="background-image:url(../image/avator_bg.jpg);background-size:100% 100%;"><img src="'+topic.ui+'" onload="avatorOnload(this);" style="display:none;"/>'+
                                
        //                     '</div>'+
        //                     '<div class="author-nickname" onclick="openUserSpace('+topic.authorid+',event);">'+topic.un+'</div>'+

        //                     '<span class="like-ico like-selected">' +
        //                         '<i class="view-ico fa fa-eye"></i><span class="count view-count">'+topic.viewcount+'</span>'+
        //                         dianHtml+
        //                     '</span>'+
        //                 '</div>'+
        //             '</div>';






        var imageHtml = '';
        if(topic.images.length ==1){
            imageHtml = '<div class="v2-article-img-box" style="background-image:url('+topic.images+');width:10rem;height:6.666rem;border:none;"></div>';
        }else if(topic.images.length == 0){
            imageHtml = '';
        }else{
            for(var index in topic.images){
                var html = '<div class="v2-article-img-box" style="background-image:url('+topic.images[index]+');"></div>';//'<div class="v2-article-img-box"><img class="v2-article-img" src="'+topic.images[index]+'" alt=""></div>';
                imageHtml+=html;
            }
        }
        
        var likeHtml = '<i class="iconfont icon-xin" data-tid="'+topic.tid+'" onclick="clickZan(this,event);"></i> <span>'+topic.recommend+'</span>';
        if(topic.me_like_topic){
            likeHtml = '<i class="iconfont icon-xin-fill color-red" data-tid="'+topic.tid+'" onclick="clickZan(this,event);"></i> <span class="color-red">'+topic.recommend+'</span>';
        }
        

        var html = '<div class="v2-article-item">'+
                    '<div class="v2-article-header">'+
                        '<div class="v2-article-author-info-wrap" onclick="openUserSpace('+topic.authorid+',event);">'+
                            '<img class="item-avator v2-article-author-avator" src="'+topic.ui+'"/>'+
                            '<span class="item-name v2-article-author-name">'+topic.un+'</span>'+
                        '</div>'+
                        '<div class="v2-article-author-tag-wrap">'+
                            '<span class="v2-article-author-tag">'+topic.tag+'</span>'+
                        '</div>'+
                        '<div class="v2-article-right">'+
                            isFollowUserHtml +
                        '</div>'+
                    '</div>'+
                    '<div class="v2-article-body" onclick="openTopicDetail(\''+topic.tid+'\',\''+topic.fid+'\', 0, \'' + topic.images + '\');">'+
                        '<div class="v2-article-img-wrap">'+
                            imageHtml +
                        '</div>'+
                        '<div class="v2-article-title el-txt">' + topic.title + '</div>'+
                        '<div class="v2-article-summary">'
                             + topic.content + 
                        '</div>'+
                    '</div>'+
                    '<div class="v2-article-footer">'+
                    '<div class="v2-article-footer-item">'+ likeHtml +'</div>'+
                        '<span></span>'+
                        '<div class="v2-article-footer-item" onclick="openAllReplys('+topic.fid+','+topic.tid+');"><i class="iconfont icon-chat"></i> <span>'+topic.commentcount+'</span></div>'+
                        '<span></span>'+
                        '<div class="v2-article-footer-item" onclick="openShare('+topic.tid+',\''+topic.title+'\',\''+topic.content+'\',\''+topic.images+'\');"><i class="iconfont icon-item-share"></i> <span>分享</span></div>'+
                    '</div>'+
                '</div>';
        return html;
}

function listArticle_v2(topics,holderclass){
    var uid = $api.getStorage('uid');
    var topicHtml = '';
    
    for(var index in topics){      
        topicHtml = getArticle_Item_v2(topics[index]);
        if(topicCount%2==0){
            $('.nav-item-1').append(topicHtml);
        }else{
            $('.nav-item-2').append(topicHtml);
        }
    }

    // if(holderclass){
    //     $(holderclass).append($(topicHtml));
    // } else {
    //     $('#topic-content').append($(topicHtml));
    // }
    
}
var topicCount =0;
function getArticle_Item_v2(topic){
    topicCount ++;
    topic.ui = topic.ui || topic.userimage;
    topic.un = topic.un || topic.nickname;
    topic.tid = topic.tid || topic.id;
    topic.images = topic.images || topic.ad_image;
    if(!topic.images){topic.images = '';}
    topic.viewcount = topic.viewcount || topic.views;
    topic.recommend = topic.recommend || topic.recommend_add;

    var footer_right_html = '<span class="follow-bt f4" data-sid="'+topic.authorid+'" onclick="article_followUser('+topic.authorid+',this);">+关注</span>';
    if(topic.me_fav_ta){
        footer_right_html = '<i class="iconfont icon-xin" data-tid="'+topic.tid+'" onclick="clickZan(this,event);"></i> <span>'+topic.recommend+'</span>';
        if(topic.me_like_topic){
            footer_right_html = '<i class="iconfont icon-xin-fill color-red" data-tid="'+topic.tid+'" onclick="clickZan(this,event);"></i> <span class="color-red">'+topic.recommend+'</span>';
        }
    }
	var topic_img = '';
	if (topic.images[0])
		topic_img = topic.images[0];
	else {
		var num = parseInt(Math.random()*6,10)+1;
		topic_img = '../image/def_' + num + '.jpg';
	}
    var html = '<li class="new-item-wrap">'+
                    '<div class="new-item">'+
                        '<div class="new-bg-wrap" onclick="openTopicDetail(\''+topic.tid+'\');">'+
                            '<img class="new-img" src="'+topic_img+'">'+
                        //'<div class="new-bg" style="background-image:url('+topic.images[0]+');"></div>'   + 
                            '<span class="new-item-title">'+topic.content+'</span>'+
                        '</div>'+
                        

                        '<div class="new-item-footer">'+
                            '<div class="inline-block" onclick="openUserSpace('+topic.authorid+');">' +
                                '<img  class="item-avator" src="'+topic.ui+'" alt="">'+
                                '<div class="item-user-info vm">'+
                                    '<span class="item-name f5 el-txt" style="width:2.5rem;">'+topic.un+'</span><br>'+
                                    '<span class="create-time f4 color-999 ml3">'+topic.createdate+'</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="pull-right vm" style="line-height:1.5rem;">'+
                            footer_right_html+
                            '</div>'+
                        '</div>'+
                    '</div>'+
               ' </li>';

    return html;

}
function avatorOnload(self){
    $(self).parent().css({'background-image':'url('+$(self).attr('src')+')'});
}
// function imgLoad(self){
//     console.log('load');
//     var $this = $(self);
//     $this.parent().css({'height':$this.height()+'px'});
// }


// 列出动态列表
// function listActivity(activitys,holderclass){
//     var activityHtml = '';
//     for(var i = 0;i<50;i++){
//         var html = getActivityHtml();
//         activityHtml += html;
//     }
//     $(holderclass).append($(activityHtml));
// }

// function getActivityHtml(activity){
//     var html = '<div class="v2-article-item">'+
//                     '<div class="v2-article-header">'+
//                         '<div class="v2-article-author-info-wrap">'+
//                             '<img class="item-avator v2-article-author-avator" src="../image/version_logo.png"/>'+
//                             '<span class="item-name v2-article-author-name">作者名字</span>'+
//                         '</div>'+
//                         '<div class="v2-article-author-tag-wrap">'+
//                             '<span class="v2-article-author-tag">作者标签</span>'+
//                         '</div>'+
//                         '<div class="v2-article-right">'+
//                             '<span class="v2-article-follow-bt">+关注</span>'+
//                         '</div>'+
//                     '</div>'+
//                     '<div class="v2-article-body">'+
//                         '<div class="v2-article-img-wrap">'+
//                             '<img class="v2-article-img" src="" alt="">'+
//                             '<img class="v2-article-img" src="" alt="">'+
//                             '<img class="v2-article-img" src="" alt="">'+
//                         '</div>'+
//                         '<div class="v2-article-title el-txt">标题 标题 标题 标题 标题 标题 标题 标题 标题 标题 标题 标题 标题 标题 标题</div>'+
//                         '<div class="v2-article-summary">'+
//                             '内容 内容 内容 内容内容内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 内容 '+
//                         '</div>'+
//                     '</div>'+
//                     '<div class="v2-article-footer">'+
//                     '<div class="v2-article-footer-item"><i class="iconfont icon-xin"></i> <span>32</span></div>'+
//                         '<span></span>'+
//                         '<div class="v2-article-footer-item"><i class="iconfont icon-chat"></i> <span>32</span></div>'+
//                         '<span></span>'+
//                         '<div class="v2-article-footer-item"><i class="iconfont icon-item-share"></i> <span>分享</span></div>'+
//                     '</div>'+
//                 '</div>';

//     return html;
// }

// 问题列表
function listQA(topics,holderclass){
    var QAHtml = '';
        for(var index in topics){
            var topic = topics[index];
            var html = getQAHtml(topic);
            QAHtml += html;
        }
        $(holderclass).append($(QAHtml));
}
function getQAHtml(topic){

    topic.ui = topic.ui || topic.userimage;
    topic.un = topic.un || topic.nickname;
    topic.tid = topic.tid || topic.id;
    topic.images = topic.images || topic.ad_image;
    topic.viewcount = topic.viewcount || topic.views;
    topic.recommend = topic.recommend || topic.recommend_add;

    var likeHtml = '<i class="iconfont icon-xin color-999" data-tid="'+topic.tid+'" onclick="clickZan(this);"></i><span class="ml2 like-count color-999">'+topic.recommend+'</span>';
    if(topic.me_like_topic){
        likeHtml = '<i class="iconfont icon-xin-fill color-red" data-tid="'+topic.tid+'" onclick="clickZan(this);"></i><span class="ml2 like-count color-red">'+topic.recommend+'</span>';
    }

    var contentHtml = '';
    if(parseInt(topic.commentcount)>0){
        //contentHtml = '<span class="color-blue" onclick="openUserSpace('+topic.reply_uid+');">'+topic.reply_un+'：</span>'+topic.reply_content+'';
        contentHtml = topic.reply_content+'';
    }

    var avatorHtml =    '<div class="v2-qa-author-info" onclick="openUserSpace('+topic.authorid+');">'+
                            '<img class="v2-qa-author-avator" src="'+topic.ui+'" alt="">'+
                        '</div>';
    if(topic.anonymous == '1'){
        avatorHtml =    '<div class="v2-qa-author-info">'+
                            '<img class="v2-qa-author-avator" src="../image/avator_bg.jpg" alt="">'+
                        '</div>';
    }

    var html = '<div class="v2-qa-item">'+
                    '<div class="v2-qa-header" data-tid="'+topic.tid+'">' +
                        avatorHtml +
                        '<div class="v2-qa-title item-title vt" onclick="openQaDetail('+topic.tid+','+topic.fid+');">'+topic.content+'</div>'+
                    '</div>'+
                    '<div class="v2-qa-body" onclick="openQaDetail('+topic.tid+','+topic.fid+');">'+
                        '<div class="v2-qa-like-wrap"></div>'+
                        '<div class="v2-qa-content">'+
                            contentHtml +
                        '</div>'+
                    '</div>'+
                    '<div class="v2-qa-footer">'+
                        '<div class="v2-qa-tags-wrap">'+
                            '<span class="v2-qa-tag"><i class="iconfont icon-biaoqian color-999"></i><span class="ml2 color-999">'+topic.fname+'</span></span>'+
                        '</div>'+
                        '<div class="v2-qa-reply-count-wrap inline-block">'+
                           '<span class="color-999">'+topic.commentcount+'条回答</span>'+
                        '</div>'+
                        '<div class="v2-qa-like-wrap">'+
                            likeHtml +
                        '</div>'+
                    '</div>'+
                '</div>';
    return html;
}   


function listUser(users, holder){
    var userHtml = '';
    for(var index in users){
        var user = users[index];
        userHtml += getUserHtml(user);
    }
    $(holder).append($(userHtml));
}
function getUserHtml(user){
    var html = '<div class="item user-item-wrap">'+
                    '<div class="user-item">'+
                        '<img class="item-avator" src="../image/version_logo.png" alt="">'+
                        '<div class="item-user-info vm">'+
                            '<span class="item-name">昵称</span>'+
                            '<span class="color-yellow ml2 f4">标签</span><br>'+
                            '<span class="activity-count f4 color-666 ml3">38</span><span class="ml2 f4 color-666">动态</span>'+
                            '<span class="fans-count f4 color-666">233</span><span class="ml2 f4 color-666">粉丝</span>'+
                        '</div>'+
                        '<div class="item-header-right"><span class="follow-bt">+关注</span></div>'+
                    '</div>'+
                '</div>';
    return html;
}

function openAllReplys(fid,tid){
    //console.log('open');
    api.openWin({
        name: 'reply-'+tid,
        url: 'reply.html',
        pageParam: {fid: fid,tid:tid}
    });
}
function getCommentList(tid,callback){

    var postData = {
                tid:tid,
                page:1,
                psize:3
            };
     api_ajax(0,
        'topic_comment_list.php',
        postData,
        function(ret, _, _, tid) {
            console.log(ret);
            //alert(ret.code);
                if (ret.code == 988)
                {
                    return;
                }
                if (ret['code'] == 100) {
                    try{                        
                        console.log(ret);
                        var uid = $api.getStorage('uid');
                        var count = ret.pageinfo.recordcount;
                        
                        var tid = postData.tid;
                        console.log(commentsHtml);
                        var commentsHtml = getCommentHtml(ret);
                        
                        if(callback){
                            //alert('count');
                            var _ret = {
                                count:count,
                                html:commentsHtml
                            }
                            callback(_ret);
                        }
                        
                    }catch(e){
                    }  
               }else{
                    //$('.none-comment').show();
                    //$('#content_comment').hide();
                    if(callback){
                        callback(false);    
                    }
                    
               };
            isFirst = 0;
            openGuide('topic-detail-guide');

    },tid,0);
}
var lastZanTime_common = 0; 
//文章点赞
function clickZan(dom,e) {
    var nowTime = (new Date()).valueOf();
    if (nowTime-lastZanTime_common < 1000) return;  
    lastZanTime_common = nowTime;

    if(e){e.cancelBubble = true;}
    
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
	if (ret.code == 988)
	{
		return;
	}
    $dianzan_dom = $(info.dom);
    var tid = $dianzan_dom.data('tid');
    var uid = $api.getStorage('uid');
    console.log(ret);
    if (ret['code'] == 100) {
        //alert('success');
        // 播放点赞动画
         playHeart();
         $api.setStorage(tid+''+uid,1);
         var $topic_dianzan_count = $dianzan_dom.next(); 
         var currentCount = parseInt($topic_dianzan_count.text()); 
         currentCount++;
         // if(currentCount>99){
         //    currentCount = 99+'+';
         // }
         console.log(currentCount);
        $topic_dianzan_count.text(currentCount);
        
        $dianzan_dom.css({'color':'#ff6263'}).removeClass('icon-xin').addClass('icon-xin-fill');    
        $topic_dianzan_count.css({'color':'#ff6263'}); 
        myToast(ret.msg); 
    }else if(ret.code == 110){
        myToast(ret.msg);
    }    
}

function getSysInfo() {
	var sysInfo = api.appId+"/"
		+api.appName +"/"
		+api.appVersion+"/"
		+api.systemType+"/"
		+api.systemVersion+"/"
		+api.version+"/"
		+api.deviceId+"/"
		+api.deviceToken+"/"
		+api.deviceModel+"/"
		+api.deviceName+"/"
		+api.operator+"/"
		+api.connectionType+"/"
		+api.fullScreen+"/"
		+api.screenWidth+"/"
		+api.screenHeight+"/";
	return sysInfo;
}

var moduleRoot = '../script/';
var Module = {};
function setModuleRoot(path){
    moduleRoot = path;   
}
//js模块加载
function require(moduleName,callback){
    if(Module[moduleName]){
        callback();
        return;
    }
    var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                Module[moduleName] = window.moduleOut;
                callback();
            };
        }
        script.src = moduleRoot + moduleName+'.js';
        document.getElementsByTagName("head")[0].appendChild(script);
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

//添加icon字体文件
(function (doc, win) {
    var iconLink = doc.createElement('link');
    iconLink.setAttribute('rel','stylesheet');
    iconLink.setAttribute('href','http://at.alicdn.com/t/font_1451287663_7979167.css');
    var head = doc.getElementsByTagName('head')[0];
    head.appendChild(iconLink);
})(document, window);

String.prototype.trim=function(){
　　    return this.replace(/(^\s*)|(\s*$)/g, "");
　　 }

String.prototype.ltrim=function(){
　　    return this.replace(/(^\s*)/g,"");
　　 }

String.prototype.rtrim=function(){
　　    return this.replace(/(\s*$)/g,"");
　　 }
