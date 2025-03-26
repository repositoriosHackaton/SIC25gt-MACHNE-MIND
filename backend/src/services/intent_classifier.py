import pickle
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from utils.nlp_utils import NLPUtils

class IntentClassifier:
    def __init__(self):
        self.model = None
        self.nlp_utils = NLPUtils()
        
    def train(self, training_data_path, model_save_path):
        training_data = self.nlp_utils.load_training_data(training_data_path)
        texts, labels = self.nlp_utils.prepare_training_data(training_data)
        
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(
                preprocessor=self.nlp_utils.preprocess_text,
                ngram_range=(1, 2),
                max_features=1000
            )),
            ('clf', SVC(
                kernel='linear',
                probability=True,
                class_weight='balanced'
            ))
        ])
        
        self.model.fit(texts, labels)
        
        with open(model_save_path, 'wb') as f:
            pickle.dump(self.model, f)
    
    def load(self, model_path):
        with open(model_path, 'rb') as f:
            self.model = pickle.load(f)
    
    def predict(self, text):
        if not self.model:
            raise Exception("Model not loaded or trained")
        return self.model.predict([text])[0]
    
    def predict_proba(self, text):
        if not self.model:
            raise Exception("Model not loaded or trained")
        return self.model.predict_proba([text])[0]