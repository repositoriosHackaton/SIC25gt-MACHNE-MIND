import random
from typing import Dict, List
from utils.api_client import CryptoAPIClient
from utils.nlp_utils import NLPUtils

class ResponseGenerator:
    def __init__(self):
        self.api_client = CryptoAPIClient()
        self.crypto_list = [name.upper() for name in self.api_client.get_all_crypto_names()]
        self.nlp_utils = NLPUtils() 
    
    def get_price_response(self, crypto_name: str) -> str:
        try:
            current_price = self.api_client.get_current_price(crypto_name)
            responses = [
                f"El precio actual de {crypto_name} es ${current_price:.2f}",
                f"{crypto_name} cotiza actualmente a ${current_price:.2f}",
                f"El valor de {crypto_name} es ${current_price:.2f} en este momento"
            ]
            return random.choice(responses)
        except Exception as e:
            return f"No pude obtener el precio de {crypto_name}. Error: {str(e)}"
    
    def get_recommendation_response(self, crypto_name: str) -> str:
        try:
            analysis = self.api_client.get_buy_recommendation(crypto_name)
            
            if analysis['recommendation'] == 'buy':
                responses = [
                    f"Recomendaría comprar {crypto_name}. {analysis['reason']}",
                    f"Es buen momento para comprar {crypto_name}. {analysis['reason']}",
                    f"Los indicadores sugieren comprar {crypto_name}. {analysis['reason']}"
                ]
            elif analysis['recommendation'] == 'sell':
                responses = [
                    f"Recomendaría vender {crypto_name}. {analysis['reason']}",
                    f"Considera vender {crypto_name}. {analysis['reason']}",
                    f"Los indicadores sugieren vender {crypto_name}. {analysis['reason']}"
                ]
            else:
                responses = [
                    f"Recomendaría mantener {crypto_name}. {analysis['reason']}",
                    f"Es mejor esperar con {crypto_name}. {analysis['reason']}",
                    f"Los indicadores no son claros para {crypto_name}. {analysis['reason']}"
                ]
            
            return random.choice(responses)
        except Exception as e:
            return f"No pude analizar {crypto_name}. Error: {str(e)}"
    
    def get_top_recommendations(self) -> str:
        try:
            top_cryptos = self.api_client.get_top_cryptos()
            
            if not top_cryptos:
                return "Actualmente no tengo recomendaciones claras de criptomonedas"
            
            response = "Basado en el análisis actual, mis recomendaciones son:\n"
            for i, crypto in enumerate(top_cryptos[:5], 1):  # Top 5
                performance = "↑" if crypto['performance'] > 0 else "↓"
                response += (
                    f"{i}. {crypto['name']} (Precio: ${crypto['price']:.2f}, "
                    f"Rendimiento: {performance}{abs(crypto['performance']):.1f}%, "
                    f"Estabilidad: {crypto['stability']:.2f})\n"
                )
            
            return response
        except Exception as e:
            return f"No pude generar recomendaciones. Error: {str(e)}"
    
    def get_volatile_stable_report(self) -> str:
        try:
            data = self.api_client.get_volatile_and_stable()
            
            response = (
                "Análisis de criptomonedas:\n"
                f"Moneda más volátil: {data['most_volatile']['name']} "
                f"(Desviación: {data['most_volatile']['std_dev']:.2f})\n"
                f"Moneda más estable: {data['most_stable']['name']} "
                f"(Desviación: {data['most_stable']['std_dev']:.2f})\n"
                f"Datos del año: {data['year']}"
            )
            
            return response
        except Exception as e:
            return f"No pude generar el reporte. Error: {str(e)}"