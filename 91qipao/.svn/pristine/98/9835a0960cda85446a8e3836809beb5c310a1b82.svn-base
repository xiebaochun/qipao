this.UI = this.UI||{};
(function($){

    if(typeof $ == 'undefined'){
        console.log('模块需要依赖juqery，请添加jquery的引用。');
        return false;
    }

    //var UI = UI || {};

    var self = null;

    var module = function(options){
        var defaultOptions = {
            wrap_selector:'#loader-wrap',
            holder:'body',
            startClose: function(){},
            closed: function(){
                console.log("close");
            }
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

        this.wrap = $(this.option.wrap_selector);

        if(this.wrap.length <= 0){
            this.createModal();
            return false;
        }
    }
 
    p.createModal = function(){
        var html =  '<div id="loader-wrap" style="display:none"><span class="loader loader-double">&nbsp;</span>玩命加载中...</div>';
        $(self.option.holder).append($(html));
        this.init();
    }

    p.show = function(){
        self.wrap.html('<span class="loader loader-double">&nbsp;</span>玩命加载中...');
        this.wrap.show();
    }

    p.close = function(){
        self.option.startClose();
        self.wrap.hide();
            //self.option.wrap_selector.hide();
        self.option.closed();  
    }
    p.setNoMore = function(){
        self.show();
        self.wrap.html('没有更多了');
       
    }
    UI.loader = module;

})(jQuery);