from services.intent_classifier import IntentClassifier

if __name__ == '__main__':
    classifier = IntentClassifier()
    classifier.train(
        training_data_path='data/training_data.json',
        model_save_path='models/intent_classifier.pkl'
    )
    print("Modelo entrenado y guardado exitosamente")