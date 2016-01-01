!function(){
    var share = {};
    //新浪分享
    share.sina = function(url,title,desc,imgUrl){
        //window.open('http://v.t.sina.com.cn/share/share.php?title= →来自页面"' + title + '"的文字片段&url=' + url);
        var sinaWeiBo = api.require('sinaWeiBo');
        sinaWeiBo.sendRequest({
            contentType: 'text',
            text: desc+'→来自页面"' + title + '"的文字片段&url=' + url,
            imageUrl: imgUrl
        },function(ret,err){
            if (ret.status) {
                // api.alert({
                //     title: '发表微博',
                //     msg: '发表成功',
                //     buttons: ['确定']
                after_share_success();
            } else {
                // api.alert({
                //     title: '发表微博',
                //     msg: '发表失败',
                //     buttons: ['确定']
                // });
                myToast('分享失败！');
            }
        });
    }
    //qq分享
    share.qq = function(url,title,desc,imgUrl){
        var obj = api.require('qq');
        // alert(JSON.stringify({
        //    url:url,
        //    title:title,
        //    description:desc,
        //    imgUrl:imgUrl
        // }));
        obj.shareNews({
           url:url,
           title:title,
           description:desc,
           imgUrl:imgUrl,
           type:'QFriend'
        },
        function(ret,err){
            if(ret.status){
                //api.alert({title: '发表微信',msg: '发表成功', buttons: ['确定']});
                after_share_success();
            } else{
                //api.alert({title: '发表失败',msg: err.msg,buttons: ['确定']});、
                myToast('分享失败！');
            }
        });  
    }
    //微信分享
    share.weixin = function(url,title,desc,imgUrl){
        var weiXin = api.require('wx');
        weiXin.shareWebpage({
            scene:'session',
            title: title,
            description: desc,
            thumb: imgUrl,
            contentUrl: url
        },function(ret,err){
            if(ret.status){
                //api.alert({title: '发表微信',msg: '发表成功', buttons: ['确定']});
                after_share_success();
            } else{
                //api.alert({title: '发表失败',msg: err.msg,buttons: ['确定']});、
                myToast('分享失败！');
            }
        });
    }
    //微信朋友圈分享
    share.weixinfriend= function(url,title,desc,imgUrl){
        var weiXin = api.require('wx');
        weiXin.shareWebpage({
            scene:'timeline',
            title: title,
            description: desc,
            thumb: imgUrl,
            contentUrl: url
        },function(ret,err){
            if(ret.status){
                //api.alert({title: '发表微信',msg: '发表成功', buttons: ['确定']});
                 after_share_success();
            } else{
                //api.alert({title: '发表失败',msg: err.msg,buttons: ['确定']});、
                myToast('分享失败！');
            }
        });
    }
    window.shareApi = share;
}();

function after_share_success(){
	var share_type = $api.getStorage('share_type');
	$api.rmStorage('share_type');
	if(typeof(share_type) !== 'undefined' && share_type != "") {
	    api_ajax(2, 
	        'my_share_app.php', 
	        {},
	        function(ret){
	        	if (ret.code == 100) {
	        		$api.setStorage('my_share_qipao',1);
        	       	api.execScript({
			            name: 'root',
			            frameName: 'my',
			            script: "init();"
			        });	
				    api.execScript({
				         name: 'paobi',
				         script: 'init()'
				    }); 			        
				    api.execScript({
				         name: 'my-level',
				         script: 'init()'
				    }); 			       
	        		myToast(ret.msg, 2000);
	        	}
             },
	        0,
	        0
	    );
    } else {
    	 myToast('分享成功！');
    }
}
