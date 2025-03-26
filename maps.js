// Initialize map and markers
let map;
let markers = [];
let userLocation = null;
let infoWindow = null;

// Sample event data (replace with API data in production)
const sampleEvents = [
    {
        id: 1,
        title: 'Beach Cleanup Drive',
        location: { lat: 40.7128, lng: -74.0060 },
        date: '2024-03-15',
        description: 'Join us for a day of cleaning up our beautiful coastline.',
        category: 'cleanup',
        spotsLeft: 15,
        points: 150
    },
    {
        id: 2,
        title: 'Tree Planting Workshop',
        location: { lat: 40.7129, lng: -74.0061 },
        date: '2024-03-20',
        description: 'Learn about sustainable forestry and help plant trees.',
        category: 'planting',
        spotsLeft: 20,
        points: 100
    },
    {
        id: 3,
        title: 'Sustainable Living Workshop',
        location: { lat: 40.7130, lng: -74.0062 },
        date: '2024-03-25',
        description: 'Learn practical tips for reducing your carbon footprint.',
        category: 'workshop',
        spotsLeft: 30,
        points: 80
    }
];

// Initialize the map
function initMap() {
    // Default center (New York City)
    const defaultCenter = { lat: 40.7128, lng: -74.0060 };
    
    // Create map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: defaultCenter,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    // Initialize info window
    infoWindow = new google.maps.InfoWindow();

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                addUserMarker(userLocation);
                loadNearbyEvents();
            },
            (error) => {
                console.error('Error getting location:', error);
                loadAllEvents();
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        loadAllEvents();
    }

    // Add event listeners for filters
    document.getElementById('eventTypeFilter').addEventListener('change', filterEvents);
    document.getElementById('dateRangeFilter').addEventListener('change', filterEvents);
    document.getElementById('distanceFilter').addEventListener('change', filterEvents);
}

// Add user location marker
function addUserMarker(location) {
    const userMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#28a745',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });
    markers.push(userMarker);
}

// Add event marker
function addEventMarker(event) {
    const marker = new google.maps.Marker({
        position: event.location,
        map: map,
        title: event.title,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#ff4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });

    // Add click listener
    marker.addListener('click', () => {
        showEventInfo(event, marker);
    });

    markers.push(marker);
}

// Show event info window
function showEventInfo(event, marker) {
    const content = `
        <div class="event-info">
            <h5>${event.title}</h5>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Spots Left:</strong> ${event.spotsLeft}</p>
            <p><strong>Points:</strong> ${event.points}</p>
            <button class="btn btn-success btn-sm w-100" onclick="registerForEvent(${event.id})">
                Register
            </button>
        </div>
    `;

    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

// Load nearby events
function loadNearbyEvents() {
    if (!userLocation) return;

    // Clear existing markers
    clearMarkers();

    // Add user marker
    addUserMarker(userLocation);

    // Get distance filter value
    const maxDistance = parseInt(document.getElementById('distanceFilter').value) * 1000; // Convert to meters

    // Filter and display nearby events
    const nearbyEvents = sampleEvents.filter(event => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(userLocation),
            new google.maps.LatLng(event.location)
        );
        return distance <= maxDistance;
    });

    // Add event markers
    nearbyEvents.forEach(event => addEventMarker(event));

    // Update nearby events list
    updateNearbyEventsList(nearbyEvents);
}

// Load all events
function loadAllEvents() {
    clearMarkers();
    sampleEvents.forEach(event => addEventMarker(event));
    updateNearbyEventsList(sampleEvents);
}

// Clear all markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Update nearby events list
function updateNearbyEventsList(events) {
    const listElement = document.getElementById('nearbyEventsList');
    listElement.innerHTML = '';

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item mb-3';
        eventElement.innerHTML = `
            <h6>${event.title}</h6>
            <p class="mb-1">${event.description}</p>
            <small class="text-muted">${event.date}</small>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <span class="badge bg-success">${event.points} points</span>
                <span class="text-muted">${event.spotsLeft} spots left</span>
            </div>
            <button class="btn btn-success btn-sm w-100 mt-2" onclick="registerForEvent(${event.id})">
                Register
            </button>
        `;
        listElement.appendChild(eventElement);
    });
}

// Filter events based on selected criteria
function filterEvents() {
    const eventType = document.getElementById('eventTypeFilter').value;
    const dateRange = document.getElementById('dateRangeFilter').value;
    
    let filteredEvents = [...sampleEvents];

    // Filter by event type
    if (eventType) {
        filteredEvents = filteredEvents.filter(event => event.category === eventType);
    }

    // Filter by date range
    if (dateRange) {
        const today = new Date();
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            switch (dateRange) {
                case 'week':
                    return eventDate <= new Date(today.setDate(today.getDate() + 7));
                case 'month':
                    return eventDate <= new Date(today.setMonth(today.getMonth() + 1));
                case 'nextMonth':
                    return eventDate <= new Date(today.setMonth(today.getMonth() + 2));
                default:
                    return true;
            }
        });
    }

    // Update map and list
    clearMarkers();
    if (userLocation) {
        addUserMarker(userLocation);
    }
    filteredEvents.forEach(event => addEventMarker(event));
    updateNearbyEventsList(filteredEvents);
}

// Register for an event
function registerForEvent(eventId) {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        // Show login modal
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }

    // Handle event registration
    console.log(`Registering for event ${eventId}`);
    // Add your registration logic here
}

// Check if user is logged in
function isUserLoggedIn() {
    // Add your authentication check logic here
    return false;
}

// Initialize map when the page loads
window.onload = initMap; 