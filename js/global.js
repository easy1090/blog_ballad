;(function($){
	var Global = {
	section_name:[],
	isScrolling:true,
	section_num:1
};
//重新计算元素位置
Global.reCal = function(){

    //居中加载动画
    (function centerLoading() {
        if ( !$('body').hasClass('finish-loading') ) {
            var topOffset = ( $(window).height() - 175 ) / 2  ,
                leftOffset = ( $(window).width() - $('loading').width() ) / 2 - 60;

            $('.loading').css({
                top: topOffset,
                left: leftOffset,
                right: 'auto',
                bottom: 'auto'
            });
        }
    })();
    $('.section-wrap').each(function(index,el){
    	Global.section_name[index] = $(this).attr('class').substr($(this).attr('class').indexOf('section-wrap')+13);
    	$(this).find('.section').height($(window).height());
    })
    $('.section-content').each(function(){
    	$(this).css({
    		marginTop:($(window).height()-40-$(this).height())/2
    	});
    });

   

};

Global.fadeInByOrder = function(selector,interval,callback){
	var i=1,
		length = $(selector+' .fade').length+1,
		intervala=interval||100,
		callbacka=callback||function () {
			// body...
			return;
		};
	(function fadeInIt(){
		if (i<length) {
			$(selector+' .fade'+i).addClass('fade-in');
			i++;
			setTimeout(fadeInIt,intervala);
			if(i===length){
				callbacka();
			}
		}
	}

	)();
};

Global.handleTouchEvent = function(event){
    if (event.touches.length == 1) {

        var touchStartY,
            touchMoveY;

        switch (event.type) {
            case "touchstart":
                touchStartY =  event.touches[0].clientY;
                break;
            case "touchmove":
                touchMoveY  =  event.changedTouches[0].clientY;
                break;
        }
        Global.scrollHandle( touchStartY > touchMoveY ? true : false );

    }
    event.preventDefault();
};
Global.fixedbg = function(){
    var slide_rate = 1000 / 667,
        window_rate;
    (function(){
        window_rate = $(window).width() / $(window).height();
        if ( window_rate < slide_rate ) {
            $('.home-bg img').css({height:$(window).height()+'px',width:($(window).height()*slide_rate)+'px','margin-left':'-'+($(window).height()*slide_rate-$(window).width())/2+'px'});
        }else{
            $('.home-bg img').css({height:($(window).width()/slide_rate)+'px',width:$(window).width()+'px','margin-left':0});
        }
    })();
};


Global.scrollHandle=function(scrollDown){
	if(!Global.isScrolling){
		Global.isScrolling=true;
		var targetScrollTopValue = scrollDown?Global.targetScrollTop(++Global.section_num):Global.targetScrollTop(--Global.section_num);

		if(scrollDown){
			if (Global.section_num>1) {
				Global.shrinkHeader(true);
			}
		}else{
			if (Global.section_num==1) {
				Global.shrinkHeader(false);
			}
		}

		$('html,body').animate({scrollTop:targetScrollTopValue},600,function () {

			// body...
			Global.isScrolling=false;

		});

		Global.fire_nav(Global.section_num);
	}
};


Global.targetScrollTop=function(n){
	if(n>Global.section_name.length){
		Global.section_num=Global.section_name.length;
	}
	if (n<1) {
		Global.section_num=1;
	}
	return ($(window).height()*(Global.section_num-1));
}

Global.fire_nav = function(theNav){
    $('.nav .fade').removeClass('hover');
    switch(theNav){
        case 2:
            $('.nav .fade1').addClass('hover');
            break;
        case 3:
            $('.nav .fade2').addClass('hover');
            break;
        case 4:
            $('.nav .fade3').addClass('hover');
            break;
        case 5:
            $('.nav .fade4').addClass('hover');
            break;
    }
};
Global.throttle=function(fn,delay){
	var timer = null;
	return function(){
		var context = this,args=arguments;
		clearTimeout(timer);
		timer=setTimeout(function(){
			fn.apply(context,args);
		},delay);
	};
};
Global.shrinkHeader = function(doShrink){//首页翻到下一区块或者回到首页时导航条的动态变化。
    if (doShrink) {

        $('.section-header').addClass('shrink');
    }else{
        $('.section-header').removeClass('shrink');
    }
};

window.onscroll=Global.throttle(function(){
	$('body').removeClass('finish-loading');
	
	var fadeIntarget;
	switch(Global.section_num){
		case 1:
		fadeIntarget='.section-firstpage';
		$('body').addClass('finish-loading');

		break;
		case 2:
		fadeIntarget='.about-content';
	
		break;
		case 3:
		fadeIntarget='.china-content';

		break;
		case 4:
		fadeIntarget='.foreign-content';
		
		break;
		case 5:
		fadeIntarget='.contact-content';
		
		break;


	}
	Global.fadeInByOrder(fadeIntarget,200);

},50);
$(document).swipe(
 {
 swipe:function(event, direction, distance, duration, fingerCount) {
 if(direction == "up"){
  Global.scrollHandle(false);
 }else if(direction == "down"){
Global.scrollHandle(true);
 }

}});

$(document).on('mousewheel DOMMouseScroll', function(e){
    var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail,
        isMouseScrollDown = delta < 0 ? true : false;

    //处理好上下元素数组，开始滚动
    if (isMouseScrollDown) { //鼠标向下滚动

        Global.scrollHandle(true);

    }else{

        Global.scrollHandle(false);

    }

    e.preventDefault();
});
$(document).swipe(
 {
 swipe:function(event, direction, distance, duration, fingerCount) {
 if(direction == "up"){
  Global.scrollHandle(true);
 }else if(direction == "down"){
Global.scrollHandle(false);
 }

}});
$(document).ready(function(){
	$('a[href="#"]').click(function (e) {
		// body...
		e.preventDefault();
		return false;
	})
	Global.reCal();
	Global.fixedbg();
	$('.nav a').click(function(e){
		var target=$(this).attr("href");
		switch(target){
			case '#top':
                target = 1;
                break;
            case '#firstpage':
                target = 2;
                break;
            case '#china':
                target = 3;
                break;
            case '#foreign':
                target = 4;
                break;
            case '#contact':
                target = 5;
                break;
		}
	Global.section_num = target;
        if ( target == 1 ) {
            Global.shrinkHeader(false);
            $('.nav .fade').removeClass('hover');//当从别的区块回到守夜时，把导航条其他标签的高亮去掉。
        }else{
            Global.fire_nav(target);
            Global.shrinkHeader(true);
        }
        $('body,html').animate({scrollTop:Global.targetScrollTop(target)},600,function(){
            
        });

        e.preventDefault(); return false;
    });

    $('.scroll-tip').click(function(event) {
        if (!Global.isScrolling) {
            Global.isScrolling = true;
            $('html,body').animate({scrollTop: Global.targetScrollTop(++Global.section_num)}, 400,function(){
                Global.isScrolling = false;
		$('.nav .fade1').addClass('hover');
            });
            if ( Global.section_num > 1 ) {
                Global.shrinkHeader(true);
            }
        }
    });


});

window.onresize = Global.throttle(function(){
        Global.reCal();
        Global.fixedbg();
    },50);
$(window).load(function(){
	Global.fixedbg();
	Global.reCal();
	 $('html,body').animate({scrollTop:0}, 100);

	Global.isScrolling = false;
	(function load_init(){
	
	$("body").addClass('finish-loading');
	
	$('.finish-loading .loading').animate({top:"20px"},1000,function(){
		$('.back-home').css('opacity',0.8);
		$('.home-bg .fade').addClass('fade-in');
		$('.loading').remove();
	});

	setTimeout(function(){
		$('body').removeClass('loading-process');
	},600);
	Global.fadeInByOrder('.nav',100,function(){
		Global.fadeInByOrder('.section-firstpage',300);
	});
	})();
});





})(jQuery);
