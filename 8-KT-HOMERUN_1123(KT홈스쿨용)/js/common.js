var initecoHost = (location.host.indexOf("dev") > -1)? "dev-stu.home-learn.com" : "www.home-learn.com" ;
document.write('<scri' + 'pt src="https://' + initecoHost + '/apps/ecoinit/fullscreen_enc.js"></scr' + 'ipt>');
window.addEventListener("DOMContentLoaded",function(e){try{initFullScreen({w:2000,h:1200,mode:0})}catch(e){console.log(e)}});

(function($) {
    $(document).ready(function(){
        $("[data-type='dropDown'] a").on({
            click:function(e){
                var currentTarget = e.currentTarget || null;;
                var $parent;
                var isOpen;
                var isSelect
                
                if( currentTarget != null){

                    if(!$(currentTarget).hasClass('select')){
                        $parent = $(currentTarget).parent();
                        isOpen = $parent.hasClass('open');

                        if(isOpen){
                            $(currentTarget).siblings('.select').text($(currentTarget).text())
                            $(currentTarget).addClass('active').siblings().removeClass('active');
                            
                            $parent.removeClass('open');
                        }else{
                            $("[data-type='dropDown']").removeClass('open');
                            $parent.addClass('open');
                        }
                    }else{
                        $parent = $(currentTarget).parent();
                        $parent.removeClass('open');
                    }
                }
            }
        });

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

        $.fn.openPopup = function(_targetId, _isBgEvent){
            var target = $("#" + _targetId);
            var isBgEvent = (_isBgEvent == false)?false:true;

            $('.popup_wrap').css({'display':'flex'});
            
            target.fadeIn(function(){
                if(isBgEvent){
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

        }
    })
})(jQuery);