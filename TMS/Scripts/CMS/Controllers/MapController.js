CHUNOApp.controller('MapController', ['$rootScope', '$scope', '$controller', '$sce', 'olData', 'olHelpers', '$controller', '$q', '$timeout',
    function ($rootScope, $scope, $controller, $sce, olData, olHelpers, $controller, $q, $timeout) {
        $controller('CommonController', { $scope: $scope });
        //=========================================
        var self = this;
        $rootScope.main = self;
        self._headerHeight = 30;
        self._bottomHeight = 200;
        self._mapElement = $('#mapElement')
        self._headerElement = $('#headerElement')
        self._bottomElement = $('#bottomElement')
        //=============================================
        //==========map init===========================
        var getStyle = function (feature) {
            var color = 'grey'; //getColor($scope.countries[feature.getId()])
            if (feature.getProperties().maxspeed == '80') {
                color = 'green';
            } else if (feature.getProperties().maxspeed == '60') {
                color = 'red';
            }
            var style = olHelpers.createStyle({
                fill: {
                    color: color,
                    opacity: 0.4
                },
                stroke: {
                    color: 'white',
                    width: 3
                }
            });
            feature.normalStyle = [style];
            return [style];
        };
        angular.extend($scope, {
            // override defaults controls
           
            center: {
                lat: 10.7284672,
                lon: 106.6837292,
                zoom: 15
            },
            view: {
                rotation: 0
            },

            // add custom controls settings
            controls: [
                { name: 'zoom', active: true },
                { name: 'rotate', active: false },
                { name: 'attribution', active: false }
            ],
            geojson: 
                {
                    name: 'NguyenVanLinh',
                    source: {
                        type: 'GeoJSON',
                        url: g_url_geojson_nguyenvanlinh
                    },
                    style: getStyle
                    /*
                   {
                        fill: {
                            color: 'grey' //rgba(255, 0, 0, 0.8)'
                        },
                        stroke: {
                            color: 'white',
                            width: 1
                        }
                    }*/
                }
            ,
            defaults: {
                controls: {
                    zoom: false,
                    rotate: false,
                    attribution: false
                },
                interactions: {
                    mouseWheelZoom: true
                },
                events: {
                    layers: ['mousemove', 'mouseout', 'click'],
                    map: ['singleclick', 'pointermove'],
                    marker: ['click']
                }
            },
            icon_style : {
                image: {
                    icon: {
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: 1,
                        src: g_url_icon_path + 'cctv/security-camera-24.png'
                    }
                }
            },
            cctv: {
                name :'cctv - 001',
                lat: 10.7290235232822474,
                lon: 106.68631885570476,
                label: {
                    message: 'chumano'
                },
                style: {
                    image: {
                        icon: {
                            anchor: [0.5, 1],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: 1,
                            src: g_url_icon_path + 'cctv/security-camera-24.png'
                        }
                    }
                }
            }
        });
        $scope.myiframe_display = 'none';
        $scope.currentCCTV = { name: '', url: '' ,videourl :'',login_videourl:''}
        $scope.cctv_click = function (cctv) {
            cctv.url = g_url_cctv_image;
            cctv.currenturl = cctv.url;
            cctv.ipaddress = '192.168.0.90';
            cctv.login = 'root:root';
            cctv.videourl = "http://" + cctv.ipaddress + "/mjpg/video.mjpg";
            cctv.login_videourl = "http://" + cctv.login + "@" + cctv.ipaddress + "/mjpg/video.mjpg";
            cctv.streamurl = g_url_cctv_stream;

            cctv.login_videourl = $sce.trustAsResourceUrl(cctv.login_videourl);
            $scope.myiframe_display = '';

            $scope.currentCCTV = cctv;
          
        
            //$("#cctvModal button.modal-ok").unbind('click'); //must have to unbind, otherwise duplicate event is called
            //$("#cctvModal button.modal-ok").click(function () {
                //$("#cctvModal").modal('hide');
            //});
            //==================================
            //$("#cctvModal").modal('show');
            //$("#cctvModal").draggable(
            //    {
            //        handle: ".modal-header"
            //    }); $("#cctvModal").modal({ backdrop: false });
            //    $("#cctvModal").modal('show');
            
            // Jquery draggable
            $('#cctvModal').draggable({
                handle: ".modal-header"
            });

            $('#cctvModal').css("top", "50%");
            $('#cctvModal').css("left", "50%");
            $('#cctvModal').css("margin-top", "-125px");
            $('#cctvModal').css("margin-left", "50-150px");

            $('#cctvModal').modal({
                backdrop :false,
                show: true
            });

            var TIMEOUT = 1000;
            var refreshInterval = setInterval(function () {
                $scope.$apply(function () {
                    cctv.currenturl = cctv.url + '?' + new Date().getTime();
                });
            }, TIMEOUT);

            $('#cctvModal').on('show.bs.modal', function () {
                
            });
            $('#cctvModal').on('hide.bs.modal', function () {
                $scope.$apply(function () {
                    cctv.login_videourl = cctv.videourl = $sce.trustAsResourceUrl('about:blank');
                    $scope.myiframe_display = 'none';
                });
                clearInterval(refreshInterval);
            });
        }
                        
        
        
        olData.getMap('mapElement').then(function (map) {
            self._map = map;
            var previousFeature;
            var overlay = new ol.Overlay({
                element: document.getElementById('countrybox'),
                positioning: 'center-center',
                offset: [-26, 56],
                position: [0, 0]
            });
            var overlayHidden = true;
            var isLayerClick = false;
            
            $scope.$on('openlayers.map.singleclick', function (event, data) {
                if (!isLayerClick) {
                    map.removeOverlay(overlay);
                    overlayHidden = true;
                    $('#countrybox').hide();

                    if (previousFeature) {
                        previousFeature.setStyle(getStyle(previousFeature));
                    }
                }
                isLayerClick = false;
            });

            // Mouse over function, called from the Leaflet Map Events
            $scope.$on('openlayers.layers.NguyenVanLinh.click', function (event, feature, olEvent) {
                isLayerClick = true;
                $scope.$apply(function (scope) {
                    scope.selectedLink = feature ? feature.getProperties() : '';
                });

                
                if (!feature) {
                    map.removeOverlay(overlay);
                    overlayHidden = true;
                    $('#countrybox').hide();
                    return;
                } else if (overlayHidden) {
                    $('#countrybox').show();
                    map.addOverlay(overlay);
                    overlayHidden = false;
                }

                overlay.setPosition(map.getEventCoordinate(olEvent));
                if (feature) {
                    feature.setStyle(olHelpers.createStyle({
                        fill: {
                            color: '#FF0'
                        }
                    }));

                    if (previousFeature && feature !== previousFeature) {
                        previousFeature.setStyle(getStyle(previousFeature));
                    }

                    previousFeature = feature;
                }
            });
        });
        //load DeviceObject
        $scope.devices = [
            {
                ID: 1, Code: '', Name: '', Lat: '', Long: '', IPAddress :'',
                ObjectType : 'CCTV'
            }
        ];


        $scope.isBottomShow = false;
        //=============================================
        function applyHeight() {
            //wait panel colapse
            setTimeout(function () {
                self._windowWidth = window.innerWidth;
                self._windowHeight = $(window).height();// window.innerHeight;

                var height_func_div = $("#funcdivElement").outerHeight(true);
                var height_header = self._headerElement.outerHeight(true);
                var height_bottom = self._bottomElement.outerHeight(true);
                self._mapHeight = self._windowHeight - height_header - height_bottom - height_func_div;
                //self._mapElement.height(self._mapHeight);
                self._mapElement.animate({
                    height: self._mapHeight
                }, 100, function () {
                    // Animation complete.
                    //update map
                    setTimeout(function () {
                        olData.getMap('mapElement').then(function (map) {
                            //self._map = map;
                            map.updateSize();
                        });
                    }, 50);
                });
            }, 100);

        }

        //=============================================
        angular.element(window).bind('resize', function () {
            applyHeight();
            // manuall $digest required as resize event
            // is outside of angular
            //$scope.$digest();
        });

        angular.element(document).ready(function () {
            applyHeight();


            // $('#collapseOne').collapse({ 'toggle': true });


            $('#bottomElement').on('shown.bs.collapse', function () {
                $scope.isBottomShow = true;
                //call a service here 
                applyHeight();
            });

            $('#bottomElement').on('hidden.bs.collapse', function () {
                $scope.isBottomShow = false;
                //call a service here 
                applyHeight();
            });
        });

    }]);
