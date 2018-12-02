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
	
	var imageGalleryID = 'image-gallery-main';
	var currentImageIndex = -1;
	var imageList = undefined;
	var settings = undefined;
	var preloadSet = new Set();

	$.fn.imageGallery = function(options) {
		settings = $.extend({
            // These are the defaults
			landscape_preview: false,
			preload: false,
			blur_background: false,
			image_gallery_ID: "image-gallery-main", /* css variables https://www.sitepoint.com/practical-guide-css-variables-custom-properties/ */
		}, options );
		
		imageList = this;
		//let imageAmount = imageList.length;
		this.on('click', function(){
			if(isGalleryExist()){	// container already exist, show it
				currentImageIndex = imageList.index($(this));
				//showImage($(selector), $(this));
				showImage();
				//$('#' + imageGalleryID).show();
				$('body').addClass('image-gallery-opened');
			}
			else{	// container not exist, need to create a new one
				currentImageIndex = imageList.index($(this));
				//imageGalleryInit($(selector), $(this));
				imageGalleryInit();
			}
		});
	};


		/*function Main_imageGallery(selector){
			imageList = $(selector);
			//let imageAmount = imageList.length;
			$(selector).on('click', function(){
				if(isGalleryExist()){	// container already exist, show it
					currentImageIndex = imageList.index($(this));
					//showImage($(selector), $(this));
					showImage();
					//$('#' + imageGalleryID).show();
					$('body').addClass('image-gallery-opened');
				}
				else{	// container not exist, need to create a new one
					currentImageIndex = imageList.index($(this));
					//imageGalleryInit($(selector), $(this));
					imageGalleryInit();
				}
			});

		}*/



	function imageGalleryInit() {
		let imageAmount = imageList.length;
		$('body').append("<div id='" + imageGalleryID + "'><div class='image-gallery-body'><div class='top-bar'><div class='index-container'><input class='index' type='number' value='" + currentImageIndex + "'></input><span>/ " + imageAmount + "</span></div><div class='action-bar'><div class='action-icon action-preview'><i class='icon ig-preview'></i></div><div class='action-icon action-close'><i class='icon ig-close'></i></div></div></div><a class='image-gallery-nav prev'><i class='icon ig-prev'></i></a><a class='image-gallery-nav next'><i class='icon ig-next'></i></a><div class='image-gallery-display-container'><img class='current-image'> <div class='current-image-background'></div><div class='loading-image' style='background-image:url("+loadingImage+");display:none;'></div></div></div><div class='image-gallery-bottom-container'><div class='image-gallery-caption'></div><div class='image-gallery-preview-landscape-container'><div class='image-gallery-preview-landscape-scroller'></div></div></div><div class='image-gallery-preview-portrait-container'><div class='image-gallery-preview-portrait-scroller'></div></div></div>");
		$('body').addClass('image-gallery-opened');

		// add click Listener for icons
		$('#'+imageGalleryID+' .action-preview').on('click', function() {
			if(settings.landscape_preview){
				$('#'+imageGalleryID).toggleClass('landscape-preview-opened');
			}
			else{
				$('#'+imageGalleryID).toggleClass('portrait-preview-opened');
			}
			//isPreviewOpened = isPreviewOpened ? false: true;
		});
		$('#'+imageGalleryID+' .action-close').on('click', function() {
			//$('#'+imageGalleryID).hide();
			closeImageGallery();
		});
		$('#'+imageGalleryID+' .image-gallery-nav.prev').on('click', function() {
			prevImage();
		});
		$('#'+imageGalleryID+' .image-gallery-nav.next').on('click', function() {
			nextImage();
		});
		$('#'+imageGalleryID+' .current-image-background').on('click', function() {
			// zoom-in / out
			// TO-DO
			$('#'+imageGalleryID+' .image-gallery-display-container').toggleClass('image-gallery-plugin-zoom-in');
		});
		$('body').keydown(function (e) {
			//need to check if focus on index input
			// TO-DO

			if (isGalleryOpened()) {
				// check if in the index input, if so, don't move images with arrows
				if($(document.activeElement).hasClass('index')){
					return true;
				}
				if (e.which == 37) {    //left arrow
					prevImage();
				}
				else if (e.which == 39) {   //right arrow
					nextImage();
				}
				else if (e.which == 27) {   //Esc
					closeImageGallery();
				}
				else if (e.which == 80){	//p for preview
					$('#'+imageGalleryID+' .action-icon.action-preview').click()
				}
			}
			else {
				return true;
			}
		});


		$('#'+imageGalleryID+' .index-container input.index').on('click', function() {
			$(this).select();
		});
		$('#'+imageGalleryID+' .index-container input.index').on('change', function() {
			if(($(this).val()+"").match(/^\d+$/)){	//check if it is integer
				let inputNum = parseInt($(this).val())-1;
				if(inputNum >= 0 && inputNum+1 <= imageList.length){
					currentImageIndex = inputNum;
					showImage();
				}
			}
			else{
				alert('Please enter a correct number.');
			}
		});

		// adjust the image container's max-height for smaller screen (laptop), to avoid top-bar being covered
		if(settings.landscape_preview){
			let totalHeight = $('#'+imageGalleryID).height();
			let leastSpareHeight = $('#'+imageGalleryID+' .top-bar').height();
			//(totalHeight - maxHeight)/2 >= leastSpareHeight+10;
			let maxHeight = totalHeight*0.9 - (leastSpareHeight+10)*2;
			$('#'+imageGalleryID+' .image-gallery-display-container').css('max-height', maxHeight+'px');
		}
		else{
			let totalHeight = $('#'+imageGalleryID).height();
			let leastSpareHeight = $('#'+imageGalleryID+' .top-bar').height();
			//(totalHeight - maxHeight)/2 >= leastSpareHeight+10;
			let maxHeight = totalHeight - (leastSpareHeight+10)*2;
			$('#'+imageGalleryID+' .image-gallery-display-container').css('max-height', maxHeight+'px');
		}


		// create preview container by adding preview path as image source
		for(let i = 0; i < imageList.length; i++){
			if(settings.landscape_preview){
				$('#'+imageGalleryID+' .image-gallery-preview-landscape-scroller').append('<div class="preview-img-wrapper"><img src="'+ imageList.eq(i).data("preview-img") +'"></div>');
			}
			else{
				$('#'+imageGalleryID+' .image-gallery-preview-portrait-scroller').append('<div class="preview-img-wrapper"><img src="'+ imageList.eq(i).data("preview-img") +'"></div>');
			}
		}
		$('#'+imageGalleryID+' .image-gallery-preview-portrait-container img, ' + '#'+imageGalleryID+' .image-gallery-preview-landscape-container img').on('click', function(){
			let clickIndex = $(this).parent().index();
			currentImageIndex = clickIndex;
			showImage();
		});

		showImage();
	}

	function getPrevIndex(){
		return (currentImageIndex+imageList.length-1)%imageList.length;
	}
	function getNextIndex(){
		return (currentImageIndex+1)%imageList.length;
	}

	function prevImage(){
		//let currentIndex = imageList.index(currentObject);
		//let nextIndex = (currentObjectIndex+imageList.length-1)%imageList.length;
		//thisObjectIndex = (currentObjectIndex+imageList.length-1)%imageList.length;
		currentImageIndex = (currentImageIndex+imageList.length-1)%imageList.length;
		showImage();
	}

	function nextImage(){
		//let currentIndex = imageList.index(currentObject);
		//let nextIndex = (currentObjectIndex+1)%imageList.length;
		//thisObjectIndex = (currentObjectIndex+1)%imageList.length;
		currentImageIndex = (currentImageIndex+1)%imageList.length;
		showImage();
	}

	function showImage(){

		showCaption();
		activatePreview();

		// set display container to default
		$('#'+imageGalleryID+' .current-image-background').removeClass('image-gallery-plugin-zoom-in');
		$('#'+imageGalleryID+' .index-container input.index').val(currentImageIndex+1);
		
		// load current image to display container
		let currentImageURL = imageList.eq(currentImageIndex).data('display-img');
		// check if the image is already cached
		if(preloadSet.has(currentImageURL)){
			$('#'+imageGalleryID+' .current-image-background').css('background-image', 'url('+currentImageURL+')');
			if(settings.preload){
				preloadImage(imageList.eq(getPrevIndex()).data('display-img'));
				preloadImage(imageList.eq(getNextIndex()).data('display-img'));
			}
		}
		else{
			// show loading GIF
			$('#'+imageGalleryID+' .image-gallery-display-container').addClass('image-loading');
			$('#'+imageGalleryID+' .loading-image').show();

			$('<img/>').attr('src', currentImageURL).on('load', function() {
				console.log('on load display image' + $.now() +' ' + currentImageURL);
				$('#'+imageGalleryID+' .image-gallery-display-container').removeClass('image-loading');
				$('#'+imageGalleryID+' .loading-image').fadeOut(200);
				preloadSet.add(currentImageURL);
				$(this).remove(); // "prevent memory leaks as @benweet suggested" by author  https://stackoverflow.com/questions/5057990/how-can-i-check-if-a-background-image-is-loaded
				$('#'+imageGalleryID+' .current-image-background').css('background-image', 'url('+currentImageURL+')');
				// pre-load image
				if(settings.preload){
					preloadImage(imageList.eq(getPrevIndex()).data('display-img'));
					preloadImage(imageList.eq(getNextIndex()).data('display-img'));
				}
			});
		}
		//$('#'+imageGalleryID+' .current-image-background').css('background-image', 'url('+imageList.eq(currentImageIndex).data('display-img')+')');
	}
	
	function showCaption(){
		$('#'+imageGalleryID+' .image-gallery-caption').html("");
		let captionID = imageList.eq(currentImageIndex).data('caption');
		if(captionID != undefined && captionID.charAt(0) != '#')
			captionID = '#' + captionID;
		$('#'+imageGalleryID+' .image-gallery-caption').html($(captionID).html());
	}

	function activatePreview(){
		$('#'+imageGalleryID+' .preview-img-wrapper').removeClass('active');
		$('#'+imageGalleryID+' .preview-img-wrapper').eq(currentImageIndex).addClass('active');
		scrollToActive();
	}

	function scrollToActive(){
		if(settings.landscape_preview){
			$('#'+imageGalleryID+' .image-gallery-preview-landscape-scroller').animate({
				scrollLeft: $('#'+imageGalleryID+' .preview-img-wrapper.active').offset().left - $('#'+imageGalleryID+' .image-gallery-preview-landscape-scroller').offset().left + $('#'+imageGalleryID+' .image-gallery-preview-landscape-scroller').scrollLeft() - $('#'+imageGalleryID+' .image-gallery-preview-landscape-scroller').width()/2 + $('#'+imageGalleryID+' .preview-img-wrapper.active').width()
			}, 0);
		}
		else{
			$('#'+imageGalleryID+' .image-gallery-preview-portrait-scroller').animate({
				scrollTop: $('#'+imageGalleryID+' .preview-img-wrapper.active').offset().top - $('#'+imageGalleryID+' .image-gallery-preview-portrait-scroller').offset().top + $('#'+imageGalleryID+' .image-gallery-preview-portrait-scroller').scrollTop() - $('#'+imageGalleryID+' .image-gallery-preview-portrait-scroller').height()/2 + $('#'+imageGalleryID+' .preview-img-wrapper.active').height()
			}, 0);
		}
	}

	function closeImageGallery() {
		$('#' + imageGalleryID).removeClass('opened');
		$('body').removeClass('image-gallery-opened');
	}

	function isGalleryOpened() {
		if ($('body').hasClass('image-gallery-opened'))
			return true;
		return false;
	}

	function isGalleryExist() {
		if ($('#' + imageGalleryID).length)
			return true;
		return false;
	}

	//#region pre-load images
	// from https://stackoverflow.com/questions/476679/preloading-images-with-jquery
	// jQuery version
	function preloadImages(arrayOfImages) {
		$(arrayOfImages).each(function () {
			$('<img />').attr('src',this).appendTo('body').css('display','none');
		});
	};
	function preloadImage(imageURL) {
		$('<img />').attr('src',imageURL).appendTo('body').on('load',function(){
			console.log('preload finish at '+ $.now() +' ' + imageURL);
			preloadSet.add(imageURL);
			this.remove();
		});
	};

	// pure Javascript version
	function preloadPictures(pictureUrls, callback) {
		var i,
			j,
			loaded = 0;
	
		for (i = 0, j = pictureUrls.length; i < j; i++) {
			(function (img, src) {
				img.onload = function () {                               
					if (++loaded == pictureUrls.length && callback) {
						callback();
					}
				};
	
				// Use the following callback methods to debug
				// in case of an unexpected behavior.
				img.onerror = function () {};
				img.onabort = function () {};
	
				img.src = src;
			} (new Image(), pictureUrls[i]));
		}
	};
	//#endregion

	var loadingImage = "data:image/gif;base64,R0lGODlhgACAAKUAADx6vIy+7Mzi/GSe3Oz2/EyOzKzS/OTy/Hyy7ESGxJzK9NTq/Gym3Pz+/FSW1ESCxOz+/Lze/NT+/IS67Dx+vJTC9NTm/IS27HSq5FyW1OT+/Iy+9Mzm/GSi3PT6/FSS1LTa/Hy27EyKzKTO9Nzu/Gym5PT+/MTi/Nz+/Dx+xFya1P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQArACwAAAAAgACAAAAG/sCVcEgsGo/IZLJhgkA0pmMkNBkZLAeldsvter9bk0mDkpjPmuMIwG4nOhtDFkyv2+tMzXm/TxvXbYFuFyAed4eIdw0QZXyOZn5FgIKUbCoKBImam0ZMjY+gkUSTlaUMIA2cqopkoK6QaqWybQ8Khqu4Ww16r72iQ6SzpSkBmbnHRLu9yxK/QsHCpRQTt8iri8zMzivQ0aUPI6nWm4zZ2rHe6QUR44jK5ud/6fMAGNXtXybw2SgQRyAfUtDzVuAEPi/v9jlCoQGCCXFbFoCY0CHBwFLUDmox8UmhBIYPE5Go4OCiIAdzNBrR59GMw1wHKqgwyeaBQZVEILSEAhHZ/oERH2iOwCmE5T4oRE8MuDiBqBCd5lBEcSpkwdJ0Iag+ZSZVa5EIIqIh8LrVVT+yRxTMwoC2rCMNPdsOOTCTElu5K6DumYo3raC7SOKS43tELwrBfYlwsFhPCUd/qqASNqITbmItBFRkXXJm8iGjEjwTEX0ZDGgJiOk06Bi69DGOfA4nYm2GtOs7sN8i0uvI9m3TtDsr6uX7N5fcoGSrDs6nuPEkyF1t28Jb+nM8zJuDWb1M+fXtXFMj4fXK+3fTzCAfZ+b8fBLyr8QXgR/KvaLsaNb3Mm8f/TL5QtD3SHv9JVHdI+ohcdoj0xXYBXe9yCegIwA6uNEyCRbRwDIN/lrYxYR78DfEgRR6+NkypOHXjImIgJjfSv+xeGKElPkiIyIqZriCigTeqOB+RSwYm4+HbEjjiL3oSOQXLrpERJOoLYmbjUIYaZaU95U3hJB7KInlh0eSuNeXdoh5BmRQVkjmEVbWt+MrHa6pBH4orNAmgnLWoeIKXAqXJxhp9mmGmn+ORpyZgxb6xZ29IVqnoggl2eSjkHaBXznWVWopnEyI4emnhGoqRqekjqrpqaimquqqrLbqqlxkoCDrrLN6yWqstNL6hJavEoGfBpP2OgSjfDjRi7BVJololMIKGpqzPSq6bAPEdokslEL8iiyQb74ibLUvLhttns5CVm6v/lBOBa4ZlLa6H0Qqhiqns6Isa2ul9hrK66rrJjosj6w6226AVKoKpY7OMotqwojlaHDBRSyrcKX9tsYmhqhCOfF8MVaa8L0Jx4mlihsbofG4JoYcRnfyelhxyUeQfC+RGotcFHvkMhOqxiIS+fLMGsaDJYTltSyxBEA7SLLFi5Jsc38Jr1gHvWRK3HJOmVb9CsrJBPe0iWJ+zRkfYoO90NVHgNYh2sZVx3ZhsHCWdF+7+KYX10oAq4SVll2Xm91I4yLfnV0ZF51veOMWHARvj5PQmG2tW3hf0WlHVtR9ozUGil5V/grjnWvsJ1EvOwI6Tpvvk3iRojO4ej6tm67VktHJnS44ph69nkjU5b2UCBO4ezS5V0S3BAkU0S4CrPF9NI4L7VGdtVKszA9YWvHVxx1x9m85bw023GuPdfhOPvc489tAz6H3KqWOPtzZI1Wg+x6lX738HtIPj/07sY/XIkvrA/zg0Q//laYJ5uAfVzKXJwBCDEm+8N2pgNcKsg0wRA0JSa869YSGpK0fULAdXoIAACH5BAkJACoALAAAAACAAIAAhTx6vIy+9Mzi/GSe3Oz2/KzS/FSW1OTy/HSu5ESGxLze/KTO9NTq/Pz+/ESCxJzG9Gym3Oz+/Lza/NT+/IS27Dx+vJTC9NTm/LTa/FyW1HSq5OT+/IzC9Mzm/PT6/LTW/Hyy7EyKzMTi/Nzu/Gym5PT+/Nz+/IS67Dx+xFya1P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+QJVwSCwaj8hkslGKRDalY2mziZRKDaV2y+16v9vrxjQpmzfHiNlsMjmz4Lh8Lmdu1vgy2qjOr01QcHSDhHURZH55e0V9iXhugoWSk0NMiI6KaZiJVZGUn2ANY5ucmqR+kKCqXKKnjotEja55EZ6rt62zpXy6r7a3kw2yvXiwQ8PEa7XAn4fJu4zPiSZRzIS50pm82X4bv9ZcJdyoEVJt44/V4F3Y2YBW30ZMT5fZ3uth9cSAWIXC+vvi4RMnzcoqYXeeUcNnilggcAiflWM4hGAvKBSFTHGY8ZiuhR0rJTxlLCMyVOpCEikBUJtKISfZTHzZ0M9Mmipi3sOJpN3+GZ6x8qQEWnPCTSMEVhlM0siEQKIaEZUkwiBBAVB9hkbbCVWLqKlDGIQAAKADJYsTtK7sOqkqWQAJDkhqoE8tW0pu3wIw8JRLS7t3CeXVC4ACoZhpA39i4ICwXhF0GmwCrPgLY8d6E3io0xIP5cpbRiTATBiBHMRrwIJmlYI0YQyhOv/puzrJgcauyfL9MtKR09qDMOR++8ALWkefgW8BMRxAhaRcekNTPqeEgeaGw5D6TX0QgwrDn2+R7id59y0Lmp/QcrzbeX/Xc1fYnIR8HtrvtYhobmEJKdX5fQFBeN+gVgZ+ASrBQHMfICGbHglKMmBuA0hBCoIRJrHfcHL+RYMJgBl60VpuxRXxYGIhElLAcBkU0d4jKRZSAgrDQQfTJkfFKAdzuS1AhH1rYKjjERu6RkIlm5gw5DU0upZARTguSQgCw41wIybmSZnEij0KAaQZQmpJBAHDgSDEgyCKqcVorqWggmSY5KimFyTIp8KLa2Q5pxEccIgnmHvKocBwIhgYZqAjDFcAakoGGkcDwz3w5QSNOgoGm6SdgKalcYxImgZMXCHqqIc6OkIHIqQqggQCrCqAlZzGKuustNZq6624DjlGG7z2KmeuKuzaq6+TVgosEWgWe2wRcDrixCbLEtFsIs9iUuqcf5ZxxWTRXulIA9Pa1G2w0Kqwabf+SZ5Z7rLhamOgno5ma5RGUS47KYrtwrhskoKceO2S8sJi4K+zDrxSurnmi0ckdHGLq7zGerlJmoHem6O8E/wbIsa/nEiwo/eCZWDGtSqcZ0+kfDznvSQjwbLG+WH8McYUL3liy/WRAu/G/2nHr6UmB+lXypayXDPGKGJ7CoIscydm0GaozCxJajb88xcjz6vlzUl7YfWHWiJdsxEBqznytYiNHSBqOzPbktoJ6uSPS4Ei4/QgaAEI813D7H2l3lpTJwpljbStBRVKNMvVaixpq4QaUj+aeDq1NW4GZYbj3dIygfnkOFBBg9SV5eXxJLbfMrKc+SSkp4y6HBu5svqdNclwTlHsusweGcuc6G4c7+KqlPU0toPyjzS+E4I0Jm4kPw/XviXvD/QTQwEvQsBP/Hohw8/ShpxTnIPO5Z1T78pU3c+yOFvCjA/hNu5HzpPnz6Dv/vqMZ/9KUfVL3xHuybCfPfz3EgDqQoAB3B5OjndA/m2neADrHgK3g7+qOQNs8HvFUmg1j1EUw4Hv6Ee0QvWEKpjjCU1QYCGCAAAh+QQJCQAoACwAAAAAgACAAIU8eryMvuzU6vxcmtSs0vzs9vxMisx0ruScyvTU/vy83vz8/vxEgsSUxvRspty82vzs/vxUktSEtuyUwvTk8vy02vx8tuykzvTk/vw8fryMvvTc7vxknty01vz0+vxMjsx8suzc/vzE4vxEhsRspuT0/vxcltSkzvz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCUcEgsGo/IZHJRgkAwpWMJg4GUSguldsvter/bKyaUKJsxR4jZHAo5s+C4fC5nYtb4Mtqozq9DUHB0g4R1EGR+eXtFfYl4boKFkpNDTIiOimmYiVWRlJ9gC2ObnJqkfpCgqlyip46LRI2ueRCeq7ets6V8uq+2t5MLsr14sEPDxGu1wJ+HybuMz4khUcyEudKZvNl+GL/WXCXcqBBSbeOP1eBd2NmAVt9GTE+X2d7rYfXEgFiFwvr74uETJ83KKmF3nlHDZ4pYIHAIn5VjOIRgLygUhUxxmPGYroUdKyU8ZSwjMlTqQhIpAVCbSiEn2Ux82dDPTJooYt7DiaTd/hmesfKkBFozwU15qwwmaRRCIFGNiEqudAOqz9BoO59qESW1kpmrdCwmAFtR6ySWa5yy00fW7Fl9TQu1bOt2EFqXc2KOrfvprh+6WzcB5tvFLyq1Rxa0xDOYsBLD0L7oXdPVMavFjENhZoPYcs9Tcb2MdBTa8xyxjo4+PtXYtJLRjjrD7ub62mY94UiVrn36lNrZQnkXmlxGdRHUtIXbJiUQOJ7OyldvMi5kAanK0b8454yEeALo2ZMgD37kNvbwojdJHf8cfSH2abe9ci/pturbrelLJ318Uwj9/jAXFCbUAajddERsVwZ4BkqhnleY/NfgINZFWBGCEw6i4Hcw/gmW4SDETbQhgx8SUeF8KGx2XolabPbfiYkUyOIWt6EAXxn5zRgNJkxsQqKOOQlG3I86wvjXZBICGcp0Ciap5BebOYPik1Bi4s0VWGbZD5VfXMEEFl56yeWYZJZp5plopqlmdmO04eabMqIJQgQDRGACnXbSqUGTax7xAQCABiqoBXz2aaKgiAIaAHGGEkFBooheMGSjQogAqaAK3LgXpQhcGugGRtJCKQoHeAqoECqO+qenEaC6CaUFmArAAR1ikiOQBMiKgEYY9lmqqQJU51+jI8gqyG1EZiiArA4MmFqfGui60rBqLlCsqRuYiJ+aCsj6gREbrggkCbJOYISm/hyeuYGsAFBQXq9l/urpAN0JWOa6shLwGbxcWsCuB0lsmC6Xy8oqwX5TUskBu+6+Rsqt7uXKbBi6JSucBwawmy2NpMRpoLyeNpvbw0B2wG676flnsWcUMMDuwV6EmtyHHkTAbgYMemdUiSB72kEcil33oaXs0iuHpuJmNwHDdOiVdHhLe6ovHUHjxWK0kIpModUzBpBoBgC/R5kSK9fltaDBTtIHdtZ5bJYodJ0NwNSUUEH2GWUPhEjcAASgikBGguSYYXRVkBFkxeV9EHAQ4xJh49Yg/hVP6CaQFU4befiS5DEqfprAk4ckc8eee5G5LpBfA3o3qYNxei9u36LziDTLHCRlMq1LUnmESl3TxG3+5R4M8CRBkSNCq6tX+nDo/EHVuW02H/rbxOsi1ezWL/+JMNJbXtQ4sePkkzTXS3+5Z68/U/44GEWX/kXfXyQ85ckXE78r57v3D/zyzZJKiU2YxfpAkz8W7c9K96NM78g0j1HYr39sqMKWDPWlJ1TBHE9ogvYKEQQAIfkECQkALAAsAAAAAIAAgACFPHq8jL70zOL8ZJ7c7Pb8rNL8TI7M5PL8dK7kRIbEnMr01Or8/P78vN78fLbsRILEbKbc7P78VJbU1P78PH68lML01Ob8pM70xN78hLbsXJbU5P78jML0zOb8ZKLc9Pr8tNb8fLLsTIrM3O78bKbk9P783P78PH7EpM78xOL8hLrsXJrU////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv5AlnBILBqPyGSSUYpENqVjabOJlEoMpXbL7Xq/2+vGNCmbN8eI2WwyObPguHwuZ27W+DLaqM6vTVBwdIOEdRFkfnl7RX2JeG6ChZKTQ0yIjoppmIlVkZSfYAxjm5yapH6QoKpcoqeOi0SNrnkRnqu3rbOlfLqvtreTDLK9eLBDw8RrtcCfh8m7jM+JJlHMhLnSmbzZfhu/1lwl3KgRUm3jj9XgXdjZgFbfRkxPl9ne62H1xIBYhcL6++LhEyfNyiphd55Rw2eKWCBwCJ+VYziEYC8oFIVMcZjxmK6FHSslPGUsIzJU6kISKQFQm0ohJ9lMfNnQz0yaLGLew4mk3f4ZnrHypARac8JNeasMJmlkQiBRjYhKrnQDqs/QaDufahEltZKZq3QsTgBbUesklmucstNH1uxZfU0LtWzrdhBal3Nijq376a4fuls3AebbxS8qtUcYtMQzmLASw9C+6F3T1TGrxYxDYWaD2HLPU3G9jHQU2vMcsY6OPj7V2LSS0Y46w+7m+tpmPeFIla59+pTa2UJ5F5pcRnUR1LSF2yYlEDiezspXbzIuhAGpytG/OOeMhPgE6NmTIA9+5Db28KI3SR3/HH0h9mm3vXIv6bbq263pSyd9fJMJ/f4wFxQm1AGo3XREbFcGeAZKoZ5XmPzX4CDWRVgRghMOouB3MP4JluEgxE20IYMfElHhfCxsdl6JWmz234mJFMjiFrexAF8Z+c0YDSZMbEKijjkJRtyPOsL412QSAhnKdAomqeQXmzmD4pNQYuLNFVhm2Q+VX1zBBBZeesnlmGSWaeaZaKapZnZjtOHmmzKi2eabcDa5ZnlW2nmnidMRtyefBA75p0aC3bjXoEMaScugLGwohIqM+vfoJoMqWkyHmOQIpKETcfrnhtVY+sef/glyG5EZGgpLiHeyeqGFaooaXyX4qWmok0JsuCKQG6pmKIdn/vqLfXI+WJQfqLon61efYUjmhsAeAW2y2f0q46+7TnhbtEhAq6l72IahG7W1LWsGYv7bxmkgtNn+euiM7kIH7W4ZmlvcF/ZOkG10io0LhndGlbjtu170a+yE7u7bn5UseoeqXgpHN9m3JrYUcXY6BXjpk8jQ29tPS2Q4DLke6auEdeqaxUAGKSjRCMWvYXdiVpYdsAIAJ7S8VMCgCGQkSI41kAAARFOgMxIwh9XSMnV94ADRUANgNFHLAv1UAyJEHfXUOCVMsiQdkKD12FyrBBmBX89hgdhjt112RvnSkrYXC7Dd9t1vM+TTLBitI4DddwfOwUsAT8O0KgdUYEDgjBNdQNfcuJG0iRgEIEHjjSfQAVAGc0PFFV+MUIAKA5yAOeYrEKBV4bO0YVwKIUiw+IvptANwQV2do2OyESjUXrsEBxAmjO64GXGB76crYNrez0jVO/KBI6B6bRt5fsTx0I+twQLVQssw79lHPcDm4HqfXBHYZ4/ACA3+c9ERz/tugALTf9gE39fXTkEG7D/p/vdFiF/gVlABC5xpHqPYGPralgAIVAAEc9PPl55QhSOAYAUIcIACFHC0pwQBACH5BAkJACYALAAAAACAAIAAhTx6vIy+9Mzm/Fya1Oz2/KzS/HSq5NT+/EyKzJzK9Nzu/Pz+/Hyy7ESCxJzG9GSi3Oz+/JTG9NTm/MTe/OT+/FSS1IS27Dx+vJTC9GSe3PT6/LTa/HSu5Nz+/EyOzKTO/OTy/Hy27ESGxGym5PT+/NTq/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb+QJNwSCwaj8hkckGCQCikI4lCgZBIC6V2y+16v9srpXMomylHiNnc6Tiz4Lh8LmdS1vgy2qjOrztQcHSDhHUQZH55e0V9iXhugoWSk0NMiI6KaZiJVZGUn2ALY5ucmqR+kKCqXKKnjotEja55EJ6rt62zpXy6r7a3kwuyvXiwQ8PEa7XAn4fJu4zPiR1RzIS50pm82X4Uv9ZcJNyoEFJt44/V4F3Y2YBW30ZMT5fZ3uth9cSAWIXC+vvi4RMnzcoqYXeeUcNnilggcAiflWM4hGAvKBSFTHGY8ZiuhR0rJTxlLCMyVOpCEiEBUJtKISfZTHzZ0M9MmiZi3sOJpN3+GZ6x8qQEWvPATXmrDCZp1EEgUY2ISq50A6rP0Gg7n2oRJbWSmat0LB4AW1HrJJZrnLLTR9bsWX1NC7Vs63YQWpdzYo6t++muH7pbNwHm28UvKrVHFrTEM5iwEsPQvuhd09Uxq8WMQ2Fmg9hyz1NxvYx0FNrzHLGOjj4+1di0ktGOOsPu5vraZj3hSJWuffqU2tlCeReaXEZ1EdS0hdsmJRA4ns7KV28yLmQBqcrRvzjnjIT4AejZkyAPfuQ29vCiN0kd/xx9IfZpt71yL+m26tut6UsnfXxTB/3+MBcUJtQBqN10RGxXBngGSqGeV5j81+Ag1kVYEYITDqLgdzD+CZbhIMRNtCGDHxJR4XwmbHZeiVps9t+JiRTI4ha3mQBfGfnNGA0mTGxCoo45CUbcjzrC+NdkEgIZynQKJqnkF5s5g+KTUGLizRVYZtkPlV9cwQQWXnrJ5ZhklmnmmWimqWZ2Y7Th5psyotnmm3A2uWZ5Vtp5p4nTEbcnnwQO+adGgt2416BDGknLoCZsKISKjPr36CaDKlpMh5jkCKShE3H654bVWPrHn/4JchuRGRoKS4h3snqhhWqKGl8l+KlpqJNCbLgikBuqZiiHZ/76i31yPliUH6i6J+tXn2FI5obAHgFtstn9KuOvu054W7RIQKupe9iGoRu1tS1rBmL+28ZpILTZ/nrojO5CB+1uGZpb3Bf2HpBtdIqNC4Z3RpW47bte9GvshO7u25+VLHqHql4KRzfZtya2FHF2OgV46ZPI0NvbT0lokOEw5HqkrxIKiBCAcKLQ1QjFr2FXgggAAPCAyKYZ7HLAoAikQAM11+yBAJ6hRhfMdMwc9NIBlHwQcEiDovTSS1dAtFk3Rj3J1FRTzQAIRG3k4Utcd031BRjgrJLYrKmUstlw19xAAAR0xPYsWs+xAANx932BBVeDc7cu6gLjQN+IV5BA3QdJmUzehExwAeKID4BB4BQ2MTBpkBeiwACUU97AAwFsoAC+T0BLktOTBBD660IPUICOFG2is0bnoAjgAeyvh3DsOFm5pUEEvFPOwO/SUOUZARwUH/fx8o2zTG0CVOB819DvyA1G0QmQwfVBZz+gNNyjJ8AI4ItvcjLB0wcCBggUrz6mH03/4QQcTB76/EG6AgjrnpFAAEDXN/55pwq4Uw4BNhCAB8TPa797x5b2RIAJOMACHHhABMxRBSskcBJBAAAh+QQJCQAqACwAAAAAgACAAIU8eryMvvTM4vxkntzs9vxMjsys0vzk8vx0ruREhsSUxvTU6vz8/vxUltR8tuxsptzs/vy83vzU/vxEgsSUwvTU5vxcltSEtuzk/vw8fryMwvTM5vxkotz0+vxUktS02vx8suxMisycyvTc7vxspuT0/vzE4vzc/vxcmtSEuuz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCVcEgsGo/IZJJRgkAwpWMJg4GUSgyldsvter/bK+YkKZsxR4jZfDo5s+C4fC5nYtb4Mtqozq9PUHB0g4R1EGR+eXtFfYl4boKFkpNDTIiOimmYiVWRlJ9gDGObnJqkfpCgqlyip46LRI2ueRCeq7ets6V8uq+2t5MMsr14sEPDxGu1wJ+HybuMz4knUcyEudKZvNl+GL/WXCXcqBBSbeOP1eBd2NmAVt9GTE+X2d7rYfXEgFiFwvr74uETJ83KKmF3nlHDZ4pYIHAIn5VjOIRgLygUhUxxmPGYroUdKyU8ZSwjMlTqQhIpAVCbSiEn2Ux82dDPTJoqYt7DiaTd/hmesfKkBFpTwk15qwwmaXRCIFGNiEqudAOqz9BoO59qESW1kpmrdCxKAFtR6ySWa5yy00fW7Fl9TQu1bOt2EFqXc2KOrfvprh+6WzcB5tvFLyq1Rxi0xDOYsBLD0L7oXdPVMavFjENhZoPYcs9Tcb2MdBTa8xyxjo4+PtXYtJLRjjrD7ub62mY94UiVrn36lNrZQnkXmlxGdRHUtIXbJiUQOJ7OyldvMi6EAanK0b8454yEuATo2ZMgD37kNvbwojdJHf8cfSH2abe9ci/pturbrelLJ3180wn9/jAXFCbUAajddERsVwZ4BkqhnleY/NfgINZFWBGCEw6i4Hcw/gmW4SDETbQhgx8SUeF8Kmx2XolabPbfiYkUyOIWt6kAXxn5zRgNJkxsQqKOOQlG3I86wvjXZBICGcp0Ciap5BebOYPik1Bi4s0VWGbZD5VfXMEEFl56yeWYZJZp5plopqlmdiA0YIGbcL5pgQZrHjFGG3jmCQEJAPTp558c1GmEiiD8aSgABQhq4nQBHPpnBopCmJoBjv45QqQ2CmZCpX4agOmQBHDaZwCYbijEBKKigKmLQnAgKqSKGqlNo6IuoGiIQkQgKgB0CrphNaGmqqh/gqCw6wF13igBLCnsqkCduA6xqagerClrHpEwkMCuG6iprJNCNCsqCGpuqNoG/rsCQACaynJohAe7knrmhl2JsGsGHZjZLlkHpEuBmRu6ewQC9yI7ZrsyLpAuuWPeJjASrnLLpXcrortrAUQqp5iAWxgb75MBryiEwul2q6N3D2tR6K4hrMvitbR8cUAG6QZa4sbEgkFBuryWGPBeYHRQQLoOfNjusnNYzCkCLHqXMa2OMj3jZDnK00DUSupUyAg0/yl11nnsRse0fX6dWIbDVK2EAmU/BohwotDViNpaIMAwEndlZRnOchulikBGguQYanTRbVeMGVvjE45EQfaH4cw4/hVPMBeTeF8BQy7J0WYs89JGrmhOYTKeUwS6LqLPsbgrGK1zei8yWoPyizSlg/KPQrGDI/ksbqSuwjwOR+i7P8FfB0WOCP183eVVofMHVUZMcY7zEkBv1u7SSDW7LnqbJQz1SMuHjvWOrZ6M9tR3b9nrz6A/TuvKsX9RUQ4NT5P8rNM/i/ro3c69/v6p3YSasD8AooJ/N5PSlAZkJaWUaR6jKIb+3rElQX3pCVUwxxOawDxVBAEAIfkECQkAKgAsAAAAAIAAgACFPHq8jL7szOL8ZJ7c7Pb8rNL8TI7M5PL8dK7kRIbEnMr01Or8/P78vN78fLbsRILEbKbc7P781P78PH68lML01Ob8XJrUxN78hLbs5P78jL70zOb8ZKLc9Pr8tNb8VJLUfLLsTIrMpM703O78bKbk9P783P78PH7ExOL8hLrs////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv5AlXBILBqPyGSSUYpEMqVjKZOJlEoMpXbL7Xq/22vGJCmbM8eI2WwyObPguHwuZ2bW+DLaqM6vTVBwdIOEdRFkfnl7RX2JeG6ChZKTQ0yIjoppmIlVkZSfYAxjm5yapH6QoKpcoqeOi0SNrnkRnqu3rbOlfLqvtreTDLK9eLBDw8RrtcCfh8m7jM+JJlHMhLnSmbzZfhm/1lwl3KgRUm3jj9XgXdjZgFbfRkxPl9ne62H1xIBYhcL6++LhEyfNyiphd55Rw2eKWCBwCJ+VYziEYC8oFIVMcZjxmK6FHSslPGUsIzJU6kISKQFQm0ohJ9lMfNnQz0yaKmLew4mk3f4ZnrHypARaU8JNeas0oFDSyIRAohoRlVzpBlQBABOWJlGzE6oWUVMrmRk6qMIEAFi1IiHrdQ7LNU+7EEiAFm3Wtsze/om7hUPdunfxqtJbjJCIv38nXBD8yaIftl0OnECceDHjQo5R8ZU3gDLiCQ0uDyL8Ss5hz4gdiKbDoKVQMAQeoP77AfJqVqecfgExG/CB26NPHVWyoHfd0MAHjcS0mYRxABCSX3O9JmyRDc8ndJB+7VRcCM+Rcx8UU5mWEc8tjPdH3YxA3sYXrMdMavgQApN7I5gvablmJAo8RwB/9G0C2QfG7UdgIf65REQFz42wYIHMGZGCcRxM2N8mw/6FYJxlGpK3iQlFFNfbBCGyt0kkp80WQIoMckiEc71JCGNwmCzSwVmzJXDjdJiQKAQKxmHwIyEN4gFHgL2BeKQc5ZUxEQLGbfbkEQxssgeCs31w5SDtkdhBkV/S0Z4EKkDYWwFlzhGlBAx4EF+bcmQmFJOzbUdnKAZqcOKecWSJSQRUzqYeoGC0F4EFvUWH6BftZTDCBihUesGllwrw26NeXMEEFp56yumopJZq6qmopqrqamO04eqr9qna6quwJsnGqkZEamsZQuIqhKCOOLGJr2IN+qaViNqJxxUGEpvTisAmEuupu5YhRKTOjnjtsL5G2w1MzeKqrHkqjGvGtP6kVitBNd7m0auqIwpyJrJlmqtHUIOu+uZN9krwrqnt5hFJa+Ge2u+/KqhrHaLqDtcvnAaT8suZ6NKpMBJvQkxqwMv2VF+p6mp8RMj0hvgwug8vfOWZIiMRsm1PphwGKbrtybGSXLBcMYwhq1zRKTCn+HDLWoRc85U3k8sOSV8SHC8YGRu1MtCBsuzzfENfLYWWX2ZcskfQXBll0F+1pPWEOvnjYJvIHI3jvUscOczXGMPt8c5tiQJzI2SDQYUSwHa1ml57Sw2KQN6CJBppMPfdWEvLCOZTGY5DFGTlDJHWMU5Z0z3YyzRpPqjnkmzkCuafJB0s6W6F/FpHk7uC0ZI6phOD9y1RTxO5Kv9Ig/pg3LjxO5ZNsHw5UE5zQ8UVXyDkOimC85T7LG3YN8U56IwlufG6TDX9LNF7JUz2duNL/u04xZ6M9+SHv/jzORb1zOzr1b6+/BcN35b93eMvO+t5c0b/tvGR3R2pCeDzHyrchzQBloaArzBIqeYxisJAkA1V6Ee3rvCEKpjjCU0AoCqCAAAh+QQJCQAqACwAAAAAgACAAIU8eryMvuzM5vxkntzs9vys0vxMjszU/vx0ruScyvS82vxEhsTc7vz8/vx8tuycxvTs/vxcltREgsSUxvTU5vxspty02vzk/vzE3vyEtuw8fsSUwvRkotz0+vy01vxUktTc/vx8suykzvS83vxMiszk8vz0/vxcmtTU6vyEuuz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kCVcEgsGo/IZJJBKYgchaPpcoGYTA2ldsvter9bRiE1kADOZ8cRcmi7QSAIJAuu2+92ggexQPvRIWtug4MgF1h4iYp4BBsnf5CAgoSUb3OLmJlGDR4VkZ9ngUZslaVtVXSaqnkBZqCgokWkpqZxqau4SiUZGq++sUSztLSXucZEJSG+ywDAQ8LDtBe3x5odG73Mv5PR3cXVmAUk2szOQtDdtCAm4IolnuTl3Ond0+12Hq7xvgsTUnD00q2756UDgn2fJFSYMIJBlwYmIFwAEdCUPYJKUIxD6KdCAQKLGkCgWJEQCGoYh3jIxhGBgFwiL5R8wy4lkQ0cAUQogBKX/kiSJSHYFDKCY4SXNqeUvDBUyIN4BjA0HdJAZjqmU1U8XbZAQdYiJoBa/CpkwisNUciOIqZWCM5IFTq0PVK1Eta5ASClnYsEmtAkPRdZUZL3jIESfLWEPaUk7F9NpGoiyVtBcmLAVJQ0cGNZkYlBnYsgvexZbGAwDcQeCE1a02eTp72obsO6dWm7itBxtu169u47m2nV5v1lca3YgH0TGk58i3FpdnRTutsctfLl1qOdrA6823YvVtUh597Ym5fXw5iT3xKe1ngh7UtRX18ndbT5SNAfp59Iv6nx8VWiHn9bSDfIY/ndR6Ai9g0TW4CUvLdgecMgWERw0E2oCISF/gRmoBsSapiEfwIicR1jIm44DH4qkBhhip5Fg9KHB7AIIxgnHmChCjkOeKNiw4AAVpA/MihjMBUWqSJbQ3AIopL9rUgVkVDi0WApQgrh4oFVJuJkG3TQ6GOXfSWpwpcHhEjmhVLymOGadpwoJIal7AhnFzm2mN6ddqAJkYN81rElZzSqGagKdAr4YZaHepEoJRKp0yiOxJxo46QmSgPRFZx2amijV2wqaqiYlmrqqaimquqqrDY3ERywxmonq6/GKuuXjLY6hKW46krEo4TIMYyvUxJTKLF6CjcobcgWCiyXxKIphKXIUpmnr8+6gZWYvi6ro5ZmtopmTdm2keuq/kGmkuOnZHpLHY2zlgovEd6ee2q5YP7a46r1GoHmpY2iuaO3aaZKcE85xhvov2UCaiq+qyEBscJwolkwEhazmyLBChMMMJk5XpyExWP+6LFz2mlMIMQiKxEyxUVa/PEQBEd8Z80hWvwdmSzD/Gs9a1653xc0tuHzgiHb/IXQ8nVZ88wJvlll0SobCLWIH5ZMl29Xpyhd14BN1yg6O0eprWZTE6LyWjVq9i19VTE3i9ZcZBb2KWunZJzcb6sSW6IDNfec0lIk5ds3l9VFCd3HlBt4YoNjR9bTebtG8leRE1N5fxb/NhTLkG4OhlIVMY6J4kuZbgfpQWVVdC2I+z3Sg0zMYk67JapfGFHSteTuN+8rHqJ1TJ3fJ3omrwcEh51TAHR7iaQx/TyKskxv1/E+JX/VPNb3TRzq07OovfH0sX67+N0fMqH5S3GfOozs04M+7Rf9+FNF8ysfu5IRye9+LfXj0/2k9oz7DOZeEZmI2NhmkiogAltXkEgV/iGRiGAvE0EAADs=";
		
}( jQuery ));