function ReplaceWithPolyfill() {
    'use-strict'; // For safari, and IE > 10
    var parent = this.parentNode, i = arguments.length, currentNode;
    if (!parent) return;
    if (!i) // if there are no arguments
      parent.removeChild(this);
    while (i--) { // i-- decrements i and returns the value of i before the decrement
      currentNode = arguments[i];
      if (typeof currentNode !== 'object'){
        currentNode = this.ownerDocument.createTextNode(currentNode);
      } else if (currentNode.parentNode){
        currentNode.parentNode.removeChild(currentNode);
      }
      // the value of "i" below is after the decrement
      if (!i) // if currentNode is the first argument (currentNode === arguments[0])
        parent.replaceChild(currentNode, this);
      else // if currentNode isn't the first
        parent.insertBefore(this.previousSibling, currentNode);
    }
  }

if (!Element.prototype.replaceWith)
    Element.prototype.replaceWith = ReplaceWithPolyfill;
if (!CharacterData.prototype.replaceWith)
    CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
if (!DocumentType.prototype.replaceWith) 
    DocumentType.prototype.replaceWith = ReplaceWithPolyfill;

const createInbentaSearchSDKWidget = function (sdkVersion, sri, domainKey, apiKey, sdkConfiguration, options){

    addSDKScript();

    function addSDKScript() {
        var scriptSdk = document.createElement('script');
        scriptSdk.type = 'text/javascript';
        scriptSdk.src = 'https://sdk.inbenta.io/search/' + sdkVersion + '/inbenta-search-sdk.js';
        if (sri){
            scriptSdk.integrity = sri;
            scriptSdk.crossOrigin = "anonymous";
        }
        scriptSdk.onload = function () {
            initWidget();
        };
        document.getElementsByTagName('head')[0].appendChild(scriptSdk);
    }

    function initWidget() {

        const sdk = InbentaSearchSDK.createFromDomainKey(domainKey, apiKey, sdkConfiguration);
        
        // Create elements.
        const container = document.createElement("div");
        container.classList.add("inbenta-search-widget-wrapper");
        container.innerHTML = '<div class="inbenta-search-widget__launcher"> \
                    <i class="inbenta-widget-search-icon inbenta-widget-search-icon--question-filled"></i> \
                </div> \
                \
                <div class="inbenta-search-widget" style="display:none"> \
                    <div class="inbenta-search-widget__wrapper"> \
                        <div class="inbenta-search-widget__header"> \
                            <div class="inbenta-search-widget__header__title"> \
                                ACME Help \
                            </div> \
                            <div class="inbenta-search-widget__header__actions"> \
                                <i class="inbenta-search-icon inbenta-search-icon--minimize"></i> \
                                <i class="inbenta-search-icon inbenta-search-icon--close"></i> \
                            </div> \
                        </div> \
                        <div class="inbenta-search-widget__container"> \
                            <div class="inbenta-search"> \
                                <div id="loader" class="inbenta-search-widget__loader"></div> \
                                \
                                <div id="search-box"></div> \
                                \
                                <div class="inbenta-search-info-bar"> \
                                    <div id="stats"></div> \
                                </div> \
                                \
                                <div class="inbenta-search-refinement-bar" style="display: none"> \
                                \
                                    <div class="inbenta-search-dropdown"> \
                                        <div class="inbenta-search-dropdown__trigger"> \
                                            <span></span><i class="inbenta-search-icon inbenta-search-icon--chevron-down"></i> \
                                        </div> \
                                        <div class="inbenta-search-dropdown__menu"></div> \
                                    </div> \
                                    \
                                    <div class="inbenta-search-refinement-bar__buttons"> \
                                        <div id="results-per-page-selector"></div> \
                                        <div class="inbenta-search-refinement-bar__filter inbenta-search-info-bar__refine__item"> \
                                            <i class="inbenta-search-icon inbenta-search-icon--filter"></i> \
                                        </div> \
                                    </div> \
                                </div> \
                                \
                                <div class="inbenta-search-wrapper" style="display: none"> \
                                    <div class="refinement-lists-wrapper"> \
                                        <div class="refinement-lists-wrapper__header"> \
                                            <button class="refinement-list__button"> \
                                                <i class="inbenta-search-icon inbenta-search-icon--chevron-left"></i> \
                                                <span>BACK</span> \
                                            </button> \
                                        </div> \
                                        <div id="refinement-lists"></div> \
                                    </div> \
                                    \
                                    <div class="inbenta-search-showing"> \
                                        <div class="inbenta-search-main"> \
                                            <div id="results"></div> \
                                            <div id="no-results"></div> \
                                        </div> \
                                    </div> \
                                </div> \
                                \
                                <div id="pagination"></div> \
                            </div> \
                        </div> \
                    </div> \
                    <div id="powered-by"></div> \
                </div>';
        document.body.appendChild(container);
        const launcher = container.querySelector(".inbenta-search-widget__launcher");
        const widget = container.querySelector(".inbenta-search-widget");
        const sdkContainer = container.querySelector(".inbenta-search-widget__container");

        const getWidgetStorageItem = function (storageKey) {
            let storage = localStorage.getItem('inbenta_search_widget_storage_' + apiKey);
            storage = storage ? storage = JSON.parse(storage) : {};
            const result = storage[storageKey] ? storage[storageKey] : false;

            return result;
        }

        const setWidgetStorageItem = function (storageKey, value) {
            let storage = localStorage.getItem('inbenta_search_widget_storage_' + apiKey);
            storage = storage ? storage = JSON.parse(storage) : {};
            storage[storageKey] = value;
            localStorage.setItem('inbenta_search_widget_storage_' + apiKey, JSON.stringify(storage));
        }

        const removeWidgetStorage = function () {
            localStorage.removeItem('inbenta_search_widget_storage_' + apiKey);
        }

        const createComponentHelper = function (name, target, options) {
            const component = sdk.component(name, document.createElement("div"), options);
            sdkContainer.querySelector(target).replaceWith(component.$el);
            return component;
        };

        const results = createComponentHelper("results", "#results", options.results);

        const searchStore = results.searchStore;
        
        const createComponent = function(name, target, options){
            const component = createComponentHelper(name, target, options);
            results.linkTo(component);
            return component;
        }

        const loader = createComponent("loader", "#loader", options.searchBox);
        const searchBox = createComponent("search-box", "#search-box", options.searchBox);
        const stats = createComponent("stats", "#stats", options.stats);
        const resultsPerPageSelector = createComponent("results-per-page-selector", "#results-per-page-selector", options.resultsPerPageSelector);
        const pagination = createComponent("pagination", "#pagination", options.pagination);
        const poweredBy = sdk.component("powered-by", "#powered-by", {});
        const noResults = createComponent('no-results', "#no-results", options.no_results);
        const refinementTabs = sdk.component("refinement-tabs", document.createElement("div"), options.refinementTabs);
        results.linkTo(refinementTabs);

        const isEmptyRefinementList = function (refinementLists) {
            return (typeof refinementLists === 'undefined'
                || typeof options.refinementLists.refinements === 'undefined'
                || options.refinementLists.refinements.length == 0)
        }

        if (isEmptyRefinementList(options.refinementLists)){
            document.body.querySelector(".inbenta-search-refinement-bar__filter").style.display = "none";
        }else{
            const refinementLists = createComponent("refinement-lists", "#refinement-lists", options.refinementLists);
            refinementLists.toggleFilters();
            const refinementsButton = sdkContainer.querySelector(".inbenta-search-refinement-bar__filter");
            const openRefinementLists = function () {
                widget.querySelector(".refinement-lists-wrapper").classList.add("inbenta-search-filters--active");
                refinementLists.$el.classList.add("inbenta-search-filters--active");
                widget.classList.add("inbenta-search-widget--filtering");
            };
            const closeRefinementLists = function () {
                widget.querySelector(".refinement-lists-wrapper").classList.remove("inbenta-search-filters--active");
                refinementLists.$el.classList.remove("inbenta-search-filters--active");
                widget.classList.remove("inbenta-search-widget--filtering");
            };
            const toggleRefinementLists = function () {
                widget.querySelector(".refinement-lists-wrapper").classList.add("inbenta-search-filters--active");
                refinementLists.$el.classList.toggle("inbenta-search-filters--active");
                widget.classList.add("inbenta-search-widget--filtering");
            };
            refinementsButton.addEventListener("click", function () {
                //  
                toggleRefinementLists();
            });
            sdkContainer.querySelector(".header__actions--clean").addEventListener("click", function () {
                // Close refinement lists after clicking the tray bin.
                closeRefinementLists();
            });
            widget.querySelector(".refinement-lists-wrapper button").addEventListener("click", function () {
                // Close refinement lists after clicking the tray bin.
                closeRefinementLists();
            });

            sdkContainer.addEventListener("click", function (event) {
                // Close refinement lists after clicking a refinement.
                if (event.target.matches(".inbenta-search-checkbox")) {
                    closeRefinementLists();
                }
            });
        }

        // Create the actions.
        const close = function() {
            minimize();
            var previousWrapper = document.querySelector(".inbenta-search-widget-wrapper");
            previousWrapper.parentNode.removeChild(previousWrapper);
            removeWidgetStorage();
            initWidget();
        };
        const minimize = function() {
            launcher.style.display = '';
            widget.style.display = "none";
            document.body.classList.remove("inbenta-search-widget--open");
            setWidgetStorageItem('isOpen', false);
        };
        const open = function() {
            launcher.style.display = "none";
            widget.style.display = '';
            document.body.classList.add("inbenta-search-widget--open");
            setWidgetStorageItem('isOpen', true);
        };

        const closeRefinementTabs = function () {
            document.querySelector(".inbenta-search-dropdown").classList.remove("inbenta-search-dropdown--active");
        };
        const toggleRefinementTabs = function () {
            document.querySelector(".inbenta-search-dropdown").classList.toggle("inbenta-search-dropdown--active");
        };

        const renderCustomRefinementTabs = function () {
            const triggerSpan = sdkContainer.querySelector(".inbenta-search-dropdown__trigger > span");
            const createItem = function (facetValue) {
                const div = document.createElement("div");
                div.classList.add("inbenta-search-dropdown__menu__item");
                div.classList.toggle("inbenta-search-dropdown__menu__item--active", facetValue.isRefined);
                div.innerText = facetValue.name + ' (' + facetValue.count + ')';
                if (facetValue.isRefined) {
                    triggerSpan.innerText = facetValue.name + ' (' + facetValue.count + ')';
                }
                div.addEventListener("click", function() {
                    facetValue.refine();
                    toggleRefinementTabs();
                });
                
                return div;
            };
            const items = [createItem({
                name: "All",
                count: searchStore.numberOfResultsPerRefinement(refinementTabs.attributeName),
                isRefined: true,
                refine: function() { searchStore.removeFacetRefinement(refinementTabs.attributeName) },
            })].concat(refinementTabs.facetValues.map(function (facetValue) {
                return createItem(facetValue);
            }));
            const dropdown = sdkContainer.querySelector(".inbenta-search-dropdown__menu");
            dropdown.innerHTML = "";
            items.forEach(function (item) {
                dropdown.appendChild(item);
            });
        };

        searchStore.on("result", function () {
            setWidgetStorageItem('searchStoreLastRequest', searchStore.$data.request);
            widget.classList.add("inbenta-search-widget-autocompleter-show");
            const display = searchStore.lastResponse ? '' : "none";
            sdkContainer.querySelector(".inbenta-search-refinement-bar").style.display = searchStore.hasResults ? display : "none";
            sdkContainer.querySelector(".inbenta-search-wrapper").style.display = display;

            renderCustomRefinementTabs();

            const hasRefinements = searchStore.getFacets("and")
                .concat(searchStore.getFacets("or"))
                .filter(function(attributeName) { return attributeName !== refinementTabs.attributeName; })
                .some(function(attributeName) { return searchStore.hasFacetRefinement(attributeName); });

            const classList = sdkContainer.querySelector(".inbenta-search-refinement-bar__filter").classList;
            const activeClass = "inbenta-search-refinement-bar__filter--active";
            if (hasRefinements) {
                classList.add(activeClass);
            } else {
                classList.remove(activeClass);
            }
        });

        // Add event listeners.
        launcher.addEventListener("click", function (event) {
            open();
        });
        widget.querySelector(".inbenta-search-icon--minimize").addEventListener("click", function() {
            minimize();
        });
        widget.querySelector(".inbenta-search-icon--close").addEventListener("click", function() {
            close();
        });
        sdkContainer.addEventListener("click", function(event) {
            if (event.target.closest(".inbenta-search-dropdown__trigger")) {
                event.preventDefault();
                toggleRefinementTabs();
            } else {
                closeRefinementTabs();
            }
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".inbenta-search-dropdown__trigger")) {
                closeRefinementTabs();
            } 
            if (event.target.matches(".inbenta-search-pagination__item a")) {
                document.querySelector(".inbenta-search-widget__container").scrollTop = 0;
            }  
        });

        if (getWidgetStorageItem('isOpen')){
            open();
            var searchStoreLastRequest = getWidgetStorageItem('searchStoreLastRequest');
            if (searchStoreLastRequest) {
                searchStore.$data.request.facetRefinements = searchStoreLastRequest.facetRefinements;
                searchStore.$data.request.page = searchStoreLastRequest.page;
                searchStore.$data.request.perPage = searchStoreLastRequest.perPage;
                searchStore.$data.request.query = searchStoreLastRequest.query;
            }
        }
    }
};
