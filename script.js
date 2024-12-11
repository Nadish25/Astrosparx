// Function to get user's location (latitude and longitude)
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => reject(error)
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

// Function to fetch planet data from the API and display it
async function fetchPlanetData() {
    try {
        // Get user's location
        const location = await getUserLocation();
        
        // Get the current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;  // JavaScript months are 0-indexed
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const timezone = new Date().getTimezoneOffset() / -60;  // Offset in hours
        
        // API endpoint and headers
        const url = "https://json.freeastrologyapi.com/planets";
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': 'v6Xs6eL5syftNedsFQMT3mYlkozHd2i5QmDI8zKe'
        };
        
        // Request payload
        const requestPayload = {
            "year": year,
            "month": month,
            "date": date,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "timezone": timezone,
            "config": {
                "observation_point": "topocentric",
                "ayanamsha": "lahiri"
            }
        };

        // Fetch data from the API
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestPayload)
        });

        if (response.ok) {
            const data = await response.json();
            const output = data.output[1];  // Assuming data you need is in index 1
            
            // Get planet positions and display them
            let planetList = '';
            const celestialBodies = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

            celestialBodies.forEach(planet => {
                if (output[planet]) {
                    planetList += `
                        <div class="planet">
                            <img src="${planet.toLowerCase()}.png" alt="${planet}">
                            <h3 style="font-family: 'PlanetFont';">${planet}</h3>
                            <p>Current Direction: ${output[planet].fullDegree}°</p>
                        </div>
                    `;
                }
            });

            // Display the data in the #planet-data div
            document.getElementById('planet-data').innerHTML = planetList;
        } else {
            document.getElementById('planet-data').innerHTML = '<p>Sorry, we couldn\'t fetch the celestial data.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('planet-data').innerHTML = '<p>Sorry, there was an error fetching the data.</p>';
    }
}

// Call the fetchPlanetData function when the page loads
fetchPlanetData();
