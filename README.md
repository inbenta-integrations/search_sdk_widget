### OBJECTIVE
This integration is an example of how the Search SDK can be implemented as a floating widget. It aims to ease the development when a widget style is desired and inspire integrators to create other SDK implementations.

This integration includes **src/js** and **src/styles** which have all the front-end development and its styles and a small *index.html* which exemplifies how to do the integration on a website.

### FUNCTIONALITIES
This example includes some of the Search functionalities, but not all of them. Please feel free to extend this code with any new features you want to include. Currently, the features provided by this application are:
* Semantic search
* Autocompleter
* Stats
* Results per page selector
* Pagination
* No results
* Refinement Lists
* Refinement Tabs

For those mentioned components if no configuration has been provided, the script will use the default parameters defined by the components. 

### INSTALLATION
It's pretty simple to get this UI working.

1. Add the JS and CSS files on your website CMS.
2. Include the following scripts in the head of all pages you want to have the widget
```html
<script src="<path to the file>/sdk-widget.js"></script>
<link rel="stylesheet" type="text/css" href="<path to the file>/sdk-widget.css">
```
3. Add the following script in all pages you want to have the widget. It need to indicate:
* SDK version
* Subresource Integrity (see https://developers.inbenta.io/search/javascript-sdk/sdk-subresource-integrity)
* Domain key
* API key
* SDK Configuration (See configuration options on [https://developers.inbenta.io/search/javascript-sdk/sdk-setup](https://developers.inbenta.io/search/javascript-sdk/sdk-setup))
* Components Configuration (See configuration option for components at [https://developers.inbenta.io/search/javascript-sdk/sdk-components](https://developers.inbenta.io/search/javascript-sdk/sdk-components))
```html
<script type="text/javascript">
    createInbentaSearchSDKWidget(
        "1.22.0",
        "sha384-ifuG86EAWx0kUeqJZTJxHpdJDFlKrXW0JcaBz2UsA5hdIXbvM9OmBQt6I98payUv", // use null to skip check
        "<Domain key>",
        "<API key>",
        {}, // SDK configuration
        {} // Components configuration
    );
</script>
```
A simple example for the sdk configuration may be the next.

```javascript
{
    environment: "development"
}
```

A simple example for the components configuration may be the next.

```javascript
{
    refinementTabs: {
        attributeName: "<ATTRIBUTE_NAME>",
    },
    refinementLists: {
        refinements: [
            { attributeName: "<ATTRIBUTE_NAME>" },
        ]
    },
    pagination: {
        padding: 1,
    },
    searchBox: {
        autocompleter: {
            showViewAllButton: false,
        },
    },
}
```

### DEPENDENCIES
This implementation have no dependencies except for the Search SDK.

### SUPPORTED VERSIONS
This implementation has been tested with 1.22.0 Search SDK version.

## NOTES
In order to show properly the widget into mobile devices we recommend to add the next meta into the head tag of each page that includes the widget.
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

