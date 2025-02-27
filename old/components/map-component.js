const MapComponent = {
    props: {
        points: {
            type: Array,
            required: true,
        },
    },
    data: {
        map: null,
        currentMarker: null,
        selectedMarker: null,
    },
    mounted() {
        this.initMap();
        this.addMarkers();
        this.addListeners();
    },
    methods: {
        initMap() {
            // Initialize the map
            this.map = L.map('map').setView([-20.345, -40.377], 15);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.map);
        },
        addMarkers() {
            // Add markers for each point
            this.points.forEach((point) => {
                point.marker = this.addPointToMap(point);
            });
        },
        removeMarker(marker) {
            if (marker) {
                this.map.removeLayer(marker); // Remove marker from map
            }
        },
        addPointToMap(point) {
            const marker = L.marker([point.lat, point.lng], { icon: this.createCustomMarker(point.color) });
            marker.bindPopup(`<div class="popup-details"><strong>${point.name}</strong><br>${point.details}</div>`);
            marker.on('click', () => {
                this.selectedMarker = {
                    marker,
                    previusZoom: this.getZoom(),
                    previusLatLng: this.getCenter()
                };
                this.flyTo([point.lat, point.lng]); // Emit event to center the map
            });
            marker.addTo(this.map);
            return marker;
        },
        createCustomMarker(color = 'blue') {
            return L.icon({
                iconUrl: `assets/images/point-${color ?? 'blue'}.webp`, // Update with your icon path
                iconSize: [35, 35],
                iconAnchor: [10, 34],
                popupAnchor: [0, -34],
            });
        },
        addListeners() {
            this.map.on('click', this.resetZoom);
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.resetZoom();
                    if (this.currentMarker) {
                        this.removeMarker(this.currentMarker)
                    }
                }
            });
            // Handle right-click to add a new point
            this.map.on('contextmenu', (e) => {
                e.originalEvent.preventDefault();
                if (this.currentMarker) {
                    this.map.removeLayer(this.currentMarker); // Remove existing marker
                }

                const { lat, lng } = e.latlng;
                this.currentMarker = L.marker([lat, lng], { icon: this.createCustomMarker('red') }).addTo(this.map);

                // Emit event with the new coordinates
                this.$emit('add-point', { lat, lng });

                // Show "Loading..." popup initially
                this.currentMarker
                    .bindPopup(`<strong>Selected Location</strong><br>Loading address...`)
                    .openPopup();

                // Fetch and update the address
                this.getAddress(lat, lng, this.currentMarker);
            });
        },
        getAddress(lat, lng, marker) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then((response) => response.json())
                .then((data) => {
                    const address = data.address ? this.getAddressHtml(data.address) : 'Address not found';
                    marker.setPopupContent(address).openPopup();
                })
                .catch((error) => {
                    console.error('Error fetching address:', error);
                    marker.setPopupContent(`<strong>Selected Location</strong><br>Failed to load address`).openPopup();
                });
        },
        getAddressHtml(address) {
            return `<strong>${address.road}</strong><br>${address.suburb} - ${address.city}<br>${address.postcode}`;
        },
        flyTo(latlng, zoom = null) {
            this.map.flyTo(latlng, zoom ?? 18);
        },
        resetZoom() {
            if (this.selectedMarker) {
                this.flyTo(this.selectedMarker.previusLatLng, this.selectedMarker.previusZoom)
                this.selectedMarker = null
            }
        },
        getZoom() {
            return this.map.getZoom()
        },
        getCenter() {
            return this.map.getCenter()
        },
    },
    watch: {
        points(newPoints) {
            // Update markers when points change
            this.addMarkers();
        },
    },
    template:
        `
  <div id="map" class="flex-grow-1"></div>
  `
};