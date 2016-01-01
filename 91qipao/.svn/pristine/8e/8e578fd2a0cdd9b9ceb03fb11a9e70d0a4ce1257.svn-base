//每页显示数量
var PAGE_SIZE = 5;
var fid;
var bg_img;
$(function(){
    initDev();
});
apiready = function(){
    
    fid = api.pageParam.fid;
    if(!fid){
        fid = FID;
    }
    bg_img = api.pageParam.imgurl;
    if(bg_img){
        $('.banner-bg').attr('src',bg_img);
    }
    var $topic_content = $('.topic-wrap');
    var topic_item = $('.topic-item').html();
    //listActivity(null,'.topic-wrap');
    getData(1);

    if(typeof addMoreEvent !== 'undefined'){    
        addMoreEvent();
    }
    if(typeof addRefresh !== 'undefined'){    
        addRefresh();
    }
    
}
function getData(page,callback){
    if(callback){
        getDataCallback = callback;
    }
    var progress = page == 1?1:0;
    api_ajax(0,'index_subject.php',{
        fid: FID,
        page: page,
        psize: PAGE_SIZE
    },
    function(ret){
        if(page == 1){
            $('.topic-wrap').empty();
        }
        afterData(ret);
        
    },
    null,progress);
}
function afterData(ret){
    console.log(ret);
    if(ret.code == 100){
        try{
            total_page = ret.data.topics.pageinfo.totalpage;
            current_page = ret.data.topics.pageinfo.curpage;
        }catch(e){
            console.log(e);
        }
        listArticle(ret.data.topics.tlist,'.topic-wrap');
        getDataCallback();
    }
}