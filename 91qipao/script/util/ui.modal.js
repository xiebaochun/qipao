this.UI = this.UI||{};
(function($){

    if(typeof $ == 'undefined'){
        console.log('模块需要依赖juqery，请添加jquery的引用。');
        return false;
    }

    //var UI = UI || {};

    var self = null;

    var modal = function(options){
        var defaultOptions = {
            wrap_selector:'.modal-wrap',
            mask_selector:'.modal-mask',
            box_selector:'.modal',
            modalHtml:null,
            startClose: function(){},
            closed: function(){
                console.log("close");
            }
        }

        this.option = $.extend({},defaultOptions,options);

        this.init();
    }
    var p = modal.prototype;

    p.sayOption = function(){
        console.log(this.option);
    }

    p.init = function(){
        //var html = 
        self = this;

        this.wrap = $(this.option.wrap_selector);

        if(this.wrap.length <= 0){
            this.createModal();
            return false;
        }

        this.mask = $(this.option.mask_selector);

        this.box = $(this.option.box_selector);

        this.mask.bind('click',function(){
            self.close();
        });

        this.wrap.bind('touchmove',function(event){
            var e = event||window.event;
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble = true;
            }
            return 
        });


    }
    
    p.createModal = function(){

        var html =  '<div class="modal-wrap publish-modal" style="display:none;">'+
                         '<div class="modal-mask"></div>'+
                         '<div class="modal animated" style="display:none;">'+
                            '<div class="nav">'+
                                '<div class="nav-item">'+
                                    'option'+
                               ' </div>'+
                                '<div class="nav-item">'+
                                    'option'+
                                '</div>'+
                                '<div class="nav-item">'+
                                    'option'+
                                '</div>'+
                           ' </div>'+
                         '</div>'+
                     '</div>';
                     
        if(self.option.modalHtml){
            html = self.option.modalHtml;
        }
        $('body').append($(html));
        this.init();
    }

    p.show = function(){
        this.wrap.addClass('fadein').show();
        this.box.addClass('popup').show();
        this.mask.fadeIn(50);
        $('body').css({'overflow':'hidden'});
    }

    p.close = function(){
        $('.publish-modal').removeClass('fadein').addClass('fadeout');
        $('.modal').removeClass('popup').addClass('hide');
        this.mask.fadeOut();
        self.option.startClose();
        setTimeout(function(){
            self.box.removeClass('hide').hide();
            self.wrap.removeClass('fadeout').hide();
            //self.option.wrap_selector.hide();
            self.option.closed();
            $('body').css({'overflow':'scroll'});
        },200);
    }

    UI.modal = modal;
})(jQuery);