import axiosClient from './axiosClient'

const boardApi = {
    create: () => axiosClient.post('boards'),
    getAll: () => axiosClient.get('boards'),
    updatePosition: (params) => axiosClient.put('boards', params),
    getOne: (id) => axiosClient.get(`boards/${id}`),
    update: (id, params) => axiosClient.put(`boards/${id}`,params),
    delete: (id) => axiosClient.delete(`boards/${id}`),
    getFavourites: () => axiosClient.get('boards/favourites'),
    updateFavouritePosition: (params) => axiosClient.get('boards', params)
}


export default boardApi