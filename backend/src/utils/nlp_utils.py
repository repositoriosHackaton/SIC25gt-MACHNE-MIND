import re
import json
from fuzzywuzzy import process
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
import pickle
import os

class NLPUtils:
    @staticmethod
    def preprocess_text(text):
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        return text

    @staticmethod
    def extract_crypto_name(text, crypto_list):
        text = text.lower()
        for crypto in crypto_list:
            if crypto.lower() in text:
                return crypto
        
        matches = process.extract(text, crypto_list, limit=1)
        if matches and matches[0][1] > 70:
            return matches[0][0]
        return None

    @staticmethod
    def load_training_data(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data

    @staticmethod
    def prepare_training_data(training_data):
        texts = []
        labels = []
        for intent in training_data['intents']:
            for pattern in intent['patterns']:
                texts.append(pattern)
                labels.append(intent['tag'])
        return texts, labels