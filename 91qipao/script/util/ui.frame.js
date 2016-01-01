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
            moduleName:''
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
        //createModule();

        //$api.setStorage('pop-frame-option',{})

        self.setUp({});

    }

    p.setUp =function(option){
        var _option = option || {};
        //alert(_option);
        $api.setStorage('pop-frame-option',_option);

        api.execScript({
            name:'root',
            frameName:'pop-frame',
            script:'setUp(\''+self.option.moduleName+'\')'
        });
    }

    p.update = function(option){

    }

    p.createModule = function(){
        // api.openFrame({
        //     name:'pop-frame',
        //     url:'component/pop-frame.html',
        //     reload: false,
        //     rect:{
        //         x:0,
        //         y:0,
        //         h:api.winheight,
        //         w:api.winWidth
        //     }
        // });
        // self.close();
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
        //self.setUp();
    }
    UI.loader = module;
    window.moduleOut = UI.loader; 
})(jQuery);