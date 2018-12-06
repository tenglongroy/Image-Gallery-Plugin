/**
 * Image Gallery Plugin by Roy Teng on 2018/10/25
 * Github: https://github.com/tenglongroy/Image-Gallery-Plugin
 * This project is MIT licensed.
 */



(function( $ ) {
//(function( window, undefined ) {
	//https://learn.jquery.com/plugins/basic-plugin-creation/

	/*"use strict";
	var $ = window.jQuery || window.Zepto;*/
	
	var photoGridID = 'photo-grid-main';
	
	var photoList = undefined;
    var settings = undefined;
    var photoWidth = undefined;
    var currentColumnNo = 0;
    var currentColumnHeights = [];
    var photoGridContainer = undefined;

	$.fn.photoGridResponsive = function(parentElement, options) {
		settings = $.extend({
            // These are the defaults
            max_column: 5,
            max_container_width: 1200
			//image_gallery_ID: "image-gallery-main", /* not possible currently, "css variables" https://www.sitepoint.com/practical-guide-css-variables-custom-properties/ */
		}, options );
		
		photoList = this;
		//let imageAmount = imageList.length;

        photoGridContainer = parentElement;
        photoGridContainer.append("<div id='"+ photoGridID +"'></div>");
        
        photoList.appendTo($('#'+photoGridID));
        /*photoList.each(function(){
            $(this).clone().appendTo($('#photoGridID'));
        })*/
        /*for(let i = 1; i <= settings.max_column; i++){
            $('#'+photoGridID).append("<div class='grid-column"+i+"'></div>");
        }*/

        photoWidth = Math.floor(settings.max_container_width/settings.max_column);
        //currentColumnNo = settings.max_column;

        gridRestructure();

        $(window).resize(gridRestructure());
    };
    
    // restructure the columns to fit the screen width
    function gridRestructure(){
        // no need to re-structure because the column number didn't change
        if(getColumnNo() == currentColumnNo){
            return;
        }
        currentColumnNo = getColumnNo();
        // init the height list
        currentColumnHeights.length = 0;
        for(let i = 0; i<currentColumnNo; i++){
            currentColumnHeights.push([i*photoWidth,0]);
        }

        for(let i = 0; i < photoList.length; i++){
            let imgWidth = photoList.eq(i).width(), imgHeight = photoList.eq(i).height();
            if(imgWidth == 0 || imgHeight == 0)
                continue;
            let Index = findSmallestHeightIndex();

            photoList.eq(i).css({"position":"absolute", "left":currentColumnHeights[Index][0]+"px", "top":currentColumnHeights[Index][1]+"px"});
            currentColumnHeights[Index][1] += parseInt(photoWidth * imgHeight / imgWidth);
        }
    }

    function getColumnNo(){
        let result = parseInt(photoGridContainer.width() / photoWidth);
        return result > settings.max_column? settings.max_column : result;
    }

    function findSmallestHeightIndex(){
        let resultIndex = 0;
        for(let i = 0; i < currentColumnHeights.length; i++){
            if(currentColumnHeights[i][1] < currentColumnHeights[resultIndex][1])
                resultIndex = i;
        }
        return resultIndex;
    }
}( jQuery ));