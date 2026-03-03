import { GET_ALL_AIRPORTS } from "../api"
import { http } from "../http"


class airport{
  getAllAirports() {
    return http.get(GET_ALL_AIRPORTS);
  }
}

const airportInstance = new airport();
export default airportInstance;