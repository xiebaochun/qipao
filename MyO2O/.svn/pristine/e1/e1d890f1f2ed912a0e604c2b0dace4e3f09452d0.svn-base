//previous page id, current page id
var prevPid = '', curPid = '';
//save opened frame name
var frameArr = [];

//frame whether open
function isOpened(frmName) {
	for (var i = 0; i < frameArr.length; i++) {
		if (frameArr[i] === frmName) {
			return true;
		}
	}
	return false;
}

//toggle header
function showHeader(type) {
	if (!type) {
		return;
	}
	var header = $api.dom('#header .active');
	$api.removeCls(header, 'active');
	var thisHeader = $api.dom('#header .' + type);
	$api.addCls(thisHeader, 'active');
}

//open tab
var isFirstOpenTab = 1;
function openTab(type, tabid) {
	 if(type === 'gouda' || type === 'my'){
	 	var action = "openTab('"+type+"', '"+tabid+"')";
	 	if (!checkLogin(action, 'root')) 
	 		return;
	 }
	showHeader(type);
	var width = api.winWidth;
	var nav = $api.byId('nav');
	var navPos = $api.offset(nav);
	var header = $api.byId('header');
	var headerPos = $api.offset(header);
	var height = api.winHeight - navPos.h+2; 
	//alert(api.winHeight);

	type = type || 'main';

	var actTab = $api.dom('#nav .active');
	$api.removeCls(actTab, 'active');
	var thisTab = $api.dom('#nav .' + type);
	thisTab = thisTab.parentNode;
	$api.addCls(thisTab, 'active');
	
	if (!isFirstOpenTab) {
		var jsfun = ''; 
		if (type == 'main') {
			jsfun = 'slideSwitch(1);';
		}
		else {
			jsfun = 'slideSwitch(0);';
		}
        api.execScript({
            name: 'root',
            frameName:'main',
            script: jsfun
        });		
	}

	//record page id
	prevPid = curPid;
	curPid = type;
	if (prevPid !== curPid) 
	{
		api.setFrameAttr({
			name : 'topicExplore',
			hidden : true
		});
		 api.setFrameAttr({
			name : 'topicFollow',
			hidden : true
		});
		api.setFrameAttr({
			name : 'goudaCon',
			hidden : true
		});
		// alert(type+':'+isOpened(type));

		if (isOpened(type)) {
			api.setFrameAttr({
				name : type,
				hidden : false
			});
			if(type=='topic'){
				api.setFrameAttr({
					name : 'topicExplore',
					hidden : false
				});
				 api.setFrameAttr({
					name : 'topicFollow',
					hidden : false
				});
			}
			if(type == 'gouda'){
				 api.setFrameAttr({
					name : 'goudaCon',
					hidden : false
				});
			}
		} else {
			api.openFrame({
				name : type,
				url : 'html/' + type + '.html',
				reload: false,
				bounces: false,
				opaque: true,
				vScrollBarEnabled : false,
				pageParam : {
					headerHeight : headerPos.h,
					tid : tabid,
					navHeight:navPos.h
				},
				rect : {
					x : 0,
					y : 0,
					w : width,
					h : height
				}
			});
		}

		if (prevPid) {
			api.setFrameAttr({
				name : prevPid,
				hidden : true
			});
		}

		if (!isOpened(type)) {
			//save frame name
			frameArr.push(type);
		}
	}
	isFirstOpenTab = 0;
}

function checkCurPid(name, frameName) {
	
console.log("CurPid___"+curPid+"____" + name +"/"+frameName);

	if (curPid == 'main'  && frameName == 'main') {
        api.execScript({
            name: 'root',
            frameName: 'main',
			script:  'view_appear(1);'
        });	
	} else if (curPid == 'my' && frameName == 'my') {
        api.execScript({
            name: 'root',
            frameName: 'my',
            script:  'view_appear(1);'
        });	
	} else if (curPid == 'topic' && frameName == 'topicFollow') {
        api.execScript({
            name: 'root',
            frameName: 'topicFollow',
            script:  'view_appear(1);'
        });	
	} else if (curPid == 'gouda' && frameName == 'goudaCon') {
        api.execScript({
            name: 'root',
            frameName: 'goudaCon',
            script:  'view_appear(1);'
        });	
	}
}

function showExplore(){
 	
}
function showFollow(){

}

function login_to_server() {
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
			null,
			0
		);	
}

function after_login_to_server(ret, _, parms, _) {
	if (ret.code == 100) {		
	   if (parms.platform == 'qp_phone') {
			    $api.setStorage('phone', $api.getStorage('phone'));
			    $api.setStorage('authcode', $api.getStorage('authcode'));
			    $api.setStorage('uid', ret.uid);		
			    $api.setStorage('token', ret.token);
			    $api.setStorage('userimage',ret.userimage);
			    $api.setStorage('username',ret.username);	
			    $api.setStorage('platform', 'qp_phone');	
		} else {
				$api.setStorage('uid', ret.uid);
				$api.setStorage('token', ret.token);
				$api.setStorage('username', ret.username);
				$api.setStorage('userimage', ret.headimg);
				$api.setStorage('platform', parms.platform);
				$api.setStorage('platform_userid', parms.id);
				$api.setStorage('platform_username', parms.username);
				$api.setStorage('platform_headimgurl', parms.headimgurl);		          		
		}	      	       

	   api.setPrefs({
		 key: 'uid',
		 value: ret.uid
	   });
	   api.setPrefs({
		 key: 'token',
		 value: ret.token
	   });
	} 
}

/*
function set_gouda_datainfo(ret, _,  _, _){
		if (ret.code == 100)
		   {
			   data = ret.data;
			   $api.setStorage('n_count', data.n);
			   $api.setStorage('l_count', data.r);
			   $api.setStorage('r_count', data.c);
			   $api.setStorage('p_count', data.p);  
			   var gouda_data  = '_' + data.n;
				   gouda_data += '_' + data.r;
				   gouda_data += '_' + data.c;
				   gouda_data += '_' + data.p;
			   if (gouda_data != "____") {       
					set_gd_new(1);
				} else {
					set_gd_new(0);     	
				}
		   }
}  
*/
function set_gd_new(dd) {
		var gd_new = $("#gd_new");
   		if (dd == 1)
   			gd_new.css('display','block'); 
   		else
   			gd_new.css('display','none');   
}   	       

apiready = function() {
	api.setFullScreen({
		fullScreen : false
	});

	var header = $api.byId('header');
	$api.fixIos7Bar(header);

	api.setStatusBarStyle({
		style : 'light'
	});

	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.closeWidget();
	});
	
	openTab('main', '71bbe');

	login_to_server();
	
	/*
	setTimeout(function () {
			//login_to_server();
			//myToast("login_to_server()");
  	}, 10*1000);
  	*/
}; 