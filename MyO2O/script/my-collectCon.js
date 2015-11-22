function getData(cur_index) {
 	var t = 'article';
 	if (cur_index == 1)
 			t = 'topic';
 	canMore[cur_index] = 0;		
	api_ajax(2, 
		url[cur_index], 
		{	
			page: page[cur_index],
			psize: psize[cur_index],
			t: t
		}, 
		after_getData,
		cur_index,
		1
		);    
}

function after_getData(ret, _, _, cur_index){
	if (ret['code'] == 101) {
			if (page[cur_index] == 1) {
				$("#"+item[cur_index]+"_none").show();
	  			$("#"+item[cur_index]+"_list").hide();
	  			$("#"+item[cur_index]+"_list").empty();
			}
			page[cur_index]  = -1;
		} else if (ret['code'] == 100) {
			if (page[cur_index] == 1) {
			
				$("#"+item[cur_index]+"_none").hide();
	  			$("#"+item[cur_index]+"_list").show();
	  			$("#"+item[cur_index]+"_list").empty();
			}        		
    		data = ret.data;
            console.log(ret.data);
			createHtml(data.info.list, cur_index);
    		if (data.info.pageinfo.curpage >= data.info.pageinfo.totalpage)
    			page[cur_index] = -1;  	  					
        }
    	else{
    		page[cur_index]  = -1;
    	}
    	canMore[cur_index] = 1;	
}


function createHtml(dlist, cur_index) {
	switch(cur_index) {
		case 0:
              listArticle(dlist,"#"+item[cur_index]+"_list");
			break;
		case 1:
              listTopics(dlist,"#"+item[cur_index]+"_list");  			               	
			break;
		default:
			break;
		}
}

$(function(){
    $('.nav>a').click(function(){
        $this = $(this);
       
        //$('.section').hide();
        switch($this.data('id')){
            case 'a-section':
            	cur_index = 0;
            	break;
            case 't-section':
            	cur_index = 1;
            	break;
			default:
            	break;
        }           
        //$('.'+$this.data('id')).show();
        switchTab($this.data('id'));
    });
    
    $('#a_none').click(function(){
		gotoIndexTab('main','21c8cf');
		api.closeWin();
    });    

    $('#t_none').click(function(){
        api.execScript({
            name: 'root',
            frameName: 'topic',
            script: "showFollow();"
            });
        gotoIndexTab('topic','21c8cf');
		api.closeWin();
    }); 
        
});
function switchTab(tabName){
    $('#'+tabName).siblings().removeClass('nav-active');
    $('#'+tabName).addClass('nav-active');
    if(tabName == 'a-section'){
        $('.a-section').css('z-index','2').show();
        $('.t-section').css('z-index','1').hide();
        // setTimeout(function(){
        //     $('.t-section').hide().removeClass('animated slideInRight');
        // },2000);
        
    }else if(tabName == 't-section'){
        $('.a-section').css('z-index','1').hide();
        $('.t-section').css('z-index','2').show();
        // setTimeout(function(){
        //     $('.a-section').hide().removeClass('animated slideInLeft');
        // },2000);
        // $('.a-section').css('z-index','1');
        // $('.t-section').show().addClass('animated slideInRight').css('z-index','2');
    }
}

var item = new Array('a','t');
var url = new Array('my_favorite_topic_list.php','my_favorite_topic_list.php');
var page = new Array(1,1);	
var psize = new Array(5,5);	
var canMore = new Array(1,1);
var cur_index = 0;
var lastTime = 0; 
 
apiready = function () {
        isDev = false;
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
	        if (nowTime-lastTime > 300000) {		//5*60*1000 = 300000
	        	lastTime = nowTime;  	    	
				if (canMore[cur_index]) {
					page[cur_index] = 1;
					getData(cur_index);
				} 
			}	       
	        api.refreshHeaderLoadDone();
	    });
	  	getData(0);
	  	getData(1);
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
        api.addEventListener({
            name:'swiperight'
        },function(ret,err){
            switchTab('a-section');
        });
        api.addEventListener({
            name:'swipeleft'
        },function(ret,err){
            switchTab('t-section');
        });
};

