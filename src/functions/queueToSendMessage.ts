import axios from "axios";

const API_URL = "https://calm-depths-62261.herokuapp.com";

export default function queueToSendMessage(
  msisdn: string,
  body: string,
  throwOnError = false
) {
  return axios.post(`${API_URL}/message`, { msisdn, body }).catch((err) => {
    if (throwOnError) {
      throw err;
    }
    return err;
  });
}
