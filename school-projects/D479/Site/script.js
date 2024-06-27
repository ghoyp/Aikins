document.addEventListener('DOMContentLoaded', () => {
    const airportUrl = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=new';
    const flightUrl = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights';
    const apiKey = '6bb85b5a27msh68bbc7d379b66c8p17d428jsnca9e9d161c83';
    const apiHost = 'sky-scrapper.p.rapidapi.com';

    const originAirportSelect = document.getElementById('origin-airport');
    const destinationAirportSelect = document.getElementById('destination-airport');
    const searchFlightsButton = document.getElementById('search-flights');
    const flightsContainer = document.getElementById('flights');

    function fetchAirports() {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                const result = JSON.parse(this.responseText);
                populateAirportOptions(result, originAirportSelect);
                populateAirportOptions(result, destinationAirportSelect);
            }
        });

        xhr.open('GET', airportUrl);
        xhr.setRequestHeader('x-rapidapi-key', apiKey);
        xhr.setRequestHeader('x-rapidapi-host', apiHost);

        xhr.send(null);
    }

    function populateAirportOptions(airports, selectElement) {
        selectElement.innerHTML = '';
        airports.data.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport.id;
            option.textContent = `${airport.name} (${airport.iata})`;
            selectElement.appendChild(option);
        });
    }

    function fetchFlights(originId, destinationId) {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                const result = JSON.parse(this.responseText);
                displayFlights(result);
            }
        });

        const url = `${flightUrl}?originSkyId=${originId}&destinationSkyId=${destinationId}&date=2024-07-01&cabinClass=economy&adults=1&sortBy=best&currency=USD&market=en-US&countryCode=US`;
        xhr.open('GET', url);
        xhr.setRequestHeader('x-rapidapi-key', apiKey);
        xhr.setRequestHeader('x-rapidapi-host', apiHost);

        xhr.send(null);
    }

    function displayFlights(flights) {
        flightsContainer.innerHTML = ''; // Clear any existing content
        flights.data.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.classList.add('col-md-4', 'mb-4');
            flightCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${flight.airline}</h5>
                        <p class="card-text">From: ${flight.originCity} (${flight.originIATA})</p>
                        <p class="card-text">To: ${flight.destinationCity} (${flight.destinationIATA})</p>
                        <p class="card-text">Price: ${flight.currency} ${flight.price}</p>
                        <p class="card-text">Departure: ${flight.departureTime}</p>
                        <p class="card-text">Arrival: ${flight.arrivalTime}</p>
                    </div>
                </div>
            `;
            flightsContainer.appendChild(flightCard);
        });
    }

    fetchAirports();

    searchFlightsButton.addEventListener('click', () => {
        const originId = originAirportSelect.value;
        const destinationId = destinationAirportSelect.value;
        fetchFlights(originId, destinationId);
    });
});
