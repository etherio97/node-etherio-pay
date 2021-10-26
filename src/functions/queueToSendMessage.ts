import axios from "axios";

const API_URL = "https://calm-depths-62261.herokuapp.com";

export default function queueToSendMessage(msisdn: string, body: string) {
  return axios.post(`${API_URL}/message`, { msisdn, body }).catch((err) => err);
}
