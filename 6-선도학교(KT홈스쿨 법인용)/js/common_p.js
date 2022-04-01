(function($) {
    $(document).ready(function(){
        /*$("[data-type='dropDown'] a").on({
            click:function(e){
                var currentTarget = e.currentTarget || null;;
                var $parent;
                var isOpen;
                
                if( currentTarget != null){
                    $parent = $(currentTarget).parent();
                    isOpen = $parent.hasClass('open')

                    if(isOpen){
                        $(currentTarget).addClass('active').siblings().removeClass('active');
                        $parent.removeClass('open');
                    }else{
                        $("[data-type='dropDown']").removeClass('open');
                        $parent.addClass('open');
                    }
                }
            }
        });
*/
        $("[data-type='loginDropDown'] a").on({
            click:function(e){
                if($(e.target).hasClass('value')){
                    $(this).next().show();
                }else{
                    var txt = $(this).text();
                    $(this).parents('.com_loginDropDown_inner_wrap').prev('.value').addClass('active').text(txt);
                    $(this).parents('.com_loginDropDown_inner_wrap').hide();
                }
            }
        });

        $("[data-type='radio'] a").on({
            click:function(e){
                $(e.currentTarget).addClass('active').siblings().removeClass('active');
            }
        });

        $("[data-type='termsAllCheck'] input[type='checkbox']").on({
            change:function(e){
                var $target = $(e.target);
                var isChecked = $target.is(':checked');

                $("[data-type='termsCheck']").find("input[type='checkbox']").prop('checked', isChecked);
            }
        });
        

        $("[data-type='termsCheck'] input[type='checkbox']").on({
            change:function(e){
                var $target = $(e.target);
                var isChecked = $target.is(':checked');
                var totalLenCheck = $target.parents("[data-type='termsCheck']").find("[data-type='check']").length;
                var checkLen = $target.parents("[data-type='termsCheck']").find("[data-type='check']").children("input[type='checkbox']:checked").length;

                isChecked = (totalLenCheck == checkLen)?true:false;
                $("[data-type='termsAllCheck']").children("input[type='checkbox']").prop('checked', isChecked);
            }
        });

	   $("[data-type='tab'] a").on({
            click:function(e){
                var $target = $(e.target);
                var idx = $target.parent('li').index();

                $target.parent('li').addClass('active').siblings().removeClass('active');
                $target.parents('ul').next().find('li').eq(idx).addClass('active').siblings().removeClass('active')
            }
        });

       /* $.fn.openPopup = function(_targetId){
            var target = $("#" + _targetId);

            $('.popup_wrap').css({'display':'flex'});
            
            target.fadeIn(function(){
                if(!$(this).hasClass('popup_loading')){
                    $('.popup_wrap').off('click').on({
                        click:function(e){
                            if(e.target === e.currentTarget){
                                $.fn.closePopup(_targetId);
                            }else{
                            };
                        }
                    });
                }
            });
        }

        $.fn.closePopup = function( _targetId ){
            var target = $("#" + _targetId);

            $('.popup_wrap').fadeOut();
            target.fadeOut();
        }

        $.fn.setCalendar = function( _target, obj ){
            var obj = obj;
            var activeIdx = obj.activeIdx;

            $('.' + _target).find('.btn_day').each(function(idx){
                $(this).attr('data-date',   obj.month[idx] + '월 ' + obj.date[idx] + '일');

                if(idx == activeIdx){
                    $(this).addClass('active');
                }else{
                    $(this).removeClass('active');
                }
            });

        }*/
    })
})(jQuery);