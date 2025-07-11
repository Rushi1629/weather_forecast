import CurrentWeather from "@/components/common/CurrentWeather";
import FavoriteCities from "@/components/common/FavoriteCities";
import HourlyWeather from "@/components/common/HourlyWeather";
import WeatherDetails from "@/components/common/WeatherDetails";
import WeatherForecast from "@/components/common/WeatherForecast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"
import WeatherSkeletion from "@/components/ui/loading-skeleton";
import useGeolocation from "@/hooks/use-geolocation"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"

const WeatherDashboard = () => {

  const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeolocation();

  // console.log(coordinates);

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  // console.log(weatherQuery,data);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      // reload weather data

      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeletion />
  }

  if (locationError) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button onClick={getLocation} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }


  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data.Please try again.</p>
          <Button onClick={handleRefresh} variant={'outline'} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeletion />
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <FavoriteCities />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-6">

        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />

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

export default WeatherDashboard