import axios from '../axios.customize';

export const getHomePageApi = () => {
    const URL_API = "/api/home";
    return axios.get(URL_API);
};