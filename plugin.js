/**
 * Image Gallery Plugin by Roy Teng on 2018/10/25
 * Github: https://github.com/tenglongroy/Image-Gallery-Plugin
 * This project is MIT licensed.
 */



(function( $ ) {
	//https://learn.jquery.com/plugins/basic-plugin-creation/
	
	var imageGalleryID = 'image-gallery-main';
	var currentImageIndex = -1;
	var imageList = undefined;
	var settings = undefined;

	$.fn.imageGallery = function(options) {
		settings = $.extend({
            // These are the defaults
            landscape_preview: false
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
			$('body').append("<div id='" + imageGalleryID + "'><div class='image-gallery-body'><div class='top-bar'><div class='index-container'><input class='index' type='number' value='" + currentImageIndex + "'></input><span>/ " + imageAmount + "</span></div><div class='action-bar'><div class='action-icon action-preview'><i class='icon ig-preview'></i></div><div class='action-icon action-close'><i class='icon ig-close'></i></div></div></div><a class='image-gallery-nav prev'><i class='icon ig-prev'></i></a><a class='image-gallery-nav next'><i class='icon ig-next'></i></a><div class='image-gallery-display-container'><img class='current-image'> <div class='current-image-background'></div></div></div><div class='image-gallery-bottom-container'><div class='image-gallery-caption'></div><div class='image-gallery-preview-landscape-container'><div class='image-gallery-preview-landscape-scroller'></div></div></div><div class='image-gallery-preview-portrait-container'><div class='image-gallery-preview-portrait-scroller'></div></div></div>");
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

		function prevImage(){
			//let currentIndex = imageList.index(currentObject);
			//let nextIndex = (currentObjectIndex+imageList.length-1)%imageList.length;
			//thisObjectIndex = (currentObjectIndex+imageList.length-1)%imageList.length;
			currentImageIndex = (currentImageIndex+imageList.length-1)%imageList.length;
			showImage(imageList);
		}

		function nextImage(){
			//let currentIndex = imageList.index(currentObject);
			//let nextIndex = (currentObjectIndex+1)%imageList.length;
			//thisObjectIndex = (currentObjectIndex+1)%imageList.length;
			currentImageIndex = (currentImageIndex+1)%imageList.length;
			showImage();
		}

		function showImage(){
			// add current image to display container
			//$('#'+imageGalleryID+' .current-image').attr('src', imageList.eq(currentImageIndex).data('display-img'));
			$('#'+imageGalleryID+' .current-image-background').css('background-image', 'url('+imageList.eq(currentImageIndex).data('display-img')+')');
			$('#'+imageGalleryID+' .current-image-background').removeClass('image-gallery-plugin-zoom-in');
			$('#'+imageGalleryID+' .index-container input.index').val(currentImageIndex+1);
			showCaption();
			activatePreview();
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


}( jQuery ));