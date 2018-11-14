# Image-Gallery-Plugin
a plugin to show a set of images.


--version 1.0
this plugin is based on Jquery. Use the plugin as imageGallery(imageSelector), the "imageSelector" is the selector which locates the images. For the example below, the "imageSelector" will be ".my-image-container img".

```HTML
<div class="my-image-container">
  <img src="some-image-src" data-preview-img="some-image-thumbnail-src.jpg" data-display-img="some-image-large-size-src.jpg">
</div>
```

the URL of preview image (thumbnail size) should be placed under "data-preview-img" attribute, and original image (full size or large size) should be placed under "data-display-img".
