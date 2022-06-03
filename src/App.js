import {
  IconButton,
  Input,
  SkeletonText,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import {getLatLng,getGeocode} from 'use-places-autocomplete';
import { useRef, useState } from 'react'

const center = { lat: 4.6777843, lng: -74.0951612 }
function App() {
  const google = window.google;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef("kakaroto")
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()



  async function calculateRoute() {
    // if (originRef.current.value === '' || destiantionRef.current.value === '') {
    //   return
    // }
    // eslint-disable-next-line no-undef
 
    console.log(google.maps)
    const directionsService = new google.maps.DirectionsService()

    const results = await directionsService.route({
      origin: '3.60971, -74.08175',
      destination: '4.60971, -74.08175',
      
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })

    console.log(results)
    let address='3.60971, -74.08175';
    const data=await getGeocode({address})
    console.log(data[0])
    const data2=getLatLng(data[0])
    console.log(data2) //get latituf and longitude
    console.log(results);
    console.log(results.routes[0].legs[0].start_location)

    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }
  const options = {
    componentRestrictions: { country: "co" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
    types: ["establishment"],
  };
  return isLoaded &&(

    <>

      
      <div className="p-4 m-3 shadow bg-white rounded">
          <div className="row">
          <div className='col-md-5'>
            <Autocomplete options={options}>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </div>
          <div className='col-md-5'>
            <Autocomplete options={options}>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </div>
            <div className="col-md-1">
            <button className='btn btn-dark 'type='submit' onClick={calculateRoute}>
              Calculate
            </button>
            </div>
            <IconButton
              className="col-md-1"
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </div>

          <div>
          
          </div>

        <div className='d-flex justify-content-between'>
          <p>Distance: {distance} </p>
          <p>Duration: {duration} </p>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </div>
      </div>

    <div className="map">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </>
  )
}

export default App
