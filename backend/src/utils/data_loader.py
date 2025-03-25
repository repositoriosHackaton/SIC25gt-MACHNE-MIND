import pandas as pd
from config import DATA_FILE


def load_data():

    # Cargar el archivo CSV
    data = pd.read_csv(DATA_FILE)
    
    # Corrección de valores nulos
    data['price'] = data['price'].fillna(0)
    data['total_volume'] = data['total_volume'].fillna(0)
    data['market_cap'] = data['market_cap'].fillna(0)
    data['date'] = data['date'].fillna('1970-01-01')  # Fecha por defecto para valores nulos

    # Cambio de tipos de datos
    data['date'] = pd.to_datetime(data['date'], errors='coerce')  # Convertir 'date' a datetime
    data['price'] = data['price'].astype(float)
    data['total_volume'] = data['total_volume'].astype(float)
    data['market_cap'] = data['market_cap'].astype(float)
    data['coin_name'] = data['coin_name'].str.upper()  # Normalizar nombres a mayúsculas
    

    return data
