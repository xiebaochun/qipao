
var adlist = [];
var topicListLen = 0;
var lastTime = 0;
var slideReady = false;
var slideHeight;
$slide = $('#slide');
$slideWrap = $('.swipe-wrap');
function initSlide() {
    var slide = $api.byId('slide');
    var pointer = $api.domAll('#pointer a');
    window.mySlide = Swipe(slide, {
        // startSlide: 2,
        auto: 5000,
        continuous: true,
        disableScroll: true,
        stopPropagation: true,
        callback: function (index, element) {
        	//console.warn("main_______________mainSlide");
            var $currentSlide = $api.dom('#current-slide');
            $api.text($currentSlide,index+1);
        },
        transitionEnd: function (index, element) {
        }
    });
    $api.text($api.dom('#total-slides'),mySlide.getNumSlides());
    slideReady = true;
    slideHeight = $slide.height();
    $slide.css({'height':slideHeight+'px'})
}

function slideSwitch(status) {
	if (slideReady) {
		if (status) {
			$slideWrap.show();
            $('#pointer').show();
            $slideWrap.next();		
		}			
		else {
			$slideWrap.hide();
            $('#pointer').hide();
            $slideWrap.stop();
        }
	}
}

function initTopBanner(banner_list){
    var bannerHtml = '';
    var bannerLen = banner_list.length;
    for(var index in banner_list){
        var html = '<div onclick="return clickAD(\''+ banner_list[index].ad_link+'\');">'+
                        '<a tapmode="" onclick="">'+
                            '<img src="'+banner_list[index].ad_image+'" />'+
                            '<div class="banner-title">'+banner_list[index].ad_name+'</div>'+
                            '<div class="banner-content">'+banner_list[index].summary+'</div>'+
                        '</a>'+
                    '</div>';
        bannerHtml+=html;
    }
    $('#banner-content').empty();
    $('#banner-content').append(bannerHtml);
    //$('#total-slides').text(bannerLen);
	setTimeout(function () {
			initSlide();
            // slideSwitch(0);
  	}, 1*1000);    
        
}

function getData() {
    isTopicLoaded = false;
	api_ajax(0, 
		'index_api.php', 
		{	
			page:topic_page,
			psize:psize
		}, 
		after_getData,
		0,
		0
	);    
}

function after_getData(ret, _, _, _) {
	if(ret.code == 101){
		topic_page = -1;
	} else if(ret.code == 100){
	//	console.log(ret);
		if (topic_page == 1) {
			$('#topic-content').empty();
			adlist = ret.data.home_topic; 
			topicListLen = 0;
		}	
		
		createArticle(ret.data.topics.topicslist);
		
		if (topic_page == 1) {
			initTopBanner(ret.data.home_banner);
		}			
    	if (ret.data.topics.pageinfo.curpage >= ret.data.topics.pageinfo.totalpage)
    			topic_page = -1;	
	}else{
		topic_page = -1;
	}
	isTopicLoaded = true;
}

//添加文章
function createArticle(topics){
    var topicHtml = '';
    for(var index in topics){
        topicHtml += getArticleItem(topics[index]);
        topicListLen ++;
        if (topicListLen == 3) {
        	topicHtml += getAdHtml();
        	topicListLen = 0;
        }
    }
    $('#topic-content').append(topicHtml);
}
 
function getAdHtml(){
   if (adlist.length <= 0) return "";
   var index =0;
   var adHtml = '';
	   adHtml += '<div class="item activity-item" onclick="return clickAD(\''+ adlist[index].ad_link+'\');">'+
                        '<a tapmode="">'+
                            '<img class="ad-img" src="'+adlist[index].ad_image+'">';
        if(adlist[index].ad_type == 'topic'){                    
		if(adlist[index].fname == ''){                            
        adHtml +=            '<span onclick="openTopicCircle('+adlist[index].fid+', \''+adlist[index].fname+'\', 0, 500);">#'+adlist[index].fname+'#</span>';      
        }
        }
        adHtml +=           '<div class="activity-content ad-content">';
        if(adlist[index].ad_type == 'topic'){
	        adHtml +=           '<span class="ad-title">'+adlist[index].title+'</span><br>';
            adHtml +=           '<span class="ad-desc"><span class="ad-lineheight">'+adlist[index].reply_num+'</span>个回复\/<span class="ad-lineheight">'+adlist[index].fav_num+'</span>人关注</span>';
		} else if(adlist[index].ad_type == 'circle'){
	        adHtml +=           '<span class="ad-title">#'+adlist[index].fname+'#</span><br>';
            adHtml +=           '<span class="ad-desc"><span class="ad-lineheight">'+adlist[index].topic_num+'</span>个话题\/<span class="ad-lineheight">';
            adHtml +=  adlist[index].fav_num+'</span>人关注</span>';
		}                                
        adHtml +=           '</div>'+
                        '</a>'+
                    '</div>'; 
        adlist.shift();         
    return adHtml;      
}


var topic_page = 1;
var psize = 5;
var adlist = null;
var isTopicLoaded = true;

var topic_content = null;
var banner_content = null;

apiready = function () {
    isDev = false;
	banner_content = $api.byId('banner-content');
	topic_content = $api.byId('topic-content');

	lastTime = (new Date()).valueOf();
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
        var nowTime = (new Date()).valueOf();
        if (nowTime-lastTime > 180000) {		//3*60*1000 = 180000
			//myToast("topic_page:" + topic_page +"/" + (new Date()).valueOf());         
        	lastTime = nowTime;
	        if(isTopicLoaded){
	        	topic_page = 1;
	        	getData();
	         }
         }
        api.refreshHeaderLoadDone();
    });

    api.addEventListener({
        name: 'scrolltobottom',
        extra:{
        	threshold:200    //设置距离底部多少距离时触发，默认值为0，数字类型
    	}
    }, function (ret, err) {
       if (topic_page > 0 && isTopicLoaded)
        { 
	        topic_page = topic_page + 1;
	        getData();
        }
    });
    
    getData();
    
    api.addEventListener({
           name:'viewappear'
      },function(ret,err){      
        api.execScript({
            name: 'root',
            script: 'checkCurPid("root","main")'
        });
	});
			    
	//定时获取勾搭的基本数据条数
	setInterval(function () {
			get_gouda_datainfo(0);
  	}, 60*1000);  

    $(window).scroll(function() {  
        if ($(document).scrollTop()<=slideHeight+100){
            //alert("滚动条已经到达顶部为0");
            slideSwitch(1)
        }else{
            slideSwitch(0);
        }
        // if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
        //     //alert("滚动条已经到达底部为" + $(document).scrollTop());
        //     callback();
        // }
        // if((jQuery(window).scrollTop()>(jQuery('.item').offset().top+jQuery('.item').outerHeight()))||((jQuery(window).scrollTop()+jQuery(window).height())<jQuery('.item').offset().top)){
        //     jQuery('.item>*').hide();
        // }
        // $('.item').scroll(function(){
        //     console.log('gsd');
        // });
        // $('.item').bind('inview', function (event, visible, topOrBottomOrBoth) {
        //   if (visible == true) {
        //     // element is now visible in the viewport
        //     if (topOrBottomOrBoth == 'top') {
        //       // top part of element is visible
        //     } else if (topOrBottomOrBoth == 'bottom') {
        //       // bottom part of element is visible
        //     } else {
        //       // whole part of element is visible
        //     }
        //     console.log('view');
        //     $(this).children('img').show();
        //   } else {
        //     // element has gone out of viewport
        //     console.log('out view');
        //     $(this).children('img').hide()
        //   }
        // });
    });  
    
};

function  view_appear(show) {
	slideSwitch(1);
	console.log("view_appear(main)");
} 

$(function(){
    initDev();
});


