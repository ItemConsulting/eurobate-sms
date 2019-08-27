import axios, {AxiosResponse} from 'axios';
import { EurobateParams, EurobateResponse } from "./index";

export function sendSMS(params: EurobateParams): Promise<EurobateResponse> {
  return axios.post('https://api.eurobate.com/json_api.php', params)
    .then((response: AxiosResponse<EurobateResponse>) => {
      return response.data;
    });
}
