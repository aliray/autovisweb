import $ from 'jquery';
/**
 * @name jQuery imageView plugin
 * @license GPL
 * @version 0.0.4
 * @date September 16, 2010
 * @category jQuery plugin
 * @author Kotelnitskiy Evgeniy (evgennniy@gmail.com)
 * @copyright (c) 2010 Kotelnitskiy Evgeniy (http://4coder.info/en/)
 * @example Visit http://4coder.info/en/ for more informations about this jQuery plugin
 */
var image_view_last_id = 0;
var opr_width = 0;
var opr_height = 0;

export function setOprArea(width,height){
    opr_width = width;
    opr_height = height;
}

export function ImageView(settings){
    console.log('loading objImageView!');

    opr_width = settings['width'];
    opr_height = settings['height'];

    // Find Elements
    var labelImgContent = $("#label_canvas");
    var $container = $('#imgPanel');
    console.log($container);
    if ($container.length == 0) return false;
    var container = $container[0];
    var $img = $('img', container);
    var img = $img[0];

    if (!$img.attr('id')) {
        image_view_last_id++;
        $img.attr('id', 'image_view_' + image_view_last_id);
    }
    var id = $img.attr('id');

    // Settings
    settings = $.extend({
        width: 500,
        height: 400,
        fullsize: $img.attr('rel'),
        mousewheel: false
    }, settings);
    settings['src'] = $img.attr('src');

    $img.data('mousedown', false);
    $img.data('cannot_minimize', false);
    $img.data('state', 0);

    // CSS
    $container.addClass('iv-loading');
    $container.width(opr_width);
    $container.height(opr_height);
    $container.css('overflow', 'hidden');
    $container.css('position', 'relative');

    $img.css('visibility', 'hidden');
    $img.css('position', 'absolute');

    $img.css('left', 0);
    $img.css('top', 0);

    if (img.complete) {
        setTimeout(function () {
            loaded();
        }, 100);
    }else {
        $(img).one('load', function () {
            loaded();
        });
    }

    function loaded() {
        console.log('loaded...........');
        settings['imgwidth'] = $img.width();
        settings['imgheight'] = $img.height();

        $img.css('left', settings['imgwidth'] / 2 - $img.width() / 2);
        $img.css('top', settings['imgheight'] / 2 - $img.height() / 2);
        labelImgContent.css('left', settings['imgwidth'] / 2 - $img.width() / 2);
        labelImgContent.css('top', settings['imgheight'] / 2 - $img.height() / 2);

        // imgview
        $img.bind('mousedown.imgview', function (event) {
            $img.data('mousedown', true);
            $img.data('cannot_minimize', false);
            settings['pageX'] = event.pageX;
            settings['pageY'] = event.pageY;
            settings['top'] = parseInt($img.css('top'));
            settings['left'] = parseInt($img.css('left'));
            return false;
        });

        $(document).bind('mouseup.imgview', function (event) {
            $img.data('mousedown', false);
            return false;
        });

        $(document).bind('mousemove.imgview', function (event) {

            if ($img.data('mousedown')) {
                var dx = event.pageX - settings['pageX'];
                var dy = event.pageY - settings['pageY'];

                if ((dx == 0) && (dy == 0)) {
                    return false;
                }

                //var newX = parseInt($img.css('left')) + dx;
                var newX = parseInt(settings['left']) + dx;
                if (newX > 0) newX = 0;
                if (newX < opr_width - $img.width())
                    newX = opr_width - $img.width() + 1;
                //var newY = parseInt($img.css('top')) + dy;
                var newY = parseInt(settings['top']) + dy;
                if (newY > 0) newY = 0;
                if (newY < opr_height - $img.height())
                    newY = opr_height - $img.height() + 1;

                if (opr_width >= $img.width()) {
                    newX = opr_width / 2 - $img.width() / 2;
                }
                if (opr_height >= $img.height()) {
                    newY = opr_height / 2 - $img.height() / 2;
                }
                $img.css('left', newX + 'px');
                $img.css('top', newY + 'px');

                labelImgContent.css('left', newX + 'px');
                labelImgContent.css('top', newY  + 'px');

                settings['left'] = newX;
                settings['top'] = newY;
                settings['pageX'] = event.pageX;
                settings['pageY'] = event.pageY;
                $img.data('cannot_minimize', true);
            }
            return false;
        });

        function cursor() {
            if (settings['loading']) {
                $container.css('cursor', 'progress');
            }
            else {
                if ($img.data('state') == 0) {
                    $container.css('cursor', 'pointer');
                    // if ($.browser.mozilla) {
                    //     $container.css('cursor', '-moz-zoom-in');
                    // }
                    // else {
                    //     $container.css('cursor', 'pointer');
                    // }
                }
                else {
                    $container.css('cursor', 'move');
                }
            }
        }

        // Finalize
        $img.css('visibility', 'visible');
        $container.removeClass('iv-loading');
        cursor();
    }
}
