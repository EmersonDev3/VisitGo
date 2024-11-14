import axios from 'axios';

// Substitua pela sua chave da API Foursquare
const API_KEY = 'fsq33e+rbCCq1CXfAv6K/jMR4zjRTE53bmq4mYE28PaiWm4=';

// Função para buscar pontos turísticos próximos
const fetchTouristSpots = async (latitude, longitude) => {
    try {
        const response = await axios.get('https://api.foursquare.com/v3/places/nearby', {
            headers: {
                'Authorization': API_KEY,  // Autenticação com a chave da API
            },
            params: {
                latitude: latitude,  // Latitude do usuário
                longitude: longitude,  // Longitude do usuário
                radius: 1000,  // Raio em metros para buscar locais próximos
                categories: '4bf58dd8d48988d181941735',  // Categoria de pontos turísticos
            },
        });
        return response.data;  // Retorna os dados dos locais
    } catch (error) {
        console.error('Erro ao buscar pontos turísticos:', error);
        return [];
    }
};

// Exemplo de uso da função
const getNearbyTouristSpots = async () => {
    const latitude = -23.55052;  // Exemplo de latitude (São Paulo)
    const longitude = -46.633308;  // Exemplo de longitude (São Paulo)

    const spots = await fetchTouristSpots(latitude, longitude);
    console.log(spots);  // Exibe os locais no console
};

getNearbyTouristSpots();
