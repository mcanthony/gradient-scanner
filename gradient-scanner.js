/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function() {
    var canvas = document.getElementById("imageDisplay"),
        linePreview = document.getElementById("linePreview"),
        colorStopsEl = $("#colorStops"),
        context = canvas.getContext("2d");

    $.template("colorStopTemplate", "<div class=\"colorStop\"> <div class=\"colorPreview\" style=\"background-color: ${colorCss}\"/>${position} ${colorCss}</div>");

    var dragStart, dragEnd, imageData;

    $(canvas).mousedown(function(event) {
        dragStart = {x: event.offsetX, y: event.offsetY};

        colorStopsEl.html("");
    }).mousemove(function(event) {
        if (dragStart) {
            dragEnd = {x: event.offsetX, y: event.offsetY};

            // Output debug info. To be removed after the UI is worked out
            $("#lineInfo").text("dragStart: " + JSON.stringify(dragStart) + " dragEnd: " + JSON.stringify(dragEnd) + " deltaX: " + (dragEnd.x-dragStart.x) + " deltaY: "+ (dragEnd.y-dragStart.y) + " m: " + (dragEnd.y-dragStart.y)/(dragEnd.x-dragStart.x));

            // Collect the line data while the user is dragging
            imageData = ImageDataUtils.getLinePixels(context, dragStart, dragEnd);

            // Display the line preview
            var stretcher = ImageDataUtils.createCanvasFromImageData(imageData);
            linePreview.src = stretcher.toDataURL();
        }
    }).mouseup(function(event) {
        var colorStops = ColorStops.extractColorStops(imageData.data);

        colorStops.forEach(function(stop) {
            var stopEl = $.tmpl("colorStopTemplate", {
                position: stop.position,
                colorCss: "RGBA(" + stop.color.join(", ") + ")"
            });
            colorStopsEl.append(stopEl);
        });

        $("#gradientPreview").css("background-image", ColorStops.generateCSS(colorStops));

        dragStart = undefined;
    });
});