var imageGalleryID = 'image-gallery-main';
var currentImageIndex = -1;
var imageList = undefined;


function imageGallery(selector){
	imageList = $(selector);
	let imageAmount = imageList.length;
	$(selector).on('click', function(){
		if(isGalleryExist()){	// container already exist, show it
			currentImageIndex = imageList.index($(this));
			//showImage($(selector), $(this));
			showImage();
			$('#'+imageGalleryID).show();
		}
		else{	// container not exist, need to create a new one
			currentImageIndex = imageList.index($(this));
			//imageGalleryInit($(selector), $(this));
			imageGalleryInit();
		}
	});

}



function imageGalleryInit() {
	let imageAmount = imageList.length;
	$('body').append("<div id='" + imageGalleryID + "'><div class='image-gallery-body'><div class='top-bar'><div class='index-container'><input class='index' type='number' value='" + currentImageIndex + "'></input><span>/ " + imageAmount + "</span></div><div class='action-bar'><div class='action-icon action-preview'><i class='icon ig-preview'></i></div><div class='action-icon action-close'><i class='icon ig-close'></i></div></div></div><a class='image-gallery-nav prev'><i class='icon ig-prev'></i></a><a class='image-gallery-nav next'><i class='icon ig-next'></i></a><div class='image-gallery-display-container'> <img class='current-image'> </div></div><div class='image-gallery-preview-container'> </div></div>");

	// add click Listener for icons
	$('#'+imageGalleryID+' .action-preview').on('click', function() {
		$('#'+imageGalleryID).toggleClass('preview-opened');
		isPreviewOpened = isPreviewOpened ? false: true;
	});
	$('#'+imageGalleryID+' .action-close').on('click', function() {
		$('#'+imageGalleryID).hide();
	});
	$('#'+imageGalleryID+' .image-gallery-nav.prev').on('click', function() {
		prevImage();
	});
	$('#'+imageGalleryID+' .image-gallery-nav.next').on('click', function() {
		nextImage();
	});
	$('#'+imageGalleryID+' .index-container input.index').on('change', function() {
		if(($(this).val()+"").match(/^\d+$/)){	//check if it is integer
			currentImageIndex = parseInt($(this).val())-1;
			showImage();
		}
		else{
			alert('Please enter a correct number.');
		}
	});

	// create preview container by adding preview path as image source
	for(let i = 0; i < imageList.length; i++){
		$('#'+imageGalleryID+' .image-gallery-preview-container').append('<div class="preview-img-wrapper"><img src="'+ imageList.eq(i).data("preview-img") +'"></div>');
	}
	$('#'+imageGalleryID+' .image-gallery-preview-container img').on('click', function(){
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
	$('#'+imageGalleryID+' .current-image').attr('src', imageList.eq(currentImageIndex).data('display-img'));
	$('#'+imageGalleryID+' .index-container input.index').val(currentImageIndex+1);
	activatePreview();
}

function activatePreview(){
	$('#'+imageGalleryID+' .preview-img-wrapper').removeClass('active');
	$('#'+imageGalleryID+' .preview-img-wrapper').eq(currentImageIndex).addClass('active');
}


// function openImageGallery(selector){
// 	if(isGalleryExist()){	// container already exist, show it
// 		$(imageGalleryClass).show();
// 	}
// 	else{	// container not exist, need to create a new one
// 		$('body').append("<div class='" + imageGalleryClass + "'></div>");
// 	}
// }




function isGalleryExist(){
	if($('#'+imageGalleryID).length)
		return true;
	return false;
}