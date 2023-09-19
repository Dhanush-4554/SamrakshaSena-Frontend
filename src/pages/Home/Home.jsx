import {React , useState , useEffect} from 'react'
import axios from 'axios';
import Layout from '../../components/Layout/Layout'


const Home = () => {
  const [Locations,setLocations] = useState([]);

    const getlocations = async() =>{
        const {data} = await axios.get('/api/agencyLocations');
        console.log(data);
        setLocations(data.AllLocation);
    }

    useEffect(()=>{
      getlocations();
    },[])

  return (
    <Layout title=" SIH 2023 | Team Name">
        <div>
      {
        Locations.map((loc)=>{
            return(
              //this is for testing
              <div>
                <h1>{loc.AgencyName}</h1>
                <h1>{loc.Longitude}</h1>
                <h1>{loc.Latitude}</h1>
                <h1>{loc.Category}</h1>
                <hr/>
                <hr/>
              </div>
            )
        })
      }
    </div>
    </Layout>
  )
}

export default Home
