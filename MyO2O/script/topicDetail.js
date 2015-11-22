var inputWrap = $api.domAll('.input-wrap');
var shareBox = $api.dom('#share-pop-box');
var i = 0,
    len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function(txt, del) {
        $api.addEvt(txt, 'focus', function() {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function() {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}
var uid = '';
var tid = '';
var isCollected = false;

function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}
apiready = function() {
    isDev = false;
    var header = $api.byId('header');
    $api.fixIos7Bar(header);

    var id = api.pageParam.id;
    tid = id;
    var fid = api.pageParam.fid;
    var imgUrl = api.pageParam.imgUrl;
    var topicType = api.pageParam.topicType;
    var width = api.winWidth;
    // var comment = $api.byId('comment');
    // var commentPos = $api.offset(comment);
    var header = $api.byId('header');
    var headerPos = $api.offset(header);
    var height = api.winHeight - headerPos.h-51;

    api.openFrame({
        name: 'topicDetailCon-'+tid,
        url: 'topicDetailCon.html',
        pageParam: {
            id: id,
            fid:fid,
            topicType:topicType,
            imgUrl:imgUrl
        },
        rect: {
            x: 0,
            y: headerPos.h,
            w: width,
            h: height
        },
        reload: false,
        bounces: false,
        opaque: true,
        vScrollBarEnabled: false,
        softInputMode: 'resize'
    });
    // api.openFrame({
    //     name: 'topicDetailFooter',
    //     url: 'topicDetailFooter.html',
    //     pageParam: {
    //         id: id,
    //         fid:fid
    //     },
    //     rect: {
    //         x: 0,
    //         y: headerPos.h,
    //         w: width,
    //         h: 53
    //     },
    //     reload: false,
    //     bounces: false,
    //     opaque: false,
    //     vScrollBarEnabled: false,
    //     softInputMode: 'resize'
    // });
    init();
    
    closeWinAboutLogin();
};

function init(){
    $('.collect').click(function(){
        // if($(this).hasClass('.collect-selected')){

        // }
        var self = $('.collect-ico')
        uid = $api.getStorage('uid');
        var act = 'add';

        if(tid == ''){
            tid = '6266';
        }

        if(isCollected){
            act = 'cancel';
        }else{
            // api.execScript({
            //     frameName:'topicDetailCon-'+tid,
            //     script:'detailPlayStar()'
            // });
        }
        var ajaxUrl = 'my_favorite_topic_set.php';

        api_ajax(0,ajaxUrl,{
            uid:uid,
            tid:tid,
            act:act
        },
        function(ret){
            if (ret){
                console.log(ret);
                if(ret.code == 100||ret.code == 102){
                    //setCollected(true);
                    isCollected = !isCollected;
                    if(isCollected){
                        //myToast('收藏成功！');
                        api.execScript({
                            frameName:'topicDetailCon-'+tid,
                            script:'detailPlayStar()'
                        });
                    }else{
                        myToast('已取消收藏！');
                    }
                    //myToast(ret.msg);
                    $(self).toggleClass('collect-active-ico');
                }else if(ret.code = 104){
                    myToast(ret.msg);
                }else{
                    myToast(ret.msg);
                }
                
            } else {
                myToast(ret.msg);        
            }
        },null);
    });
    $('.share-bt').click(function(){
        popShareBox();
    });
    $('.recommend').click(function(){
        //alert('recommend');
        api.execScript({
            frameName:'topicDetailCon-'+tid,
            script:'clickZan();'
        });
    });
    $('.comment').click(function(){
        api.execScript({
            frameName:'topicDetailCon-'+tid,
            script:'openAllComments();'
        });
    });
}

function setCommentCount(count){
    $('#topic-comment-count').text(count);
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
        bgColor:'rgba(0,0,0,0)',
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight
        }
    });
}
function setDianzanCount(count){
    $('#topic-dianzan-count').text(count);
}
function setDianzan(){
    $('.recommend-ico').addClass('recommend-active-ico');
}
function setCollected(bool){
    //$('.collect-bt').show();
    //alert('setCollected:'+bool);
    isCollected = bool;
    if(isCollected){
        $('.collect-ico').addClass('collect-active-ico');
    }
}
function showFooter(){
    $('#topicDetail-footer').show();
}
$(function(){
    initDev();
}); 