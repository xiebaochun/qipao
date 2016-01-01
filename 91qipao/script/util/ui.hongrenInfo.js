this.UI = this.UI||{};

(function($){

    if(typeof $ == 'undefined'){
        console.log('模块需要依赖juqery，请添加jquery的引用。');
        return false;
    }

    //var UI = UI || {};

    var self = null;
    var module = null;
    var isFollowed = 0;

    var module = function(options){
        var defaultOptions = {
            moduleName:'',
            hongrenInfo:{}
        }

        this.option = $.extend({},defaultOptions,options);

        this.init();
    }
    var p = module.prototype;

    p.sayOption = function(){
        console.log(this.option);
    }

    p.init = function(){
        //var html = 
        self = this;
        var hongren = self.option.hongrenInfo;
        
        var followHtml = '<div class="nav-item hongren-nav"><span class="nav-bt" id="hongreninfo-follow-bt">+&nbsp;关注</span></div>';
        if(hongren.me_fav_ta){
            isFollowed = 1;
            followHtml = '<div class="nav-item hongren-nav"><span class="nav-bt bg-gray" id="hongreninfo-follow-bt">取消关注</span></div>';

        }else{
            isFollowed = 0;
        }
        //createModule();
        var css = '<style>'+
                    '.modal{background-color: transparent;margin-top: -7.5rem;}'+
                    '.hongren-wrap{min-height: 8rem;background-color:transparent;padding:0.5rem;}'+
                    '.hongren-info-content{position: relative; margin:0 2rem; background-color:rgba(0,0,0,1);border-radius: 0.5rem;overflow: hidden; padding:0.5rem;}'+
                    '.hongren-info-content>*{position:relative;z-index: 1;}'+
                    '.hongren-bg{ position: absolute;width: 100%;height: 100%;left:0;top:0;width:100%;height: 100%;background-image:url('+hongren.ui+'); background-position: center;background-size: cover;-webkit-filter:blur(20px);z-index: 0;border-radius: 0.5rem;opacity:0.6;}'+
                    '.hongren-nav{}'+
                    '.hongren-info-box{padding:0.5rem;text-align: center;}'+
                    '.hongren-avator{width:3rem;height:3rem;margin-bottom:0.3rem;}'+
                    '.hongren-resume{text-shadow:0 0 4px #999;}'+
                    '.nav-bt{display: inline-block;width: 2rem; background-color:#fdd600;line-height: 0.8rem;padding:0.3rem 0.9rem;border-radius:0.3rem;font-size: 0.5rem;}'+
                    '.icon-close{display: inline-block;position: absolute;top:-1rem;right:2.5rem;background-color: #eee;height: 1rem;width: 1rem;border-radius: 1rem;z-index: 5;line-height: 1.02rem;font-size: 0.4rem !important;}'+
                    '.icon-close:before{margin-left: 0.3rem;}'+
                  '</style>';
        var html = css+ '<div class="modal-wrap hongren-modal" style="display:none;">'+
                         '<div class="modal-mask"></div>'+
                         '<div class="modal animated"  style="display:none;">'+
                            '<div class="hongren-bg-wrap">'+
                                
                            '</div>'+
                            '<div class="hongren-wrap">'+
                                '<i class="iconfont icon-close"></i>'+
                                '<div class="hongren-info-content" onclick="stopEvent(event);">'+
                                    '<div class="hongren-bg"></div>'+
                                    '<div class="hongren-info-box">'+
                                    '<img class="item-avator hongren-avator" id="modal-hongren-avator" src="'+hongren.ui+'" alt="" onclick="openUserSpace_pop('+hongren.userid+');"><br>'+
                                        '<span class="f6 color-fff vm" id="modal-hongren-name">'+hongren.nickname+'</span><span class="level-wrap f3 vb">LV <span class="level f4 vm">8</span></span><br>'+
                                        '<span class="user-tag color-yellow f5" style="line-height:1rem;" id="modal-hongren-tag">'+hongren.tag+'</span>'+
                                    '</div>'+
                                    '<div class="nav" style="margin-top:0.5rem;">'+
                                        '<div class="nav-item hongren-nav"><span class="nav-bt" id="pm-bt"><i class="iconfont icon-email"></i>&nbsp;私信</span></div>'+
                                       followHtml +
                                    '</div>'+
                                    '<div class="hongren-resume color-fff" style="margin-top:0.5rem;padding:0.5rem;" id="modal-hongren-resume">'+hongren.brief+'</div>'+
                                    '<div class="tr"><span class="color-yellow f4" onclick="openUserSpace_pop('+hongren.userid+');">了解更多</span></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

        require('util/ui.modal',function(){
            modal = new UI.modal({
                modalHtml:html,
                closed:function(){
                    self.close();

                }

            });

            modal.show();
            $('.icon-close').click(function(){
                modal.close();
            });

            $('#pm-bt').click(function(){
                openPM_pop(hongren.userid,hongren.nickname);
                self.close();
                modal.close();
            });

            $('#hongreninfo-follow-bt').click(function(){
                var act = 'add';
                var ft = this;
                var sid = hongren.userid;
                if(isFollowed){
                    favoriteUser(sid,'cancel',function(){
                        myToast('取消关注成功!');
                        $(ft).text('+ 关注').removeClass('bg-gray');
                        isFollowed = false;
                    });
                }else{
                    favoriteUser(sid,'add',function(){
                        myToast('关注成功!');
                        $(ft).text('取消关注').addClass('bg-gray');
                        isFollowed = true;
                    });
                }
            });

            api_ajax(0, 
                'user_info_get.php', 
                {   
                    sid:hongren.userid
                }, 
                function(ret){
                    if(ret.code == 100){
                        $('.level').text(ret.data.lv);
                        if(ret.data.me_fav_ta){
                            $('#hongreninfo-follow-bt').text('取消关注').addClass('bg-gray');
                            isFollowed = true;
                        }
                    }
                },
                null,
                0
                ); 
        });



    }

    p.createModule = function(){
        
    }
    p.close = function(){
        api.sendFrameToBack({
            from:'pop-frame'
        });
        api.setFrameAttr({
            name:'pop-frame',
            hidden:true
        });
    }

    p.open = function(){
        api.bringFrameToFront({
            from:'pop-frame'
        });
        api.setFrameAttr({
            name:'pop-frame',
            hidden:false
        });
    }
    UI.loader = module;
    window.moduleOut = UI.loader; 
})(jQuery);