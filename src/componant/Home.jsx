import React, { useState } from 'react';

export const Home = () => {
    const [city, setCity] = useState('mumbai');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [weatherClass, setWeatherClass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedCity = city.trim().toLowerCase();

        // Clear previous errors when a new search is performed
        setError(null);
        setWeatherData(null);

        if (!formattedCity) {
            setError('Please enter a city name.');
            return;
        }

        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=b16223da47ed48bf915135942231011&q=${formattedCity}&aqi=no`, {
                method: 'GET',
            });

            if (response.status === 429) {
                setError('Request limit exceeded. Please try again later.');
                return;
            }

            if (!response.ok) {
                setError('City not found');
                return;
            }

            const data = await response.json();
            setWeatherData(data);

            const tempC = data.current?.temp_c;
            const condition = data.current?.condition?.text?.toLowerCase() || '';

            if (tempC > 35) {
                setWeatherClass('really-hot');
            } else if (tempC > 25) {
                setWeatherClass('hot');
            } else if (condition.includes('rain')) {
                setWeatherClass('rainy');
            } else if (condition.includes('wind')) {
                setWeatherClass('windy');
            } else {
                setWeatherClass(''); // Default or neutral weather
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while fetching data');
        }
    };

    return (
        <React.Fragment>
            <div className="container">
                <h1 className='weather-app'>Welcome to my home page</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        className='weather-search'
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        placeholder="Enter city" 
                    />
                    <button type="submit" className='btn'>Check Weather</button>
                </form>
            </div>
                   
            {error && (
                <div className='error-msg'>
                    <p>Error: {error}</p>
                </div>
            )}
            {weatherData && (
                <div className={`temp-Data container ${weatherClass}`}>
                    <h2>Weather Information</h2>
                    <p>City: {weatherData.location?.name}</p>
                    <p>Temperature: {weatherData.current?.temp_c}°C</p>
                    <img 
                        src={`https:${weatherData.current?.condition?.icon}`} 
                        alt={weatherData.current?.condition?.text} 
                    />
                    <p>Humidity: {weatherData.current?.humidity}%</p>
                    <p>Wind Speed: {weatherData.current?.wind_kph} m/s</p>
                </div>
            )}
        </React.Fragment>
    );
};
