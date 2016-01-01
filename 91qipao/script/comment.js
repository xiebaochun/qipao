function  getCommentHtml(ret) {
    var uid = $api.getStorage('uid');
    var commentHtml = '';
    for(var index in ret.commentlist){
        var comment = ret.commentlist[index];
        
        var genderHtml = '';
        if(comment.sex == 0){
            genderHtml = '';
        }else if(comment.sex == 1){
            genderHtml = '<i class="gender-ico gender-male-ico fa fa-mars"></i>';
        }
        else if(comment.sex == 2){
            genderHtml = '<i class="gender-ico gender-female-ico fa fa-venus"></i>';
        }
        //点赞ico
       
        var dianzanIcoHtml = '<i class="reply-img fa fa-heart-o" style="margin-bottom:0px;vertical-align:middle;font-size: 0.8rem;color:#999;" onclick="dianzanToUser(this,event);"></i>';

        if($api.getStorage(comment.pid+''+uid) == 1){
            dianzanIcoHtml = '<i class="reply-img fa fa-heart" style="margin-bottom:0px;vertical-align:middle;font-size: 0.8rem;color:#ff6263;" onclick="dianzanToUser(this,event);"></i>';
        }

        //点赞数
        if(comment.recommend_add>99){
            comment.recommend_add = '99+';
        }  
        var subCommentHtml = '<div class="sub-comment">';

       for(var sindex in comment.subcommentlist){
            var subComment = comment.subcommentlist[sindex];
            subComment.content = transEmo(subComment.content);
            subComment.content = getCommentContent(subComment.content);

            var html = '<div class="sub-comment-item">'+
                            '<span class="sub-comment-username" onclick="openUserSpace('+subComment.authorid+',event);">'+subComment.nickname+'</span>:&nbsp;'+    
                            '<span class="sub-comment-content">'+subComment.content+'</span>'+
                        '</div>';
            subCommentHtml += html;
            if(sindex>1){
                break;
            }
        }
       
       if(comment.subcommentlist.length<1){
            subCommentHtml = '';
        }else if(comment.subcommentlist.length>2){
            subCommentHtml+='<div class="checkmore-subcomment">查看更多'+comment.subcommentlist.length+'条回复<i class="fa fa-angle-down"></i></div></div>';
        } else{
            subCommentHtml+='</div>';
        }         

        comment.content = transEmo(comment.content);
        comment.content = getCommentContent(comment.content);

        var html = '<div class="comment-item" data-pid="'+comment.pid+'" onclick="replyToUser(this);">'+
                        '<div class="comment-item-header">'+
                            
                            '<img class="default-avator user-avator" src="'+comment.authorimage+'" width="30px" onclick="openUserSpace('+comment.authorid+',event);"/>  '+
                            
                            '<div class="author-info-box">'+
                                '<span class="nick-name" onclick="openUserSpace('+comment.authorid+',event);">'+comment.nickname+'</span>'+genderHtml+'<br>'+
                                '<span class="create-time"><span class="floor-index">'+comment.position+'F</span>&nbsp;'+comment.createdate+'</span>'+
                                '<div id="comment_uid" style="display:none;">'+comment.authorid+'</div>'+
                                '<div id="comment_nick" style="display:none;">'+comment.nickname+'</div>'+                                                      
                            '</div>'+
                            '<div class="reply-bt">'+dianzanIcoHtml+'<span class="dianzan-count color-999" onclick="dianzanToUser(this,event);">'+comment.recommend_add+'</span><img class="reply-img reply-to-user ml10" style="width:18px;height:18px;margin-bottom:0px;vertical-align:middle;" data-position="'+comment.position+'" src="../image/comment_ico.png" data-authorid="'+comment.authorid+'"><span class="color-999" style="margin-right:0rem !important;">'+comment.subcommentlist.length+'</span>'+
                             '</div>'+
                        '</div>'+
                        '<div class="comment-item-body">'+
                            '<ul id="reply-content-list">'+
                                '<li class="reply-content-item">'+comment.content+'</li>'+
                            '</ul>'+
                        '</div>'+
                            subCommentHtml +
                    '</div>';
        commentHtml += html;
        //alert('subCommentHtml');
    }
    
    return commentHtml;
}
function dianzanToUser(dianzan_dom,e){
    if(e){e.cancelBubble = true;}
    var comment_item = $(dianzan_dom).parent().parent().parent();
    var pid = comment_item.data('pid');
    
    //var uid = $api.getStorage('uid');
    //console.log(uid);

    //播放点赞动画
    playHeart();
    
    var others = {
        pid:pid,
        dianzan_dom:dianzan_dom
        };
    api_ajax(2,
        'topic_comment_recommend.php',
        {pid:pid},    
        function(ret, _, _ ,others){
            if (ret.code == 988) {
                return;
            }
            //console.log(ret);
                var pid = others.pid;
                var dianzan_dom = others.dianzan_dom;
                var uid = $api.getStorage('uid');
                
                console.log(pid+''+uid);
                $api.setStorage(pid+''+uid,1);
                if($(dianzan_dom).hasClass('fa-heart-o')){
                    $(dianzan_dom).addClass('fa-heart').removeClass('fa-heart-o').css('color','#ff6263');    
                }
                var $dianzan_count = $(dianzan_dom).next('span');
                if($dianzan_count.length<1){
                    $dianzan_count = $(dianzan_dom);
                }
                var current_count = parseInt($dianzan_count.text());
                    current_count++;
                    if(current_count>99){
                        current_count = 99+'+';
                    }
                $dianzan_count.text(current_count);
        },
        others,
    0);
}