// Initialize the map
const map = L.map('map').setView([-20.345, -40.377], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);


let currentMarker = null; // To store the current marker
let selectedMarker = null;



function toggleAddButton(enable) {
    let addButton = document.getElementById('add-new-button');
    if (enable) {
        addButton.disabled = false;
    }
    else {
        addButton.disabled = true
        addButton.setAttribute("title", "Salvar este ponto");
    }
};

// Function to remove the current marker
function removeCurrentMarker() {
    if (currentMarker) {
        map.removeLayer(currentMarker); // Remove marker from map
        currentMarker = null; // Reset marker reference

        // Clear form fields
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';

        toggleAddButton(false);
    }
}

map.on('contextmenu', function (e) {
    // Prevent the default context menu from appearing
    e.originalEvent.preventDefault();

    const { lat, lng } = e.latlng;

    // Update the form fields
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);

    // Add or update the marker
    if (currentMarker) {
        currentMarker.setLatLng([lat, lng]);
    } else {
        currentMarker = L.marker([lat, lng], { icon: createCustomMarker('orange') }).addTo(map);
    }

    // Show "Loading..." popup initially
    currentMarker.bindPopup(`<strong>Selected Location</strong><br>Loading address...`).openPopup();

    toggleAddButton(true);
    // Fetch and update the address
    getAddress(lat, lng, currentMarker);
});

function getAddress(lat, lng, marker) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            const address = data.address ? getAddressHtml(data.address) : "Address not found";
            marker.setPopupContent(address).openPopup();
        })
        .catch(error => {
            console.error("Error fetching address:", error);
            marker.setPopupContent(`<strong>Selected Location</strong><br>Failed to load address`).openPopup();
        });
}
function getAddressHtml(address) {
    return `<strong>${address.road}</strong><br>${address.suburb} - ${address.city}<br>${address.postcode}`;
}

function createCustomMarker(color = 'blue') {
    return L.icon({
        iconUrl: `assets/images/point-${color}.webp`, // find new icons 
        iconSize: [35, 35], // Size of the icon
        iconAnchor: [10, 34], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -34] // Point from which the popup should open relative to the iconAnchor
    });
}

// Function to add a point to the map
function addPointToMap(lat, lng, name, details) {
    const marker = L.marker([lat, lng]
        , { icon: createCustomMarker() } // Red pin
    );
    marker.bindPopup(`<div class="popup-details"><strong>${name}</strong><br>${details}</div>`);
    marker.on('click', function () {
        // Get the marker's coordinates and center the map on them
        selectedMarker = { marker, previusZoom: map.getZoom(), previusLatLng: map.getCenter() };
        map.flyTo(marker.getLatLng(), 19); // Change zoom level as needed
    });
    marker.addTo(map)
    return marker
}

function updateVisibleMarkers(markerList) {
    const visibleMarkers = [];
    const bounds = map.getBounds(); // Get current map bounds

    // Check which markers are within the bounds
    markers.forEach((marker, index) => {
        if (bounds.contains(marker.getLatLng())) {
            visibleMarkers.push(`Marker ${index + 1}`);
        }
    });

    // Update the visible markers list
    const visibleMarkersList = document.getElementById('visible-markers');
    visibleMarkersList.innerHTML = visibleMarkers.map(marker => `<li>${marker}</li>`).join('');
}

// Update the list when the map view changes
map.on('moveend', updateVisibleMarkers);

map.on('click', resetZoom);
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        resetZoom();
        if (currentMarker) {
            removeCurrentMarker()
        }
    }
});

function resetZoom() {
    if (selectedMarker) {
        map.flyTo(selectedMarker.previusLatLng, selectedMarker.previusZoom)
        selectedMarker = null
    }
}