from flask import Blueprint, jsonify, request
from services.crypto_service import get_summary, get_crypto_data, get_crypto_by_date, get_most_interesting_data, get_crypto_data_and_stats_for_year, get_most_volatile_and_stable, returnAllNames
from services.intent_classifier import IntentClassifier
from services.response_generator import ResponseGenerator
import os


classifier = IntentClassifier()
classifier.load(os.path.join("models", "intent_classifier.pkl"))

response_gen = ResponseGenerator()

bp = Blueprint('crypto', __name__, url_prefix='/api/crypto/')

@bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    question = data.get('question', '').strip()
    
    if not question:
        return jsonify({'error': 'No se proporcionó una pregunta'}), 400
    
    try:
        intent = classifier.predict(question)
        
        if intent == 'price_query':
            crypto_name = response_gen.nlp_utils.extract_crypto_name(question, response_gen.crypto_list)
            if not crypto_name:
                return jsonify({'response': 'No pude identificar la criptomoneda. ¿Podrías ser más específico?'})
            response = response_gen.get_price_response(crypto_name)
        
        elif intent == 'buy_recommendation':
            crypto_name = response_gen.nlp_utils.extract_crypto_name(question, response_gen.crypto_list)
            if not crypto_name:
                return jsonify({'response': 'No pude identificar la criptomoneda. ¿Podrías ser más específico?'})
            response = response_gen.get_recommendation_response(crypto_name)
        
        elif intent == 'top_recommendation':
            response = response_gen.get_top_recommendations()

        elif intent == 'volatility_query':
            response = response_gen.get_volatile_stable_report()
        
        else:
            response = 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?'
        
        return jsonify({'response': response, 'intent': intent})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('', methods=['GET'])
def get_cryptos():
    #saludamos en json
    return jsonify({"message": "Hello, World!"})

@bp.route('/summary', methods=['GET'])
def summary():
    return get_summary()

@bp.route('/data', methods=['POST'])
def rypto_data():
    return get_crypto_data(request)

@bp.route('/date', methods=['POST'])
def crypto_by_date():
    return get_crypto_by_date(request)

@bp.route('/graph_most_interesting', methods=['POST'])
def graph_most_interesting():
    return get_most_interesting_data(request)

@bp.route('/stats', methods=['POST'])
def crypto_stats():
    return get_crypto_data_and_stats_for_year(request)

@bp.route('/most_volatile_stable', methods=['POST'])
def most_volatile_stable():
    return get_most_volatile_and_stable(request)

@bp.route('/allNames', methods=['GET'])
def retNames():
    return returnAllNames()