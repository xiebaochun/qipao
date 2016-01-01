/*
    内容数据加载公共部分
*/
var total_page, current_page = 1, isLoadding = false;
var loader = null;

function addMoreEvent(){

    loader = new UI.loader({holder:'#main'});

    api.addEventListener({
        name: 'scrolltobottom',
        extra:{
            threshold:200
        }
    }, function (ret, err) {            
        if (!isLoadding  && current_page < total_page)
        {   
            loader.show();
            isLoadding = true;
            current_page++;
            getData(current_page,getDataSuccess);
        }else if(current_page >= total_page && total_page > 1){
            loader.setNoMore();
        }   
    });  
}
function addRefresh(){
    api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: false
    }, function (ret, err) {
        api.hideProgress();
        getData(1);
        api.refreshHeaderLoadDone();
    });
}
function getDataSuccess(){
    isLoadding = false;
    loader.close();    
}