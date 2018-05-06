document.addEventListener('DOMContentLoaded', function () {
    
    let s = "m397.529,58.225c-37.359,0-72.27,11.235-100.957,32.49-25.401,18.819-44.228,44.84-51.653,71.391-8.498,30.386-1.593,57.841 18.431,75.96-6.892,12.102-13.298,24.592-18.372,36.707-4.66-11.592-10.865-21.973-17.882-31.224 9.949-15.808 11.327-35.12 3.511-54.911-7.36-18.635-22.266-35.818-41.974-48.386-21.258-13.556-46.288-20.721-72.383-20.721-33.485,0-67.836,12.078-99.338,34.928l-16.912,12.268 20.162,5.478c33.26,9.036 59.805,34.679 83.225,57.303 23.91,23.098 46.495,44.914 72.659,44.921 0.004,0 0.008,0 0.012,0 12.875,0 25.18-5.146 37.498-15.667 11.82,16.664 20.228,37.094 20.228,61.938v127h20c0,0 0.018-122.778 0.018-129.384 0-15.96 9.362-39.486 26.042-68.882 12.387,6.689 23.962,9.954 35.235,9.954 36.76,0 60.665-35.173 85.974-72.41 22.59-33.238 48.194-70.911 86.29-90.421l18.581-9.516-19.061-8.516c-30.153-13.47-60.209-20.3-89.334-20.3zm-221.471,196.203c-0.002,0-0.004,0-0.007,0-18.085-0.005-36.938-18.218-58.768-39.306-20.663-19.961-43.588-42.108-72.305-55.135 23.345-13.586 47.248-20.456 71.272-20.456 48.227,0 84.676,28.4 95.755,56.453 2.869,7.266 5.835,19.295 0.99,31.335-17.942-18.216-37.69-30.663-49.979-38.408-3.594-2.266-6.698-4.222-8.771-5.695l-11.59,16.299c2.526,1.797 5.85,3.892 9.697,6.316 12.659,7.979 31.868,20.09 48.451,37.523-8.638,7.436-16.76,11.074-24.745,11.074zm208.452-78.693c-23.213,34.155-43.261,63.652-69.432,63.652-7.676,0-15.897-2.358-24.996-7.165 0.894-1.439 1.797-2.886 2.722-4.348 19.815-31.329 39.938-56.696 40.139-56.949l-15.649-12.454c-1.715,2.155-22.828,28.846-43.394,61.905-12.095-13.03-15.666-31.622-9.72-52.884 6.252-22.354 22.397-44.482 44.298-60.708 17.584-13.028 47.309-28.56 89.051-28.56 20.458,0 41.53,3.779 62.861,11.258-32.716,22.745-55.46,56.209-75.88,86.253z";
    document.getElementById("plant").setAttribute("d", s);
    }, false);

    let editText = function() {
        let $el = $(this);      
        let $input = $('<input/>').val( $el.text() );
        let top = $el.position().top;
        let left = $el.position().left;
        $input.css('width', '100px');
        $input.css("position", "absolute");
        $input.css("top", top);
        $input.css("left", left);
        $el.replaceWith( $input );
        let save = function(){
            let $span = $('<span>').text( $input.val() );
            $span.addClass('simple-text');
            $span.addClass('draggable');
            $span.addClass('editable-text');
            $span.dblclick(editText);
            $input.css("position", "absolute");
            $span.css("top", top);
            $span.css("left", left);
            $input.replaceWith( $span );
        };
        $input.one('blur', save).focus();
    }

    $(document).ready(function(){
    counter = 0;
    $(".drag").draggable({
        helper:'clone',
        containment: 'frame',

        //When first dragged
        stop:function(ev, ui) {
            var pos=$(ui.helper).offset();
            objName = "#clonediv"+counter;
            $(objName).css({"left":pos.left,"top":pos.top});
            $(objName).removeClass("drag");

               //When an existiung object is dragged
            $(objName).draggable({
                containment: 'parent',
                stop:function(ev, ui) {
                   var pos=$(ui.helper).offset();
                   console.log(pos);
                }
            });
        }
    });
    //Make element droppable
    $("#canvas").droppable({
        drop: function(ev, ui) {
        var element=$(ui.draggable).clone();
        innerElement = element.children();
        if (($(innerElement).attr("tagName") === "SPAN")) {
            $(innerElement).dblclick(editText);
        }
        counter++;
        $(this).append(innerElement);
        }
    });

    $('.editable-text').dblclick(editText);

});
