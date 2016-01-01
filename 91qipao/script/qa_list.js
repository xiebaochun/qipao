//每页显示数量
var PAGE_SIZE = 5;

$(function(){
    initDev();
});
apiready = function(){
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
    api_ajax(0,'index_ask_list.php',{
        fid: FID,
        page: page,
        psize: PAGE_SIZE,
        t:T_INDEX
    },
    function(ret){
        if(page == 1){
            $('#main').empty();
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
        listQA(ret.data.topics.tlist,'#main');
        getDataCallback();
        
    }
}