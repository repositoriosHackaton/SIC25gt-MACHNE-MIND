import pandas as pd
from flask import jsonify
from datetime import datetime, timedelta
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from utils.data_loader import load_data
from typing import Dict, List, Any, Tuple
import json
from services.crypto_service import get_crypto_data, get_top_cryptos_by_year, get_most_volatile_and_stable, returnAllNames

class CryptoAPIClient:
    def __init__(self):
        self.data = load_data()
    
    def _mock_request(self, params: Dict) -> Dict:
        """Simula un objeto request para usar con tus funciones existentes"""
        class MockRequest:
            def __init__(self, json_data):
                self.json = json_data
        return MockRequest(params)
    
    def get_current_price(self, crypto_name: str) -> float:
        """Obtiene el precio actual de una criptomoneda"""
        crypto_data = self.data[self.data['coin_name'] == crypto_name.upper()]
        if crypto_data.empty:
            raise ValueError(f"No se encontraron datos para {crypto_name}")
        
        latest = crypto_data.sort_values('date', ascending=False).iloc[0]
        return latest['price']
    
    def get_price_trend(self, crypto_name: str, days: int = 7) -> Dict[str, Any]:
        """Obtiene la tendencia de precios usando ARIMA basado en los últimos datos disponibles"""
        # Filtrar datos para la criptomoneda específica
        crypto_data = self.data[self.data['coin_name'] == crypto_name.upper()]
        
        if crypto_data.empty:
            raise ValueError(f"No se encontraron datos para {crypto_name}")
        
        # Obtener la última fecha disponible
        crypto_data = crypto_data.sort_values('date', ascending=False)
        last_date = pd.to_datetime(crypto_data.iloc[0]['date'])
        end_date = last_date.strftime('%Y-%m-%d')
        
        # Calcular la fecha de inicio (days días antes de la última fecha disponible)
        start_date = (last_date - timedelta(days=days)).strftime('%Y-%m-%d')
        
        request_data = {
            'coin_name': crypto_name,
            'start_date': start_date,
            'end_date': end_date
        }
        
        response, status_code = get_crypto_data(self._mock_request(request_data))
        response_data = json.loads(response.get_data(as_text=True))
        
        if status_code != 200:
            raise ValueError(f"Error obteniendo datos: {response_data.get('message', '')}")
        
        # Análisis de tendencia basado en predicción ARIMA
        predicted_prices = response_data['summary']['predicted_prices']
        current_price = response_data['summary']['final_price']
        
        avg_prediction = sum(predicted_prices) / len(predicted_prices)
        trend = 'up' if avg_prediction > current_price else 'down'
    
        return {
            'trend': trend,
            'current_price': current_price,
            'predicted_prices': predicted_prices,
            'price_change': response_data['summary']['price_change_percentage'],
            'confidence': self._calculate_confidence(predicted_prices, current_price),
            'last_available_date': end_date  # Añadimos esta información
        }
    
    def _calculate_confidence(self, predictions: List[float], current_price: float) -> float:
        """Cálculo de confianza más sofisticado"""
        # Coeficiente de variación (menos confianza si hay mucha dispersión)
        std_dev = np.std(predictions)
        mean_pred = np.mean(predictions)
        cov = std_dev / mean_pred if mean_pred != 0 else 1
        
        # Diferencia porcentual promedio
        avg_diff = abs(mean_pred - current_price) / current_price
        
        # Confianza combinada (0-1)
        confidence = 0.7 * (1 - avg_diff) + 0.3 * (1 - cov)
        return max(0, min(1, confidence))  # Aseguramos entre 0 y 1
    
    def get_buy_recommendation(self, crypto_name: str) -> Dict[str, Any]:
        """Genera recomendación de compra/venta con umbrales más sensibles"""
        analysis = self.get_price_trend(crypto_name)
        
        # Umbrales ajustables
        BUY_THRESHOLD = 1.0  # % mínimo de diferencia para recomendar compra
        SELL_THRESHOLD = -2.0  # % mínimo de diferencia para recomendar venta
        CONFIDENCE_THRESHOLD = 0.6  # Confianza mínima para recomendar
        
        # Calcular diferencia porcentual entre predicción y precio actual
        avg_prediction = sum(analysis['predicted_prices']) / len(analysis['predicted_prices'])
        price_diff = ((avg_prediction - analysis['current_price']) / analysis['current_price']) * 100
        
        # Lógica de recomendación mejorada
        if (analysis['confidence'] >= CONFIDENCE_THRESHOLD and 
            price_diff > BUY_THRESHOLD):
            recommendation = 'buy'
        elif (analysis['confidence'] >= CONFIDENCE_THRESHOLD and 
            price_diff < SELL_THRESHOLD):
            recommendation = 'sell'
        else:
            recommendation = 'hold'
        
        return {
            'recommendation': recommendation,
            'confidence': analysis['confidence'],
            'price_difference': f"{price_diff:.2f}%",
            'reason': self._get_recommendation_reason(recommendation, analysis, price_diff),
            'analysis_data': analysis
        }
    
    def _get_recommendation_reason(self, recommendation: str, analysis: Dict, price_diff: float) -> str:
        """Genera razones más detalladas y precisas"""
        reasons = {
            'buy': (
                f"Fuerte tendencia alcista (predicción +{price_diff:.2f}%). "
                f"El precio actual es ${analysis['current_price']:.2f} y se espera que alcance "
                f"${analysis['predicted_prices'][0]:.2f} en el corto plazo (confianza {analysis['confidence']*100:.1f}%)."
            ),
            'sell': (
                f"Fuerte tendencia bajista (predicción {price_diff:.2f}%). "
                f"El precio actual es ${analysis['current_price']:.2f} y se espera que caiga a "
                f"${analysis['predicted_prices'][0]:.2f} (confianza {analysis['confidence']*100:.1f}%). "
                f"Cambio reciente: {analysis['price_change']:.2f}%."
            ),
            'hold': (
                f"Tendencia neutral (variación {price_diff:.2f}%). "
                f"El precio actual es ${analysis['current_price']:.2f} con predicción a "
                f"${analysis['predicted_prices'][0]:.2f} (confianza {analysis['confidence']*100:.1f}%). "
                "Espera a una señal más clara."
            )
        }
        return reasons.get(recommendation, "")
    
    def get_top_cryptos(self, year: int = None) -> List[Dict[str, Any]]:
        """Obtiene las criptomonedas más interesantes usando KMeans"""
        if year is None:
            year = 2024
        
        # Usamos tu función existente get_top_cryptos_by_year
        crypto_data = load_data()
        top_cryptos = get_top_cryptos_by_year(crypto_data, year)
        
        # Formateamos la respuesta
        formatted_result = []
        for crypto in top_cryptos:
            crypto_name = crypto['coin_name']
            current_price = self.get_current_price(crypto_name)
            
            formatted_result.append({
                'name': crypto_name,
                'price': current_price,
                'performance': crypto['price_change'],
                'stability': 1/crypto.get('std_dev', 1),  # Inverso de la desviación estándar
                'cluster': crypto.get('cluster', -1)
            })
        
        return formatted_result
    
    def get_volatile_and_stable(self, year: int = None) -> Dict[str, Any]:
        """Obtiene las criptomonedas más volátiles y estables"""
        if year is None:
            year = 2024
        
        # Usamos tu función existente get_most_volatile_and_stable
        response, _ = get_most_volatile_and_stable(self._mock_request({'year': year}))
        data = json.loads(response.get_data(as_text=True))
        
        return {
            'most_volatile': {
                'name': data['most_volatile_coin']['coin_name'],
                'std_dev': data['most_volatile_coin']['std_dev'],
                'price_history': data['volatile_coin_data']
            },
            'most_stable': {
                'name': data['most_stable_coin']['coin_name'],
                'std_dev': data['most_stable_coin']['std_dev'],
                'price_history': data['stable_coin_data']
            },
            'year': year
        }
    
    def get_all_crypto_names(self) -> List[str]:
    
        data = load_data()
        names = data['coin_name'].unique().tolist()
        names.sort()
        return names