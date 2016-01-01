
this.UI = this.UI||{};

(function($){

    if(typeof $ == 'undefined'){
        console.log('模块需要依赖juqery，请添加jquery的引用。');
        return false;
    }

    //var UI = UI || {};

    var self = null;

    var $imgList = null;
    var imgInputIndex = 1;

    var module = function(options){
        var defaultOptions = {
            imageListWrap:'.img-list',
            //imgHolder:''
            imgFileInput:'.img-file-input',

        }
        this.option = $.extend({},defaultOptions,options);

        $imgList = $(this.option.imageListWrap);

        if($imgList.length<1) console.error('Please setup img list wrap correctly! From ui.imageUploader.');

        this.init();
    }
    var p = module.prototype;

    p.sayOption = function(){
        console.log(this.option);
    }

    p.init = function(){
        //var html = 
        self = this;
        self.createImgHtml();
    }

    p.createImgHtml = function(){
        var html =  '<div class="image-wrap">'+
                        '<div class="image-file-wrap">'+
                            '<span class="plus">+</span>'+
                            '<input class="image-file" id="img-input-'+imgInputIndex+'" type="file">'+  
                        '</div>'+
                    '</div>';

        $imgList.append($(html));

        self.addInputChangeEvent('img-input-'+imgInputIndex);

        console.log($imgList);
    }

    p.addInputChangeEvent = function(inputSelector){
        var fileInput = document.getElementById(inputSelector);
        fileInput.addEventListener('change',function(event){
            //console.log($input[0]);
           var file = fileInput.files[0];
            console.log(file);
            if (file) {
                var reader = new FileReader();
                reader.onload = function() {
                    //处理 android 4.1 兼容问题
                    var base64 = reader.result.split(',')[1];
                    // console.log(base64);
                    var dataUrl = 'data:image/png;base64,' + base64;
                    //
                    console.log(dataUrl);
                    //placeholder.style.backgroundImage = 'url(' + dataUrl + ')';
                    //placeholder.setAttribute('data-base64', dataUrl);
                }
                reader.readAsDataURL(file);
                //placeholder.classList.remove('space');

                if($('.image-file').length<6){
                    //ui.newPlaceholder();
                }
            }
        },false);
    }

    UI.imgUploader = module;

})(jQuery);