
//#region "Defaults"

var koAnimate =
{
    defaults:
    {
        hoverScale:
        {
            duration: 250,
            scaleOut: 1.0,
            durationOut: 100,
            durationFinal: 100,
            easing: 'ease-in',
            easingOut: 'ease-out'
        },
        
        hoverRotate:
        {
            degrees: 30,
            duration: 250,
            degreesOut: 0,
            durationOut: 100,
            easing: 'ease-in',
            easingOut: 'ease-out'
        },
        
        fadeVisible:
        {
            duration: 500,
            durationOut: 500,
            easing: 'ease-in',
            easingOut: 'ease-out',
            delay: 50,
            delayOut: 0
        },
        
        scaleVisible:
        {
            scale: 1.0,
            scaleHide: 0,
            scaleHideOut: 0,
            duration: 500,
            durationOut: 500,
            easing: 'ease-in',
            easingOut: 'ease-out',
            delay: 50,
            delayOut: 0
        },
        
        slideVisible:
        {
            duration: 500,
            durationOut: 500,
            direction: 'left',
            directionOut: 'left',
            easing: 'ease-in',
            easingOut: 'ease-out',
            delay: 50,
            delayOut: 50
        },
        
        cssAnimate:
        {
            animation: 'tada',
            event: 'click',
            duration: 1000,
            callback: null
        },
        
        cssAnimateVisible:
        {
            animation: 'bounceIn',
            animationOut: 'bounceOut',
            duration: 1000,
            durationOut: 1000,
            delay: 1,
            delayOut: 1
        },


        cssAnimateReveal:
        {
            animation: 'bounceIn',
            duration: 1000,
            offset: 0,
            callback: null,
            delay: 1
        }
        
    }

};


//#endregion "Defaults"

//#region "Helpers"

koAnimate.helpers =
{
    cssVendors: ['-webkit-', '-moz-', '-o-,', '-ms-', ''],

    getDirectionX: function(direction)
    {
        switch (direction)
        {
            case "left":
                return "-2000px";
            case "right":
                return "2000px";
            default:
                return '0px';
        }
    },

    getDirectionY: function(direction)
    {
        switch (direction)
        {
            case "top":
                return "-2000px";
            case "bottom":
                return "2000px";
            default:
                return '0px';
        }
    },

    isElementInViewport: function(element, offset)
    {
        var rectangle = element.getBoundingClientRect();

        return (
            rectangle.top >= 0 &&
            rectangle.left >= 0 &&
            rectangle.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - offset) &&
            rectangle.right <= (window.innerWidth || document.documentElement.clientWidth) 
        );
    }

};

//#endregion "Helpers"

//#region "Animations"

koAnimate.animations =
{
    animationEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    
    transitionEnd: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
    
    animationInitializationName: 'ko-animate-initialization',
    
    setDuration: function (element, duration)
    {
        //Overrides the Animate.css animated class

        var seconds = duration / 1000;

        $("#koAnimateAnimated").remove();
        var style = $('<style id="koAnimateAnimated">.animated { ' +
            '-webkit-animation-duration: ' + seconds + 's !important; ' +
            'animation-duration: ' + seconds + 's !important' +
            ' }</style>');
        $('html > head').append(style);
    },

    removeDuration: function (element)
    {
        $.each(koAnimate.helpers.cssVendors, function (index, item)
        {
            $(element).css(item + 'transition-duration', '');
            $(element).css(item + 'animation-fill-mode', '');
        });
    },

    stopAnimation: function (element)
    {
        $(element).css('-moz-transition', 'none');
        $(element).css('-webkit-transition', 'none');
        $(element).css('-o-transition', 'color 0 ease-in');
        $(element).css('transition', 'none');
    },

    scale: function (element, scale, duration, easing)
    {
        var seconds = duration / 1000;
        $.each(koAnimate.helpers.cssVendors, function (index, item)
        {
            $(element).css(item + 'transform', 'scale(' + scale + ')').css(item + 'transition', seconds + 's ' + easing);
        });
    },

    rotate: function (element, degrees, duration, easing)
    {
        var seconds = duration / 1000;
        $.each(koAnimate.helpers.cssVendors, function (index, item)
        {
            $(element).css(item + 'transform', 'rotate(' + degrees + 'deg)').css(item + 'transition', seconds + 's ' + easing);
        });
    },

    opacity: function (element, opacity, duration, easing)
    {
        var seconds = duration / 1000;
        $.each(koAnimate.helpers.cssVendors, function (index, item)
        {
            $(element).css("opacity", opacity).css(item + 'transition', 'opacity ' + seconds + 's ' + easing);
        });
    },

    slide: function (element, pixelsX, pixelsY, duration, easing)
    {
        var seconds = duration / 1000;
        $.each(koAnimate.helpers.cssVendors, function (index, item)
        {
            $(element).css(item + 'transform', 'translate(' + pixelsX + ',' + pixelsY + ')').css(item + 'transition', seconds + 's ' + easing);
        });
    },

    cssAnimateReveal: function (element, animation, offset, delay, duration, callback) {

        if (koAnimate.helpers.isElementInViewport($(element)[0], offset) && !$(element).hasClass("animated")) {
            
            setTimeout(function () {
                element.style.visibility = "";
                koAnimate.animations.setDuration(element, duration);
                $(element).addClass("animated " + animation);

                $(element).one(koAnimate.animations.animationEnd, function () {
                    if (callback) {
                        callback();
                    }

                    $(window).off("scroll", element.koAnimateScrollHandler);
                });

            }, delay);
        }
    }


};

//#endregion "Animations"

//#region "Hovering"

ko.bindingHandlers.hoverScale =
{
    init: function (element, valueAccessor, allBindings)
    {
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.hoverScale.duration;
        var durationOut = allBindings['has']('durationOut') ? allBindings.get('durationOut') : koAnimate.defaults.hoverScale.durationOut;
        var easing = allBindings['has']('easing') ? allBindings.get('easing') : koAnimate.defaults.hoverScale.easing;
        var easingOut = allBindings['has']('easingOut') ? allBindings.get('easingOut') : koAnimate.defaults.hoverScale.easingOut;
        var scale = valueAccessor();
        var scaleOut = allBindings['has']('scaleOut') ? allBindings.get('scaleOut') : koAnimate.defaults.hoverScale.scaleOut;

        ko.utils.registerEventHandler(element, "mouseenter", function ()
        {

            koAnimate.animations.scale(element, scale, duration, easing);
        });

        ko.utils.registerEventHandler(element, "mouseleave", function ()
        {
            koAnimate.animations.scale(element, scaleOut, durationOut, easingOut);
        });
    }
};

ko.bindingHandlers.hoverRotate =
{
    init: function (element, valueAccessor, allBindings)
    {
        var degrees = valueAccessor();
        var degreesOut = allBindings['has']('degreesOut') ? allBindings.get('degreesOut') : koAnimate.defaults.hoverRotate.degreesOut;
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.hoverRotate.duration;
        var durationOut = allBindings['has']('durationOut') ? allBindings.get('durationOut') : koAnimate.defaults.hoverRotate.durationOut;
        var easing = allBindings['has']('easing') ? allBindings.get('easing') : koAnimate.defaults.hoverRotate.easing;
        var easingOut = allBindings['has']('easingOut') ? allBindings.get('easingOut') : koAnimate.defaults.hoverRotate.easingOut;

        ko.utils.registerEventHandler(element, "mouseenter", function ()
        {
            koAnimate.animations.rotate(element, degrees, duration, easing);
        });

        ko.utils.registerEventHandler(element, "mouseleave", function ()
        {
            koAnimate.animations.rotate(element, degreesOut, durationOut, easingOut);
        });
    }
};


//#endregion "Hovering"

//#region "Visibility"

ko.bindingHandlers.fadeVisible =
{
    init: function (element, valueAccessor)
    {
        if (ko.utils.unwrapObservable(valueAccessor()))
        {
            $(element).show();
        }
        else
        {
            $(element).hide();
            
            //Set initial opacity
            koAnimate.animations.opacity(element, 0, 0, 'ease');
        }
    },
    update: function (element, valueAccessor, allBindings)
    {
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.fadeVisible.duration;
        var durationOut = allBindings['has']('durationOut') ? allBindings.get('durationOut') : koAnimate.defaults.fadeVisible.durationOut;
        var easing = allBindings['has']('easing') ? allBindings.get('easing') : koAnimate.defaults.fadeVisible.easing;
        var easingOut = allBindings['has']('easingOut') ? allBindings.get('easingOut') : koAnimate.defaults.fadeVisible.easingOut;
        var delay = allBindings['has']('delay') ? allBindings.get('delay') : koAnimate.defaults.fadeVisible.delay;
        var delayOut = allBindings['has']('delayOut') ? allBindings.get('delayOut') : koAnimate.defaults.fadeVisible.delayOut;
        
        $(element).off(koAnimate.animations.transitionEnd);
        clearTimeout(element.koAnimateFadeVisible);
        
        if (ko.utils.unwrapObservable(valueAccessor()))
        {
            $(element).show();
            
            element.koAnimateFadeVisible = setTimeout(function()
            {
                koAnimate.animations.opacity(element, 1, duration, easing);
                
                $(element).on(koAnimate.animations.transitionEnd, function ()
                {
                    $(element).show();
                });
                
            }, delay);

        }
        else
        {
            setTimeout(function()
            {
                $(element).show();
            
                koAnimate.animations.opacity(element, 0, durationOut, easingOut);
            
                $(element).on(koAnimate.animations.transitionEnd, function ()
                {
                    $(element).hide();
                });
            }, delayOut);
        }
    }
};

ko.bindingHandlers.scaleVisible =
{
    init: function (element, valueAccessor)
    {
        if (ko.utils.unwrapObservable(valueAccessor()))
        {
            $(element).show();
        }
        else
        {
            $(element).hide();
        }

    },
    update: function (element, valueAccessor, allBindings)
    {
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.scaleVisible.duration;
        var durationOut = allBindings['has']('durationOut') ? allBindings.get('durationOut') : koAnimate.defaults.scaleVisible.durationOut;
        var easing = allBindings['has']('easing') ? allBindings.get('easing') : koAnimate.defaults.scaleVisible.easing;
        var easingOut = allBindings['has']('easingOut') ? allBindings.get('easingOut') : koAnimate.defaults.scaleVisible.easingOut;
        var scale = allBindings['has']('scale') ? allBindings.get('scale') : koAnimate.defaults.scaleVisible.scale;
        var scaleHide = allBindings['has']('scaleHide') ? allBindings.get('scaleHide') : koAnimate.defaults.scaleVisible.scaleHide;
        var scaleHideOut = allBindings['has']('scaleHideOut') ? allBindings.get('scaleHideOut') : koAnimate.defaults.scaleVisible.scaleHideOut;
        var delay = allBindings['has']('delay') ? allBindings.get('delay') : koAnimate.defaults.scaleVisible.delay;
        var delayOut = allBindings['has']('delayOut') ? allBindings.get('delayOut') : koAnimate.defaults.scaleVisible.delayOut;
        
        $(element).off(koAnimate.animations.transitionEnd);
        
        clearTimeout(element.koAnimateScaleVisible);

        if (ko.utils.unwrapObservable(valueAccessor()))
        {
            koAnimate.animations.scale(element, scaleHide, 0);
            $(element).show();
            koAnimate.animations.stopAnimation(element);

            element.koAnimateScaleVisible = setTimeout(function ()
            {

                koAnimate.animations.scale(element, scale, duration, easing);

                $(element).on(koAnimate.animations.transitionEnd, function ()
                {
                    $(element).show();
                });


            }, delay);
        }
        else
        {
            setTimeout(function()
            {

                koAnimate.animations.scale(element, scaleHideOut, durationOut, easingOut);

                $(element).on(koAnimate.animations.transitionEnd, function()
                {
                    $(element).hide();
                });
            }, delayOut);
        }

    }
};

ko.bindingHandlers.slideVisible =
{
    init: function (element, valueAccessor, allBindings)
    {
        if (ko.utils.unwrapObservable(valueAccessor()))
        {
            $(element).show();
        }
        else
        {
            $(element).hide();
        }
    },
    update: function (element, valueAccessor, allBindings)
    {
        var value = ko.utils.unwrapObservable(valueAccessor());
        
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.slideVisible.duration;
        var durationOut = allBindings['has']('durationOut') ? allBindings.get('durationOut') : koAnimate.defaults.slideVisible.durationOut;
        var easing = allBindings['has']('easing') ? allBindings.get('easing') : koAnimate.defaults.slideVisible.easing;
        var easingOut = allBindings['has']('easingOut') ? allBindings.get('easingOut') : koAnimate.defaults.slideVisible.easingOut;
        var directionOut = allBindings['has']('directionOut') ? allBindings.get('directionOut') : koAnimate.defaults.slideVisible.directionOut;
        var delay = allBindings['has']('delay') ? allBindings.get('delay') : koAnimate.defaults.slideVisible.delay;
        var delayOut = allBindings['has']('delayOut') ? allBindings.get('delayOut') : koAnimate.defaults.slideVisible.delayOut;
        
        $(element).off(koAnimate.animations.transitionEnd);
        clearTimeout(element.koAnimateSlideVisible);
        clearTimeout(element.koAnimateSlideVisible2);

        element.koAnimateSlideVisible = setTimeout(function ()
        {
            if (value)
            {
                $(element).show();

                element.koAnimateSlideVisible2 = setTimeout(function ()
                {
                    koAnimate.animations.slide(element, '0px', '0px', duration, easing);
                }, delay);
            }
            else
            {
                element.koAnimateSlideVisible2 = setTimeout(function ()
                {
                    koAnimate.animations.slide(element, koAnimate.helpers.getDirectionX(directionOut), koAnimate.helpers.getDirectionY(directionOut), durationOut, easingOut);

                    $(element).on(koAnimate.animations.transitionEnd, function ()
                    {
                        $(element).hide();
                    });

                }, delayOut);

            }

        }, 50);

    }
};

//#endregion "Visibility

//#region "Animate.CSS"

ko.bindingHandlers.cssAnimate =
{
    init: function (element, valueAccessor, allBindings)
    {
        var event = allBindings['has']('event') ? allBindings.get('event') : koAnimate.defaults.cssAnimate.event;
        var callback = allBindings['has']('callback') ? allBindings.get('callback') : koAnimate.defaults.cssAnimate.callback;
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.cssAnimate.duration;
        var animation = valueAccessor();        

        $(element).on(event, function()
        {
            koAnimate.animations.setDuration(element, duration);


            $(element).addClass("animated " + animation);

            $(element).one(koAnimate.animations.animationEnd, function ()
            {
                $(element).removeClass("animated " + animation);
                koAnimate.animations.removeDuration(element);
                
                if (callback)
                {
                    callback();
                }
                
            });

        });

    }
};

ko.bindingHandlers.cssAnimateVisible =
{
    init: function (element, valueAccessor, allBindings)
    {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value)
        {
            $(element).show();
        }
        else
        {
            $(element).hide();
        }
    },

    update: function (element, valueAccessor, allBindings)
    {
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.cssAnimateVisible.duration;
        var durationOut = allBindings['has']('durationOut') ? allBindings.get('durationOut') : koAnimate.defaults.cssAnimateVisible.durationOut;
        var animation = allBindings['has']('animation') ? allBindings.get('animation') : koAnimate.defaults.cssAnimateVisible.animation;
        var animationOut = allBindings['has']('animationOut') ? allBindings.get('animationOut') : koAnimate.defaults.cssAnimateVisible.animationOut;
        var delay = allBindings['has']('delay') ? allBindings.get('delay') : koAnimate.defaults.cssAnimateVisible.delay;
        var delayOut = allBindings['has']('delayOut') ? allBindings.get('delayOut') : koAnimate.defaults.cssAnimateVisible.delayOut;

        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");


        $(element).off(koAnimate.animations.animationEnd);
        $(element).removeClass(animation);
        $(element).removeClass(animationOut);

        setTimeout(function()
        {
            if (value)
            {
                $(element).hide(); 

                koAnimate.animations.setDuration(element, duration);
                
                setTimeout(function ()
                {
                    $(element).show();
                    $(element).addClass("animated " + animation);

                    $(element).on(koAnimate.animations.animationEnd, function ()
                    {
                        $(element).removeClass("animated " + animation);
                        koAnimate.animations.removeDuration(element);
                    });
                }, delay);

            }
            else if ($(element).is(':visible') && value === false)
            {

                koAnimate.animations.setDuration(element, durationOut);
                setTimeout(function ()
                {
                    $(element).addClass("animated " + animationOut);

                    $(element).on(koAnimate.animations.animationEnd, function ()
                    {
                        $(element).removeClass("animated " + animationOut);
                        koAnimate.animations.removeDuration(element);
                        $(element).hide();
                    });
                }, delayOut);
            }


        }, 1);
    }
};

ko.bindingHandlers.cssAnimateReveal =
{
    init: function (element, valueAccessor, allBindings)
    {
        var callback = allBindings['has']('callback') ? allBindings.get('callback') : koAnimate.defaults.cssAnimateReveal.callback;
        var duration = allBindings['has']('duration') ? allBindings.get('duration') : koAnimate.defaults.cssAnimateReveal.duration;
        var offset = allBindings['has']('offset') ? allBindings.get('offset') : koAnimate.defaults.cssAnimateReveal.offset;
        var delay = allBindings['has']('delay') ? allBindings.get('delay') : koAnimate.defaults.cssAnimateReveal.delay;
        var animation = valueAccessor() || koAnimate.defaults.cssAnimateReveal.animation;

        element.style.visibility = "hidden";

        element.koAnimateScrollTimeout = null;

       element.koAnimateScrollHandler = $(window).scroll(function ()
       {
           if (element.koAnimateScrollTimeout) {

               clearTimeout(element.koAnimateScrollTimeout);
               element.koAnimateScrollTimeout = null;
           }

           element.koAnimateScrollTimeout = setTimeout(koAnimate.animations.cssAnimateReveal(element, animation, offset, delay, duration, callback), 60);

        });
    }
};

//#endregion "Animate.CSS

