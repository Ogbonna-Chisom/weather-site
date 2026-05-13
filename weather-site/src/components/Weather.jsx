import { useEffect, useState } from "react";

const Weather = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // FETCH WEATHER + FORECAST
  const search = async (city) => {
    try {
      // CURRENT WEATHER
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY }`;

      const currentResponse = await fetch(currentUrl);
      const currentData = await currentResponse.json();

      setData(currentData);

      // 3-DAY FORECAST
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY }`;

      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      // FILTER DAILY FORECAST
      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dailyForecast.slice(0, 3));

    } catch (error) {
      console.log(error);
    }
  };


  // LOAD DEFAULT CITY
  useEffect(() => { search("lagos");}, []);


  // HANDLE SEARCH
  const handleSearch = () => {
    if (city.trim() !== "") {
      search(city);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-100 to-gray-200 p-10 flex gap-6">

      {/* LEFT */}
      <div className="w-1/2 bg-white rounded-3xl p-10 shadow">
        <h2 className="text-lg">
          Simple Weather App
        </h2>

        <h1 className="text-6xl font-serif leading-tight mt-10">
          Check the sky before you step out.
        </h1>

        <p className="mt-6 text-gray-500">
          Search for any city to see weather.
        </p>

        <div className="flex mt-6 gap-3">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 p-3 rounded-full border outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-6 rounded-full cursor-pointer hover:bg-orange-600 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 bg-white rounded-3xl p-6 shadow">

        {data && (
          <>
            {/* CURRENT WEATHER */}
            <h2 className="text-2xl font-semibold">
              {data?.name}
            </h2>

            <h1 className="text-6xl font-bold mt-4">
              {Math.round(data?.main?.temp)}°C
            </h1>

            <p className="capitalize text-gray-500 mt-2">
              {data.weather[0]?.description}
            </p>

            {/* WEATHER DETAILS */}
            <div className="flex gap-4 mt-6">
              <div className="bg-blue-100 p-4 rounded-xl flex-1">
                <p className="text-sm text-gray-500">Wind</p>
                <h3 className="text-xl font-bold">
                  {data?.wind.speed} km/h
                </h3>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl flex-1">
                <p className="text-sm text-gray-500">Humidity</p>
                <h3 className="text-xl font-bold">
                  {data?.main?.humidity}%
                </h3>
              </div>

              <div className="bg-orange-100 p-4 rounded-xl flex-1">
                <p className="text-sm text-gray-500">Feels Like</p>
                <h3 className="text-xl font-bold">
                  {Math.round(data?.main?.feels_like)}°C
                </h3>
              </div>
            </div>


            {/* 3 DAY FORECAST */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                3-Day Forecast
              </h3>

              <div className="flex gap-4">
                {forecast?.map((day, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-2xl flex-1"
                  >
                    <h4 className="font-bold">
                      {new Date(day.dt_txt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        }
                      )}
                    </h4>

                    <p className="text-2xl font-bold mt-2">
                      {Math.round(day.main?.temp)}°C
                    </p>

                    <p className="text-gray-500 capitalize mt-1">
                      {day.weather[0].description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Weather;
