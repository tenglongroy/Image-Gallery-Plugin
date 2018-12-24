# Image-Gallery-Plugin
a plugin to show a set of images.

[DEMO](http://tenglongroy.pythonanywhere.com/image-gallery)

--version 1.0
This plugin is based on Jquery, the usage of the plugin is as below:


```HTML
<div class="my-image-container">
  <img src="some-image-src" data-preview-img="some-image-thumbnail-src.jpg" data-display-img="some-image-large-size-src.jpg" data-caption="some-caption-div-ID">
</div>
$('.my-image-container img').imageGallery({
    landscape_preview: true
});
```

Features:

Currently there's only one option for the plugin, 'landscape_preview' defaults to be false. The preview image list will be to the right; whilst when set to true, the preview image list will be at the bottom. So you can change which layout you like.

The URL of preview image (thumbnail size) should be placed under "data-preview-img" attribute, and original image (full size or large size) should be placed under "data-display-img".

The caption for each image is also available, if you identify the ID of the caption div, the plugin will capture the HTML of the caption div and show it underneath the display image.

The original image will not be loaded until it is upon displaying, which can save the resources by avoiding loading all the original-size images at the same time. (a pre-load of the previous and next images will be the next phase development)
