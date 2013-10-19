
//#region "Defaults"

var koAnimate =
{
    defaults:
    {
        hoverScale:
        {
            scale: 1.2,
            duration: 250,
            scaleOut: 1.0,
            durationOut: 100,
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
            easingOut: 'ease-out'
        },
        scaleVisible:
        {
            scale: 1.0,
            scaleHide: 0,
            scaleHideOut: 0,
            duration: 500,
            durationOut: 500,
            easing: 'ease-in',
            easingOut: 'ease-out'
        },
        slideVisible:
        {
            duration: 500,
            durationOut: 500,
            direction: 'left',
            directionOut: 'left',
            easing: 'ease-in',
            easingOut: 'ease-out'
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
        }
        
    }

};


//#endregion "Defaults"

//#region "Helpers"

koAnimate.helpers =
{
    cssVendors: ['-webkit-', '-moz-', '-o-,', '-ms-', ''],

    getValue: function(json, property, defaultValue, requiresJson, isObservable)
    {
        if (isObservable)
        {
            return typeof json()[property] != "undefined" ? json()[property] : json();
        }
        
        if (!json())
        {
             return defaultValue;
        }
        
        if (json()[property])
        {
             return json()[property];
        }
        
        if (requiresJson)
        {
             return defaultValue;
        }
        
        if (!isNaN(parseFloat(json())) && isFinite(json()))
        {
            return json();
        }

        if (typeof json() == "string")
        {
            return json();
        }

        return defaultValue;
    },

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
    }
};

//#endregion "Helpers"

//#region "Animations"

koAnimate.animations =
{
    animationEnd: 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
    
    transitionEnd: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
    
    setDuration: function (element, duration)
    {
        //Overrides the Animate.css animated class

        var seconds = duration / 1000;

        $("#koAnimateAnimated").remove();
        var style = $('<style id="koAnimateAnimated">.animated { ' +
            '-webkit-animation-duration: ' + seconds + 's !important; ' +
            '-moz-animation-duration: ' + seconds + 's !important;' +
            '-o-animation-duration: ' + seconds + 's !important;' +
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
    }
};

//#endregion "Animations"

//#region "Hovering"

ko.bindingHandlers.hoverScale =
{
    update: function (element, json)
    {
        var scale = koAnimate.helpers.getValue(json, "scale", koAnimate.defaults.hoverScale.scale, false);
        var duration = koAnimate.helpers.getValue(json, "duration", koAnimate.defaults.hoverScale.duration, true);
        var scaleOut = koAnimate.helpers.getValue(json, "scaleOut", koAnimate.defaults.hoverScale.scaleOut, true);
        var durationOut = koAnimate.helpers.getValue(json, "durationOut", koAnimate.defaults.hoverScale.durationOut, true);
        var easing = koAnimate.helpers.getValue(json, "easing", koAnimate.defaults.hoverScale.easing, true);
        var easingOut = koAnimate.helpers.getValue(json, "easingOut", koAnimate.defaults.hoverScale.easingOut, true);

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
    update: function (element, json)
    {
        var degrees = koAnimate.helpers.getValue(json, "degrees", koAnimate.defaults.hoverRotate.degrees, false);
        var duration = koAnimate.helpers.getValue(json, "duration", koAnimate.defaults.hoverRotate.duration, true);
        var degreesOut = koAnimate.helpers.getValue(json, "degreesOut", koAnimate.defaults.hoverRotate.degreesOut, true);
        var durationOut = koAnimate.helpers.getValue(json, "durationOut", koAnimate.defaults.hoverRotate.durationOut, true);
        var easing = koAnimate.helpers.getValue(json, "easing", koAnimate.defaults.hoverRotate.easing, true);
        var easingOut = koAnimate.helpers.getValue(json, "easingOut", koAnimate.defaults.hoverRotate.easingOut, true);

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
    init: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, null, true);
        
        if (ko.utils.unwrapObservable(observable))
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
    update: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, null, true);
        var duration = koAnimate.helpers.getValue(json, "duration", koAnimate.defaults.fadeVisible.duration, true);
        var durationOut = koAnimate.helpers.getValue(json, "durationOut", koAnimate.defaults.fadeVisible.durationOut, true);
        var easing = koAnimate.helpers.getValue(json, "easing", koAnimate.defaults.fadeVisible.easing, true);
        var easingOut = koAnimate.helpers.getValue(json, "easingOut", koAnimate.defaults.fadeVisible.easingOut, true);
        
        $(element).off(koAnimate.animations.transitionEnd);
        
        if (ko.utils.unwrapObservable(observable))
        {
            $(element).show();
            
            element.koAnimateFadeVisible = setTimeout(function()
            {
                koAnimate.animations.opacity(element, 1, duration, easing);
                
                $(element).on(koAnimate.animations.transitionEnd, function ()
                {
                    $(element).show();
                });
                
            }, 50);

        }
        else
        {
            $(element).show();
            
            koAnimate.animations.opacity(element, 0, durationOut, easingOut);
            
            $(element).on(koAnimate.animations.transitionEnd, function ()
            {
                $(element).hide();
            });
        }
    }
};

ko.bindingHandlers.scaleVisible =
{
    init: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, null, true);
        if (ko.utils.unwrapObservable(observable))
        {
            $(element).show();
        }
        else
        {
            $(element).hide();
        }

    },
    update: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, null, true);
        var duration = koAnimate.helpers.getValue(json, "duration", koAnimate.defaults.scaleVisible.duration, true);
        var durationOut = koAnimate.helpers.getValue(json, "durationOut", koAnimate.defaults.scaleVisible.durationOut, true);
        var scale = koAnimate.helpers.getValue(json, "scale", koAnimate.defaults.scaleVisible.scale, true);
        var scaleHide = koAnimate.helpers.getValue(json, "scaleHide", koAnimate.defaults.scaleVisible.scaleHide, true);
        var scaleHideOut = koAnimate.helpers.getValue(json, "scaleHideOut", koAnimate.defaults.scaleVisible.scaleHideOut, true);
        var easing = koAnimate.helpers.getValue(json, "easing", koAnimate.defaults.scaleVisible.easing, true);
        var easingOut = koAnimate.helpers.getValue(json, "easingOut", koAnimate.defaults.scaleVisible.easingOut, true);

        $(element).off(koAnimate.animations.transitionEnd);

        if (ko.utils.unwrapObservable(observable))
        {
            koAnimate.animations.scale(element, scaleHide, 0);
            $(element).show();
            koAnimate.animations.stopAnimation(element);
            
            setTimeout(function()
            {
                
                koAnimate.animations.scale(element, scale, duration, easing);
                
                $(element).on(koAnimate.animations.transitionEnd, function ()
                {
                    $(element).show();
                });

                
            }, 50);
        }
        else
        {
            koAnimate.animations.scale(element, scaleHideOut, durationOut, easingOut);
            
            $(element).on(koAnimate.animations.transitionEnd, function ()
            {
                $(element).hide();
            });
        }

    }
};

ko.bindingHandlers.slideVisible =
{
    init: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, false, true);
        var directionOut = koAnimate.helpers.getValue(json, "directionOut", koAnimate.defaults.slideVisible.directionOut, true);

        if (ko.utils.unwrapObservable(observable))
        {
            $(element).show();
        }
        else
        {
            $(element).hide();
            koAnimate.animations.slide(element, koAnimate.helpers.getDirectionX(directionOut), 0, 'ease');
        }
    },
    update: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, null, true);
        var duration = koAnimate.helpers.getValue(json, "duration", koAnimate.defaults.slideVisible.duration, true);
        var durationOut = koAnimate.helpers.getValue(json, "durationOut", koAnimate.defaults.slideVisible.durationOut, true);
        var directionOut = koAnimate.helpers.getValue(json, "directionOut", koAnimate.defaults.slideVisible.directionOut, true);
        var easing = koAnimate.helpers.getValue(json, "easing", koAnimate.defaults.slideVisible.easing, true);
        var easingOut = koAnimate.helpers.getValue(json, "easingOut", koAnimate.defaults.slideVisible.easingOut, true);

        $(element).off(koAnimate.animations.transitionEnd);
        
        setTimeout(function()
        {
            if (ko.utils.unwrapObservable(observable))
            {
                $(element).show();
                
                setTimeout(function ()
                {
                    koAnimate.animations.slide(element, '0px', '0px', duration, easing);
                }, 50);
            }
            else
            {
                setTimeout(function ()
                {
                    koAnimate.animations.slide(element, koAnimate.helpers.getDirectionX(directionOut), koAnimate.helpers.getDirectionY(directionOut), durationOut, easingOut);
                    
                    $(element).on(koAnimate.animations.transitionEnd, function ()
                    {
                        $(element).hide();
                    });

                }, 50);

            }

        }, 50);
      
    }
};

//#endregion "Visibility

//#region "Animate.CSS"

ko.bindingHandlers.cssAnimate =
{
    init: function (element, json)
    {
        var animation = koAnimate.helpers.getValue(json, "animation", koAnimate.defaults.cssAnimate.animation, false);
        var event = koAnimate.helpers.getValue(json, "event", koAnimate.defaults.cssAnimate.event, true);
        var duration = koAnimate.helpers.getValue(json, "duration", koAnimate.defaults.cssAnimate.duration, true);
        var callback = koAnimate.helpers.getValue(json, "callback", koAnimate.defaults.cssAnimate.callback, true);

        ko.utils.registerEventHandler(element, event, function ()
        {

            $(element).addClass(animation);
            koAnimate.animations.setDuration(element, duration);
            setTimeout(function()
            {

                $(element).addClass("animated");

            }, 1);

            setTimeout(function ()
            {
                if (callback)
                {
                    callback();
                }
                $(element).removeClass("animated " + animation);
                koAnimate.animations.removeDuration(element);
            }, duration);
        });
    }
};

ko.bindingHandlers.cssAnimateVisible =
{
    init: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, false, true);
        if (ko.utils.unwrapObservable(observable))
        {
            $(element).show();
        }
        else
        {
            $(element).hide();
        }
    },

    update: function (element, json)
    {
        var observable = koAnimate.helpers.getValue(json, "observable", null, false, true);
        var animation = koAnimate.helpers.getValue(json, "animation", koAnimate.defaults.cssAnimateVisible.animation, false);
        var animationOut = koAnimate.helpers.getValue(json, "animationOut", koAnimate.defaults.cssAnimateVisible.animationOut, false);
        var duration = koAnimate.helpers.getValue(json, "duration", koAnimate.defaults.cssAnimateVisible.duration, false);
        var durationOut = koAnimate.helpers.getValue(json, "durationOut", koAnimate.defaults.cssAnimateVisible.durationOut, false);

        $(element).unbind(koAnimate.animations.animationEnd);
        $(element).removeClass(animation);
        $(element).removeClass(animationOut);
        
        setTimeout(function()
        {
            if (ko.utils.unwrapObservable((typeof (observable) == "function") ? observable() : observable))
            {
                $(element).hide(); 

                koAnimate.animations.setDuration(element, duration);
                
                setTimeout(function ()
                {
                    $(element).show();
                    $(element).addClass("animated " + animation);

                    $(element).bind(koAnimate.animations.animationEnd, function ()
                    {
                        $(element).removeClass("animated " + animation);
                        koAnimate.animations.removeDuration(element);
                    });
                }, 1);

            }
            else if ($(element).is(':visible'))
            {

                koAnimate.animations.setDuration(element, durationOut);
                setTimeout(function ()
                {
                    $(element).addClass("animated " + animationOut);

                    $(element).bind(koAnimate.animations.animationEnd, function ()
                    {
                        $(element).removeClass("animated " + animationOut);
                        koAnimate.animations.removeDuration(element);
                        $(element).hide();
                    });
                }, 1);
            }


        }, 1);


        

    }
};


//#endregion "Animate.CSS