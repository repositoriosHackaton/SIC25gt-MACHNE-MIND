from flask import Blueprint, jsonify, request
from services.crypto_service import get_summary, get_crypto_data, get_crypto_by_date, get_most_interesting_data, get_crypto_data_and_stats_for_year, get_most_volatile_and_stable, returnAllNames

bp = Blueprint('crypto', __name__, url_prefix='/api/crypto/')

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