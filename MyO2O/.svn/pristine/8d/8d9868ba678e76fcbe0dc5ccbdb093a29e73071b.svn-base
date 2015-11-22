(function(mui, window, document, undefined) {
    mui.init();
    var get = function(id) {
        return document.getElementById(id);
    };
    var qsa = function(sel) {
        return [].slice.call(document.querySelectorAll(sel));
    };
    var ui = {
        question: get('content'),
        title:get('title'),
        imageList: get('image-list'),
        submit: get('submit')
    };
    ui.clearForm = function() {
        ui.question.value = '';
        ui.title.value = '';
        ui.imageList.innerHTML = '';
        ui.newPlaceholder();
    };
    ui.getFileInputArray = function() {
        return [].slice.call(ui.imageList.querySelectorAll('input[type="file"]'));
    };
    ui.getFileInputIdArray = function() {
        var fileInputArray = ui.getFileInputArray();
        var idArray = [];
        fileInputArray.forEach(function(fileInput) {
            if (fileInput.value != '') {
                idArray.push(fileInput.getAttribute('id'));
            }
        });
        return idArray;
    };
    var imageIndexIdNum = 0;
    ui.newPlaceholder = function() {
        var fileInputArray = ui.getFileInputArray();
        if (fileInputArray &&
            fileInputArray.length > 0 &&
            fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
            return;
        }
        imageIndexIdNum++;
        var placeholder = document.createElement('div');
        placeholder.setAttribute('class', 'image-item space');
        var closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'image-close');
        closeButton.innerHTML = 'X';
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            event.cancelBubble = true;
            setTimeout(function() {
                ui.imageList.removeChild(placeholder);
            }, 0);
            return false;
        }, false);
        var fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/*');
        fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
        fileInput.addEventListener('change', function(event) {
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
                    placeholder.style.backgroundImage = 'url(' + dataUrl + ')';
                    placeholder.setAttribute('data-base64', dataUrl);
                }
                reader.readAsDataURL(file);
                placeholder.classList.remove('space');

                if($('.image-item').length<6){
                    ui.newPlaceholder();
                }
            }
        }, false);
        placeholder.appendChild(closeButton);
        placeholder.appendChild(fileInput);
        ui.imageList.appendChild(placeholder);
    };
    ui.newPlaceholder();
    ui.submit.addEventListener('click', function(event) {
        if (ui.question.value == ''){
            return mui.toast('请填写信息');
        } 
        //plus.nativeUI.showWaiting();
        // feedback.send({
        //     content: ui.question.value,
        //     images: ui.getFileInputIdArray()
        // }, function() {
        //     //plus.nativeUI.closeWaiting();
        //     mui.toast('感谢您的发表~');
        //     ui.clearForm();
        //     mui.back();
        // });
        var imageArray = ui.getFileInputIdArray();
        var images = [];
        for(var index in imageArray){
            var baseUrl = $('#'+imageArray[index]).parent().data('base64'); 
            images[index] = baseUrl;
        }

        var imageLength = images.length; 
        var image_files = [];
        
        function sentImage(index){
            var index = index;
            var postData = {
                            fid:fid,
                            uid:uid,
                            images:images[index]
                        };
              api_ajax(2,
              	'util_upload_img.php',
              	postData,
                function(ret, _, postData, index){
                    console.log(ret);
                    if(ret.code == 100){
                     	image_files[image_files.length] = ret.img;
						index++;
                        if(index<imageLength){
                            sentImage(index);
                        }else{
                            sentMessage();
                        }
                    }
                    //1mui.toast('感谢您的发表~');
                },
                index,
                2);
        }
        function sentMessage(){   
            var postData = {
            
                        fid:fid,
                        uid:uid,
                        message:ui.question.value,
                        images:image_files
                    };
            api_ajax(2,
            	'topic_newthread_add.php',
            	postData,
            	function(ret, _, _, _){
        			if (ret.code ==100 ){
            			console.log(ret);
            			myToast('发表成功！');
                        api.execScript({
                            name:'topic-circle',
                            frameName:'topic-circlecon',
                            script:'openNew();'
                        });
                        setTimeout(function(){
                            api.closeWin();
                        },500);
            		} else {
            			alert(ret.code + "/" + ret.msg);	
            		}
                 	
            	},
            	0,
            	0);
        }
        if(imageLength>0){
            sentImage(0);
        }else{
            sentMessage();
        }
       	
        //console.log(images[0]); 
    }, false);
})(mui, window, document, undefined);