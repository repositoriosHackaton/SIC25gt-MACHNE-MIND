from flask import Flask
from routes import crypto_routes
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(crypto_routes.bp)

if __name__ == "__main__":
    app.run(debug=True)
