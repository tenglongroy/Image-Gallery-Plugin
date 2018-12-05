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
    var currentColumnNo = undefined;

	$.fn.imageGallery = function(photoGridContainer, options) {
		settings = $.extend({
            // These are the defaults
            max_column: 5,
            max_container_width: 1200
			//image_gallery_ID: "image-gallery-main", /* not possible currently, "css variables" https://www.sitepoint.com/practical-guide-css-variables-custom-properties/ */
		}, options );
		
		photoList = this;
		//let imageAmount = imageList.length;

        photoGridContainer.append("<div id='"+ photoGridID +"'></div>");
        for(let i = 1; i <= settings.max_column; i++){
            $('#'+photoGridID).append("<div class='grid-column"+i+"'></div>");
        }

        photoWidth = Math.floor(settings.max_container_width/max_column);
        currentColumnNo = settings.max_column;

        gridRestructure();
    };
    
    // restructure the columns to fit the screen width
    function gridRestructure(){


        for(let i = 0; i < photoList.length; i++){

        }

        $(window).resize(function () {

        });
    }

    function getColumnNo(){
        window.innerWidth()
    }
}( jQuery ));