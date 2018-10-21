var imageGalleryID = 'image-gallery-main';


function imageGallery(selector){
	let imageAmount = $(selector).length;
	$(selector).on('click', function(){
		if(isGalleryExist()){	// container already exist, show it
			$('#'+imageGalleryID).show();
		}
		else{	// container not exist, need to create a new one
			imageGalleryInit($(selector), $(this));
		}
	});

}


function imageGalleryInit(imageList, thisObject) {
	let imageAmount = imageList.length;
	$('body').append("<div id='" + imageGalleryID + "'><div class='image-gallery-body'><div class='index-container'><span class='index'></span><span>/ " + imageAmount + "</span></div><div class='action-bar'><div class='action-icon action-preview'><i class='icon ig-preview'></i></div><div class='action-icon action-close'><i class='icon ig-close'></i></div></div><a class='image-gallery-nav prev'><i class='icon ig-prev'></i></a><a class='image-gallery-nav next'><i class='icon ig-next'></i></a><div class='image-gallery-display-container'> <img class='current-image'> </div></div><div class='image-gallery-preview-container'> </div></div>");

	// add current image to display container
	$('#'+imageGalleryID+' .current-image').attr('src', thisObject.data('display-img'));

	// add click Listener for icons
	$('#'+imageGalleryID+' .action-preview').on('click', function() {
		$('#'+imageGalleryID).toggleClass('preview-opened');
	});
	$('#'+imageGalleryID+' .action-close').on('click', function() {
		$('#'+imageGalleryID).hide();
	});

	// create preview container by adding preview path as image source
	for(let i = 0; i < imageList.length; i++){
		$('#'+imageGalleryID+' .image-gallery-preview-container').append('<div class="preview-img-wrapper"><img src="'+ imageList.eq(i).data("preview-img") +'"></div>');
	}
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