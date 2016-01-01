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
            moduleSelector:'',
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
    }

    p.createModule = function(){

    }

    UI.selector = module;

})(jQuery);