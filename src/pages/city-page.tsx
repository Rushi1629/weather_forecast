import CurrentWeather from "@/components/common/CurrentWeather";
import FavoriteButton from "@/components/common/FavoriteButton";
import HourlyWeather from "@/components/common/HourlyWeather";
import WeatherDetails from "@/components/common/WeatherDetails";
import WeatherForecast from "@/components/common/WeatherForecast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherSkeletion from "@/components/ui/loading-skeleton";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"

const CityPage = () => {

  const [searchParams] = useSearchParams();

  const parms = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          Failed to load weather data.Plaese try again.
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data || !parms.cityName) {
    return <WeatherSkeletion />
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">{parms.cityName},{weatherQuery.data.sys.country}</h1>
        <div>
          <FavoriteButton data={{ ...weatherQuery.data, name: parms.cityName }} />
        </div>
      </div>

      <div className="grid gap-6">

        <div className="flex flex-col gap-4">
          <CurrentWeather data={weatherQuery.data} />

          <HourlyWeather data={forecastQuery.data} />

        </div>

        <div>

          <WeatherDetails data={weatherQuery.data} />

        </div>

        <div>
          <WeatherForecast data={forecastQuery.data} />
        </div>

      </div>

    </div>
  )
}

export default CityPage