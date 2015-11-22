
var tid = '';
var fid = '';
var uid ='';
var contentUrl = '';
var recommenderlist;
var authorid;
var recommenderUidArray = [];
var isFirstLoad = true;
var topicType = '';
var adlist = {};

function openAllComments(){
    //console.log('open');
    api.openWin({
        name: 'reply-'+tid,
        url: 'reply.html',
        pageParam: {fid: fid,tid:tid}
    });
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

function get_topic_datail() {
    uid = $api.getStorage('uid');

    var ajaxUrl = 'topic_detail.php';

    // if(tid == ''){
    //     tid='7855';
    // }
    // console.log(tid );
    // console.log(type);
    // console.log($api.getStorage('uid'));
    api_ajax(2,ajaxUrl,{
                    tid:tid,
                    uid:uid,
                    adtype:topicType
                },
   	    function(ret, _, _, _){
                console.log(ret['topics']);
                if (ret['code'] == 100) {
                    adlist = ret['topics']['adlist'];
                    if(adlist && topicType == 'article'){
                        //listAd(adlist);    
                    }
                    //$('#tool-bt-wrap').show();
                    /*
                    api.execScript({
                        name:'topicDetail-'+tid,
                        script:'showFooter();'
                    });
					*/                    
                    //alert($api.jsonToStr(ret));
                    var content_head = $api.byId('content_head');
                    content_head.innerHTML = "";
                    if (ret['topics']['movies'] !== "") {
                        var vStr = "";
                        vStr += "<video id='player' width='100%' controls='controls'  preload='auto' autoplay='autoplay' webkit-playsinline>";
                        vStr += "<source type ='video/mp4' src='" + ret['topics']['movies'] + "'>";
                        vStr += "   抱歉，您的浏览器不支持video标记，请使用其他浏览器";
                        vStr += "   </video>";
                        content_head.innerHTML += vStr;
                    }
                    $('#author-avator-img').attr('src',ret['topics']['authorimage']);
                    $('.detail-author-nickname').text(ret['topics']['nickname']);
                    if(ret['topics']['title']!=''){
                        var html = '本文内容由&nbsp;<span class="author-nickname color-front" style="font-weight:700;">'+ret['topics']['nickname']+'</span>&nbsp; 授权，经气泡整理发出，如有任何建议或合作意向请直接与气泡联系';
                        $('.copyright-content').html(html);
                    }                    

                    authorid = ret['topics']['authorid'];
                    fup = ret['topics']['fup'];

                    if(fup == '1'){
                        //alert('dfsd');
                        $('#copyright').hide();
                        $('.topic-title').remove();
                    }
                    if(ret['topics']['tag']){
                        $('#author-tag').text(ret['topics']['tag']);    
                    }else{
                        $('#author-tag').remove();
                    }
                    
                    $('#view-count').text(ret['topics']['viewcount']);
                    
                    var dianzanCount = parseInt(ret['topics']['recommend']);
                    dianzanCount = dianzanCount>999?'999+':dianzanCount;
                    $('.topic-dianzan-count').text(dianzanCount);
                    api.execScript({
                        name: 'topicDetail-'+tid,
                        script: 'setDianzanCount(\''+dianzanCount+'\');'
                    });
                    
                    $('.detail-topic-title').text(ret['topics']['title']);
                    $('#create-time').text(ret['topics']['createdate']);
                    
                    /*
                    api.execScript({
                        name:'topicDetail-'+tid,
                        script:'setCommentCount(\''+ret['topics']['commentcount']+'\');'
                    });
                    */
                   
                    //$('#topic-dianzan-count-bottom').text(ret['topics']['commentcount']);
                    
                    if(ret['topics']['favorite'] == 1){
                        var jsfun = 'setCollected(true);';
                        api.execScript({
                            name: 'topicDetail-'+tid,
                            // frameName: 'topicDetailCon',
                            script: jsfun
                        }); 
                    }else{
                        var jsfun = 'setCollected(false);';
                        api.execScript({
                            name: 'topicDetail-'+tid,
                            // frameName: 'topicDetailCon',
                            script: jsfun
                        }); 
                    }
                    //getRecommenderList();
                    
                    // recommenderlist = ret['topics']['recommenderlist'];
                    // for(var index in ret['topics']['recommenderlist']){
                    //     var recommender = ret['topics']['recommenderlist'];
                    //     console.log(recommender[index].imageurl);
                    //     $('.recommender').eq(index).children('img').attr('src',recommender[index].imageurl);
                    //     $('.recommender').eq(index).data('uid',recommender.uid);
                    // }
                    //content_head.innerHTML += tempFn(ret['topics']);
                    api.parseTapmode();
                    if (ret['topics']['movies'] !== "") {
                        $api.byId('player').play();
                    }
                    get_content_body(ret['topics']['contenturl']);
                    contentUrl = ret['topics']['contenturl'];
                    console.log(contentUrl);
                    tid = ret['topics']['tid'];
                    fid = ret['topics']['fid'];

                    //get_content_comment();

                    // get_content_recommed(ret['topics']['id']);

                    //判断是否已点赞
                    if(ret['topics']['myrecommend'] == 1){
                        $('#content-dianzan-bt').removeClass('fa-heart-o').addClass('fa-heart').css({'color':'#ff6263'});
                        api.execScript({
                            name: 'topicDetail-'+tid,
                            // frameName: 'topicDetailCon',
                            script: 'setDianzan();'
                        });
                        //$('#fixed-dianzan-bt').css({'color':'#ff6263'});
                        
                    }
                    // if(ret['topics']['recommend'] == 0){                  
                    //     $('#dianzan img').attr('data-status','off');
                    //     $('#dianzan img').attr('src','../image/ev_good.png');    
               
                    // }else if(ret['topics']['recommend'] == 1){
                    //     $('#dianzan img').attr('data-status','on');
                    //     $('#dianzan img').attr('src','../image/ev_isgood.png'); 
                    // }

                    //$api.setStorage('current_favorite',ret['topics']['favorite']);

                    $api.setStorage('current_topic_tid',ret['topics']['tid']);
                    $api.setStorage('current_topic_authorid',ret['topics']['authorid']);
                    $api.setStorage('current_topic_fid',ret['topics']['fid']);                    

                    api.setPrefs({
                        key: 'current_title',
                        value: ret['topics']['title']
                    });

                    api.setPrefs({
                        key: 'content_url',
                        value: ret['topics']['contenturl']
                    });

                    $api.setStorage('current_title',ret['topics']['title']);
                    $api.setStorage('current_url',ret['topics']['contenturl'].replace('photo','qipaobbs').replace('&mobile=1',''));
                    $api.setStorage('current_img_url',api.pageParam.imgUrl);                            
                            
                        }
                },null,0);
    
    $('#commend-bt').click(function(){
        api.openWin({
            name:'reply',
            url:'reply.html',
            pageParam:{
                fid:fid,
                tid:tid
            }
        });
    });

};

var picCount = 0;
var picUrl = Array();
function getRecommenderList(){
    var ajaxUrl = 'topic_detail_recommender.php';
    var data = {
        tid:tid,
        uid:uid,
        page:1,
        psize:7
    }
    api_ajax( 1, ajaxUrl, data, after_GetRecommenderList, null,0);
}

var recommenderUidArrayT = [];
function after_GetRecommenderList(ret,ajaxUrl,data,others)
{
    console.log(ret);
    if (ret.code == 100) {
	    recommenderlist = ret.data.info.list;
	    var remommenderLength = ret.data.info.pageinfo.recordcount;
	    $('.topic-dianzan-member').hide();
	    if(remommenderLength>6){
	        $('.topic-dianzan-member').css({'display':'inline-block'});
	    }
        console.log(remommenderLength);
	    $('.topic-dianzan-member').text(remommenderLength);
	       
        var recommenderListHtml = '';
	    for(var index in recommenderlist){
	        var recommender = recommenderlist[index];
	        //console.log(recommender[index].imageurl);
	        // $('.recommender').eq(index).children('img').attr('src',recommender.ui);
	        // $('.recommender').eq(index).data('uid',recommender.userid);
	        recommenderUidArray[index] = recommender.userid;
            var html = '<li class="recommender" data-uid="'+recommender.userid+'" onclick="openUserSpace('+recommender.userid+')"><img class="default-avator" src="'+recommender.ui+'" alt=""></li>';

            recommenderListHtml += html;
        }
        //$('.dianzan-user-list').html(recommenderListHtml);
        $('.dianzan-user-list').html(recommenderListHtml);
        // if(isFirstLoad){
        //     isFirstLoad = false;
        //     $('.dianzan-user-list').html(recommenderListHtml);
        // }else if(!isInArray(recommenderUidArrayT,uid)){
        //         // var html = '<li class="recommender" data-uid="'+uid+'" onclick="openUserSpace('+uid+')"><img class="default-avator" src="'+$api.getStorage('userimage')+'" alt=""></li>';
        //         // $('.dianzan-user-list').prepend($(html));
        //         $('.dianzan-user-list').html(recommenderListHtml);
            
        // }  
        // recommenderUidArrayT =  recommenderUidArray;
    }
}

function listAd(adlist){
    $('.more-recommend-header').show();
    $('.ad-list').show();
    listArticle(adlist,'.ad-list');
}

function get_content_body(ajaxUrl) {
	api.showProgress({
		title:  '加载中...',
        text:'',
		modal: false
	});
    api.ajax({
        url: ajaxUrl,
        method: 'get',
        async: false,
        // cache: false,
        // timeout: 30,
        dataType: 'text'},
        function(ret,err) {
            //console.log(ret);
            if (ret) {       
                if(ret.indexOf('指定的主题不存在或已被删除')>0){
                    ret = '抱歉，指定的主题不存在或已被删除或正在被审核。';
                }   
                if(ret.indexOf('你尚未登录')>0){
                    ret = '抱歉，你尚未登录，指没有权限访问该板块。';
                }       
                ret = ret.replace("device-width;", "device-width,");

                ret = ret.replace("initial-scale=1.3;", "initial-scale=1.0,");
				ret = ret.replace("minimum-scale=1.0;", "minimum-scale=1.0,");
                
                if($api.getStorage('isLimitData')=='true'){
                    ret = ret.replace(/<img .*?>/g, '');
                } 
                var reg = new RegExp('<a href=\".*?</a>', 'g');
                var reg1 = new RegExp('href=\".*?\"', 'g');
                var reg2 = new RegExp('src=\".*?\"', 'g');
                var cc = "";
                var ret1 = ret;
                while ((rr = reg.exec(ret1)) != null) {
                    //r += rr+"\r\n";
                    cc = "" + rr;
                    //r += "rr.input="+rr.input+"</br>";
                    ss = cc.match(reg2);
                    //r += "SS="+ss+"\r\n";
                    hh = cc.match(reg1);
                    //r += "HH="+hh+"\r\n";
                    //r += "rr.index="+rr.index+"\r\n";
                    //r += "rr.lastIndex ="+rr.lastIndex +"\r\n";
                    var cc1 = cc.replace("" + hh, "href=\"#\" onclick=\"return openImageBrowser(" + picCount + ");\"");
                    ret = ret.replace(cc, cc1); //+"__/"+picCount+"/"); 
                    var ss1 = "" + ss;
                    ss1 = ss1.replace("src=\"", "");
                    ss1 = ss1.replace("\"", "");
                    picUrl[picCount] = ss1;
                    picCount++;
                }
                //alert(picCount);
                //alert(picUrl[0]);
                //alert(ret);
                // var content_body = $api.byId('topic-context');
                // content_body.innerHTML = ret;

                $('#topic-context').html(ret);
                //console.log(ret);
                //alert($api.text(content_body));
                $api.setStorage('current_desc','');
                $('#main').show();
                
                api.execScript({
                    name:'topicDetail-'+tid,
                    script:'showFooter();'
                });                
            } else {
            }
            getRecommenderList();
            api.hideProgress();
     });
}

function openImageBrowser(index) {
	var obj = api.require('imageBrowser');

	obj.openImages({
	    imageUrls: picUrl,
	    showList:false,
	    activeIndex:index
	});

/*
    api.openWin({
        name: 'imageBrowser',
        url: 'imageBrowser.html',
        pageParam: {
            index: index,
            picUrl: picUrl
        },
        opaque: true,
        bounces: false,
        vScrollBarEnabled: false
    });
*/
    return false;
}

function get_content_comment() {
    //myToast('show all comments');
		  
    console.log(tid);
   
    var postData = {
            	tid:tid,
            	page:1,
            	psize:3
            };
     api_ajax(0,
    	'topic_comment_list.php',
    	postData,
        function(ret, _, _, tid) {
	            if (ret['code'] == 100) {
	                try{	                	
	                    console.log(ret);
	            		var uid = $api.getStorage('uid');
	                    var count = ret.pageinfo.recordcount;
                        if(count == 0){
                            $('.none-comment').show();
                        }else{
                            $('.no-comment-wrap').hide();
                            $('.none-comment').hide();
                        }
                        
	                    api.execScript({
	                        name:'topicDetail-'+tid,
	                        script:'setCommentCount(\''+count+'\');'
	                    });                        
                        
                        $('.comment-count').text(count);
                        if(ret.pageinfo.totalpage>1){
                            //$('#check-allcomments-bt').show();
                        }
	                    //console.log(count);
						var tid = postData.tid;
	                    var commentsHtml = '';
	                    for(var index in ret.commentlist){
	                        comment = ret.commentlist[index];
	                        var sexHtml = '<i class="gender-ico gender-male-ico fa fa-mars"></i>';
	                        switch(comment.sex){
	                            case '0':
	                            sexHtml = '';
	                            break;
	                            case '2':
	                            sexHtml = '<i class="gender-ico gender-female-ico fa fa-mars"></i>';
	                            break;
	                            case '1':
	                            sexHtml = '<i class="gender-ico gender-male-ico fa fa-venus"></i>';
	                            break;
	                            default:
	                            break;
	                        }
	                        var dianzanIcoHtml = '<i class="reply-img fa fa-heart-o" style="margin-bottom:0px;vertical-align:middle;font-size: 0.8rem;color:#999;"></i>';
	                        if($api.getStorage(comment.pid+''+uid) == 1){
	                            dianzanIcoHtml = '<i class="reply-img fa fa-heart" style="margin-bottom:0px;vertical-align:middle;font-size: 0.8rem;color:#ff6263;"></i>';
	                        }
	                        //console.log(comment.pid+''+$api.getStorage('uid'));
	                        //console.log(comment);
	                        //点赞数
	                        if(comment.recommend_add>999){
	                            comment.recommend_add = '999+';
	                        } 
                            var subCommentHtml = '<div class="sub-comment">';

	                       for(var sindex in comment.subcommentlist){
                                var subComment = comment.subcommentlist[sindex];
                                var html = '<div class="sub-comment-item">'+
                                                '<span class="sub-comment-username" onclick="openUserSpace('+subComment.authorid+',event);">'+subComment.nickname+'</span>:&nbsp;'+    
                                                '<span class="sub-comment-content">'+subComment.content+'</span>'+
                                            '</div>';
                                subCommentHtml += html;
                                if(sindex>1){
                                    break;
                                }
                           }
                           
                           if(comment.subcommentlist.length<1){
                                subCommentHtml = '';
                           }else if(comment.subcommentlist.length>3){
                            subCommentHtml+='<div class="checkmore-subcomment">查看更多'+comment.subcommentlist.length+'条回复<i class="fa fa-angle-down"></i></div></div>';
                           }else{
                                subCommentHtml+='</div>';
                           }

	                        var html = '<li class="comment-item" data-pid="'+comment.pid+'" onclick="replyToUser(this);">' +
	                                        '<div class="comment-item-header">'+
	                                            '<div style="display:inline-block;width:1.6rem;height:1.6rem;border-radius:50%;overflow:hidden;vertical-align:middle;" onclick="openUserSpace('+comment.authorid+');">'+
	                                                '<img class="default-avator" src="'+comment.authorimage+'" style="height:100%;"/>'+
	                                            '</div>'+
	                                            '<div class="author-info-box">'+
	                                                '<span class="nick-name" onclick="openUserSpace('+comment.authorid+');">'+comment.nickname+'</span>'+sexHtml+'<br>'+
	                                                '<span class="floor-index" id="reply-position" style="font-size:0.4rem;color:#ccc;">'+comment.position+'F</span>'+
	                                                '<span style="margin-left:0.2rem;font-size:0.4rem;color:#ccc;">'+comment.createdate+'</span>'+
'<div id="comment_uid" style="display:none;">'+comment.authorid+'</div>'+
'<div id="comment_nick" style="display:none;">'+comment.nickname+'</div>'+	                                                
	                                            '</div>'+
	                                            '<div class="reply-bt"><span class="recommend-to-user" onclick="dianzanToUser(this,event);">'+dianzanIcoHtml+'<span class="dianzan-count color-999">'+comment.recommend_add+'</span></span><span class="reply-to-user"><img class="reply-img ml10" style="width:18px;margin-bottom:0px;vertical-align:middle;" data-position="'+comment.position+'" src="../image/comment_ico.png"></span>'+
	                                            '</div>'+
	                                        '</div>'+
	                                        '<div class="comment-item-body">'+
	                                           comment.content+
	                                        '</div>'+
                                            
                                                subCommentHtml+
                                            
	                                    '</li>';
	                        commentsHtml += html;            
	                    }
	                    $('.comment-list').html(commentsHtml);	                    
	
	                    $('.reply-to-user').on('click',function(){
	                        var comment_item = $(this).parent().parent().parent();
	                        var toUserInfo = $("<p>").append(comment_item.clone()).html();
	                        var pid = comment_item.data('pid');
                            var position = $(this).data('position');
	                        api.openWin({
	                            name:   'replyUser',
	                            url:    'replyUser.html',
	                            pageParam: {toUserInfo: toUserInfo,
	                                        pid:pid,
                                            position:position
	                                    },
	                            reload: false,
	                            bounces: true,
	                            opaque: true,
	                            vScrollBarEnabled: true,
	                            softInputMode: 'resize'
	                        });
                            return false;
	                    });
	                }catch(e){
	                }  
	           }else{
                    $('.none-comment').show();
               };
			isFirst = 0;
    },tid,0);
}

function replyToUser(self){
    $(self).find('.reply-to-user').trigger('click');
}

function dianzanToUserV(count_dom,e){
    if(e){e.cancelBubble = true;}
    $(count_dom).prev('.reply-img').trigger('click');
    return false;
}

function dianzanToUser(dianzan_dom,e){
    playHeart();
     if(e){e.cancelBubble = true;}
    var comment_item = $(dianzan_dom).parent().parent().parent();
    var pid = comment_item.data('pid');
    
    var uid = $api.getStorage('uid');
    console.log(uid);

    var postData = {
            	uid:uid,
            	pid:pid
            };  
    api_ajax(2,
    	'topic_comment_recommend.php',
		postData,
        function(ret,_, postData, dianzan_dom){
				var uid = postData.uid;
				var pid = postData.pid;
						
	            console.log(pid+''+uid);
	            $api.setStorage(pid+''+uid,1);
                var $dianzan_ico = $(dianzan_dom).children('i');
	            if($dianzan_ico.hasClass('fa-heart-o')){
	                $dianzan_ico.addClass('fa-heart').removeClass('fa-heart-o').css('color','#ff6263');    
	            }
	            var $dianzan_count = $dianzan_ico.next('span');
	            var current_count = parseInt($dianzan_count.text());
	                current_count++;
	                if(current_count>999){
	                    current_count = 999+'+';
	                }
	            $dianzan_count.text(current_count);
    	},
    	dianzan_dom,
    	0);
     
}

var isClickZaned = false;
function clickZan(isPlayAnimate) {
    if(!!!isPlayAnimate){
        playHeart();    
    }
    // var tid = api.pageParam.id;
    var uid = $api.getStorage('uid');
    //!isInArray(recommenderUidArray,uid)
    // if(!isInArray(recommenderUidArray,uid)){
    //     var html = '<li class="recommender" data-uid="'+uid+'"><img src="'+$api.getStorage('user_image')+'" alt=""></li>';
    //     $('.dianzan-user-list').prepend($(html));
    //     if(recommenderUidArray.length>5){
    //         $('.topic-dianzan-member').show();
    //         $('.recommender:last-child').remove();
    //     }
    // }
    
    var ajaxUrl ='topic_recommend_add.php';
    console.log(uid+tid);
    api_ajax(0,
            ajaxUrl,
            {
                tid:tid
            },

        function(ret){
                console.log(ret);
                if (ret['code'] == 100) {
                        //alert('success');
                         $api.setStorage(tid+''+uid,1);
                         var $topic_dianzan_count = $('#topic-dianzan-count-bottom'); 
                         var currentCount = parseInt($topic_dianzan_count.text()); 
                         currentCount++;
                         if(currentCount>999){
                            currentCount = 999+'+';
                         }
                         if(!isClickZaned){
                            getRecommenderList();
                         }
                         isClickZaned = true;
                         console.log(currentCount);
                         api.execScript({
                            name:'topicDetail-'+tid,
                            script:'setDianzanCount(\''+currentCount+'\');'
                         });
                         api.execScript({
                            name:'topicDetail-'+tid,
                            script:'setDianzan();'
                         });

                    $topic_dianzan_count.text(currentCount);
                    // if($('.topic-dianzan-ico').hasClass('fa-heart-o')){
                    //     $('.topic-dianzan-ico').css({'color':'#ff6263'});    
                    // }
                   if($('.topic-content-dianzan-ico').hasClass('fa-heart-o')){                       $('.topic-dianzan-ico').removeClass('fa-heart-o').addClass('fa-heart').css({'color':'#ff6263'});    
                   }
                       
                  }  
            },
        null,0);
}

function detailPlayStar(){
    playStar();
}


var isFirst = 1;
var fup = '';
apiready = function() {

    isDev =false;

    tid = api.pageParam.id;
    topicType = api.pageParam.topicType;
    //alert(topicType);
    

    console.log(tid);
    //fid = api.pageParam.fid;
    // alert('tid'+tid+'fid'+fid);
    get_topic_datail(); 

    // api.addEventListener({
    //     name:'swipedown'
    // },function(ret,err){
    //     $('#tool-bt-wrap').fadeIn();
    // });
    // api.addEventListener({
    //     name:'swipeup'
    // },function(ret,err){
    //     $('#tool-bt-wrap').fadeOut();
    // });

	api.addEventListener({
           name:'viewappear'
      },function(ret,err){
		 //if (isFirst == 0)
		  {
		   get_content_comment();
		  }
    });
		        
    // var wrapScrollY = 0;
    // document.onscroll = function(){
    //     var currentTop = document.body.scrollTop;
    //     console.log(currentTop);
    //     if(currentTop>wrapScrollY){
    //         $('#tool-bt-wrap').fadeOut();
    //     }else{
    //         $('#tool-bt-wrap').fadeIn();
    //     }
    //     wrapScrollY = currentTop;
    // }

    $('.topic-dianzan-member').click(function(){
        //openWin('recommend-users');
        api.openWin({
            name:'recommend-users',
            url:'recommend-users.html',
            pageParam:{
                fid:fid,
                tid:tid,
                recommenderlist:recommenderlist    
            }
        });
    });
    $('.recommender').click(function(){
        var uid = $(this).data('uid');
        if(uid != ''){
            openUserSpace(uid);    
        }
        
    });
    $('.author-nickname').click(function(){
        openUserSpace(authorid);
    });
    $('.author-avator').click(function(){
        openUserSpace(authorid);
    });
}
