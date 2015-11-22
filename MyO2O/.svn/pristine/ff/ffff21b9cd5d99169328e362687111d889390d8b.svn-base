function openTopicFrame(name){
    api.openFrame({
                name : name,
                url : name + '.html',
                bounces : true,
                opaque : true,
                vScrollBarEnabled : false,
                pageParam : {
                    headerHeight : headerPos.h,
                    // tid : tid
                },
                rect : {
                    x : 0,
                    y : headerPos.h,
                    w : width,
                    h : height
                }
            });
}
function showFollow(){
    openTopicFrame('topicFollow');
    api.setFrameAttr({
        name : 'topicExplore',
        hidden : true
    });
     api.setFrameAttr({
        name : 'topicFollow',
        hidden : false
    });
    $('.header-bt').removeClass('top-nav-active');
    $('.header-follow').addClass('top-nav-active');
}

function showExplore(){
    api.setFrameAttr({
        name : 'topicExplore',
        hidden : false
    });
    // api.setFrameAttr({
    //     name : 'topicFollow',
    //     hidden : true
    // });
    api.closeFrame({
        name: 'topicFollow'
    });
    //openTopicFrame('topicExplore');
    $('.header-bt').removeClass('top-nav-active');
    $('.header-explore').addClass('top-nav-active');
}

function hideExplore(){
    api.setFrameAttr({
        name : 'topicExplore',
        hidden : true
    });
}
function hideFollow(){
    api.setFrameAttr({
        name : 'topicFollow',
        hidden : true
    });
}
var width,header,headerPos,height,nav,navPos;

apiready = function () {
    //updateForumsAllread();
    //getBanner(api.pageParam.tid);
    //initPage(api.pageParam.tid);

    //pull to refresh
    // api.setRefreshHeaderInfo({
    //     visible: true,
    //     // loadingImgae: 'wgt://image/refresh-white.png',
    //     bgColor: '#f2f2f2',
    //     textColor: '#4d4d4d',
    //     textDown: '下拉刷新...',
    //     textUp: '松开刷新...',
    //     showTime: true
    // }, function (ret, err) {
    //     getBanner(api.pageParam.tid);
    //     initPage(api.pageParam.tid);
    //     api.refreshHeaderLoadDone();
    // });
    // api.addEventListener({
    //     name: 'scrolltobottom'
    // }, function (ret, err) {
    //     //getBanner(api.pageParam.tid);
    //     //initPage(api.pageParam.tid);
    // });
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
    width = api.winWidth;
    navHeight = api.pageParam.navHeight;
    // nav = $api.byId('nav');
    // navPos = $api.offset(nav);
    headerPos = $api.offset(header);
    height = api.winHeight - headerPos.h-navHeight+3;

    openTopicFrame('topicExplore');
    $('.header-explore').addClass('top-nav-active');
    $('.header-follow').click(function(){
        showFollow();
    });
    $('.header-explore').click(function(){
        showExplore();
    });

};