import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const TouristSpots = () => {
    const [touristSpots, setTouristSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [photos, setPhotos] = useState({});
    const [nextPage, setNextPage] = useState(null);  // Variável para controlar a próxima página

    const API_KEY = 'fsq33e+rbCCq1CXfAv6K/jMR4zjRTE53bmq4mYE28PaiWm4=';

    // Função para buscar pontos turísticos
    const fetchTouristSpots = async (latitude, longitude, page = 1) => {
        try {
            const response = await axios.get('https://api.foursquare.com/v3/places/nearby', {
                headers: {
                    'Authorization': API_KEY,
                },
                params: {
                    latitude,
                    longitude,
                    radius: 1000,
                    categories: '4bf58dd8d48988d181941735', // Código para pontos turísticos
                    limit: 10, // Limita o número de pontos turísticos por página
                    offset: (page - 1) * 10, // Deslocamento para a próxima página
                },
            });

            setTouristSpots((prev) => [...prev, ...response.data.results]); // Adiciona novos pontos à lista existente
            setNextPage(response.data.next_page); // Atualiza o ID da próxima página
            setLoading(false);
            fetchPhotosForPlaces(response.data.results); // Busca fotos para os locais
        } catch (error) {
            console.error('Erro ao buscar pontos turísticos:', error);
            setLoading(false);
        }
    };

    // Função para buscar fotos de um ponto turístico
    const fetchPhotosForPlaces = async (places) => {
        const photosData = {};
        for (const place of places) {
            try {
                const photoResponse = await axios.get(`https://api.foursquare.com/v3/places/${place.fsq_id}/photos`, {
                    headers: {
                        'Authorization': API_KEY,
                    },
                });

                // Armazenando as fotos retornadas para cada ponto turístico
                photosData[place.fsq_id] = photoResponse.data;
            } catch (error) {
                console.error('Erro ao buscar fotos:', error);
            }
        }
        setPhotos(photosData); // Atualiza o estado com as fotos dos locais
    };

    // Função para favoritar/desfavoritar um ponto turístico
    const toggleFavorite = (fsq_id) => {
        if (favorites.includes(fsq_id)) {
            setFavorites(favorites.filter(id => id !== fsq_id));
        } else {
            setFavorites([...favorites, fsq_id]);
        }
    };

    // Função para renderizar o ícone de favorito
    const renderFavoriteIcon = (fsq_id) => {
        return favorites.includes(fsq_id) ? '❤️' : '🤍';
    };

    // Chamada inicial para carregar os pontos turísticos
    useEffect(() => {
        const latitude = -23.55052;
        const longitude = -46.633308;
        fetchTouristSpots(latitude, longitude); // Chama a função para buscar os pontos turísticos
    }, []);

    // Função para carregar mais pontos turísticos
    const loadMore = () => {
        if (nextPage) {
            fetchTouristSpots(-23.55052, -46.633308, nextPage); // Carrega a próxima página de pontos turísticos
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#ff6347" />
            ) : (
                <FlatList
                    data={touristSpots}
                    keyExtractor={(item) => item.fsq_id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>{item.location.address || 'Endereço não disponível'}</Text>
                            <Text>Distância: {item.distance} metros</Text>

                            {/* Exibe a foto do local, se disponível */}
                            {photos[item.fsq_id] && photos[item.fsq_id].length > 0 && (
                                <Image
                                    style={styles.image}
                                    source={{ uri: photos[item.fsq_id][0].prefix + '300x300' + photos[item.fsq_id][0].suffix }}
                                />
                            )}

                            <TouchableOpacity onPress={() => toggleFavorite(item.fsq_id)} style={styles.favoriteButton}>
                                <Text style={styles.favoriteIcon}>
                                    {renderFavoriteIcon(item.fsq_id)} Favoritar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListFooterComponent={
                        // Botão de "Carregar mais" quando houver mais pontos turísticos
                        nextPage && (
                            <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
                                <Text style={styles.loadMoreText}>Carregar mais pontos turísticos</Text>
                            </TouchableOpacity>
                        )
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    card: {
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    favoriteButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    favoriteIcon: {
        fontSize: 24,
        color: '#ff6347', // Cor moderna (tom de vermelho)
    },
    loadMoreButton: {
        padding: 10,
        backgroundColor: '#ff6347',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default TouristSpots;
