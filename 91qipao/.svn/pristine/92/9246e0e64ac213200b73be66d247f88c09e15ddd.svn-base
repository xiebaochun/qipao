(function($){

    if(typeof $ == 'undefined'){
        console.log('模块需要依赖juqery，请添加jquery的引用。');
        return false;
    }

    var QIPAO = QIPAO || {};

    var self = null;
    var option = null;
    var current_page = 1;
    var total_page = 0;
    var isLoading = false;
    var loader = null;
    var postData = null;
    var isLoadding = false;

    var module = function(options){
        var defaultOptions = {
            api_file:'',
            postData:{},
            holder:'',
            listF:function(){},
            none:{
                txt:'啥都没有',
                btTxt:'马上去...',
                to:'',
                clickCallBack:null
            },
            noneCallBack:function(){},
            haveCallBack:function(){}
        }

        this.option = $.extend({},defaultOptions,options);

        option = this.option;
        postData = option.postData;
        this.init();
    }
    var p = module.prototype;

    p.sayOption = function(){
        console.log(this.option);
    }

    p.init = function(){
        //var html = 
        self = this;
        self.getData(1);

        if(typeof addMoreEvent !== 'undefined'){    
            addMoreEvent();
        }
        if(typeof addRefresh !== 'undefined'){    
            addRefresh();
        }


    }
    p.getData = function(page){
        var progress = page == 1?1:0;
        postData.page = page;
        api_ajax(0,option.api_file,postData,
        function(ret){
            if(page == 1 && ret.code == 100){
                $(option.holder).empty();
                option.haveCallBack(ret);
            }else{
                option.noneCallBack(ret.msg);
            }
            self.afterData(ret);
        },
        null,progress);
    }

    p.afterData = function(ret){
        console.log(ret);
        if(ret.code == 100){
            try{
                ret.data.topics = ret.data.topics || ret.data.info;
                total_page = ret.data.topics.pageinfo.totalpage;
                current_page = ret.data.topics.pageinfo.curpage;
            }catch(e){
                console.log(e);
            }
            option.listF(ret.data.topics.tlist||ret.data.info.list,option.holder);
            isLoadding = false;
            loader.close();    
        }else if(ret.code == 101){
            self.showNoneResult();
        }else{
            myToast(ret.msg);
        }   

    }

    p.showNoneResult = function(){
        var html =  '<div class="tc">'+
                        '<img style="width:5rem;margin-top:5rem;" src="../image/dongtai_none_express.png" alt=""><br>'+
                        '<div class="f6 color-999" style="margin-top:0.3rem;">'+option.none.txt+'</div>'+
                        '<a class="btn" id="none-bt" style="margin-top:2rem;line-height:1.8rem;">'+option.none.btTxt+'</a>'+
                    '</div>';
         $(option.holder).html($(html));
         $('#none-bt').click(function(){
            if(option.none.clickCallBack){
                option.none.clickCallBack();
            }else{
                openWin(option.none.to);
            }
         });
    }

    function addMoreEvent(){
        require('util/ui.loader',function(){
            loader = new UI.loader({holder:'body'});
        });
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
                self.getData(current_page);
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
            self.getData(1);
            api.refreshHeaderLoadDone();
        });

    }

    QIPAO.list = module;
    window.QIPAO = QIPAO;
})(jQuery);