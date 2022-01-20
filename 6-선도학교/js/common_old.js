(function($) {
    $(document).ready(function(){
        $("[data-type='dropDown'] a").on({
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
    })
})(jQuery);