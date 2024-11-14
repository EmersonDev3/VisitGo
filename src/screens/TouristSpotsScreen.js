import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const TouristSpots = () => {
    const [touristSpots, setTouristSpots] = useState([]);
    const [loading, setLoading] = useState(true);

    // Substitua pela sua chave da API Foursquare
    const API_KEY = 'fsq33e+rbCCq1CXfAv6K/jMR4zjRTE53bmq4mYE28PaiWm4=';

    // Função para buscar os pontos turísticos
    const fetchTouristSpots = async (latitude, longitude) => {
        try {
            const response = await axios.get('https://api.foursquare.com/v3/places/nearby', {
                headers: {
                    'Authorization': API_KEY,
                },
                params: {
                    latitude,
                    longitude,
                    radius: 1000,
                    categories: '4bf58dd8d48988d181941735', // Código de categoria para pontos turísticos
                },
            });
            setTouristSpots(response.data.results);  // Atualiza o estado com os pontos turísticos
            setLoading(false);  // Define que o carregamento foi concluído
        } catch (error) {
            console.error('Erro ao buscar pontos turísticos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Exemplo de coordenadas (São Paulo)
        const latitude = -23.55052;
        const longitude = -46.633308;

        fetchTouristSpots(latitude, longitude);  // Chama a função para buscar os pontos turísticos
    }, []);

    return (
        <View>
            {loading ? (
                <Text>Carregando...</Text>  // Exibe uma mensagem de carregamento enquanto os dados não são recebidos
            ) : (
                <FlatList
                    data={touristSpots}  // Passa os dados recebidos para a FlatList
                    keyExtractor={(item) => item.fsq_id}  // Usa o ID exclusivo do local como chave
                    renderItem={({ item }) => (
                        <View style={{ padding: 10 }}>
                            <Text>{item.name}</Text>  {/* Exibe o nome do ponto turístico */}
                            <Text>{item.location.address || 'Endereço não disponível'}</Text>  {/* Exibe o endereço se disponível */}
                            <Text>Distância: {item.distance} metros</Text>  {/* Exibe a distância do ponto turístico */}
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default TouristSpots;
