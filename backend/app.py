from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import DevelopmentConfig
from database import db
import os
print("SPOONACULAR KEY:", os.getenv('SPOONACULAR_API_KEY'))

# Initialize Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object(DevelopmentConfig)

# Enable CORS
# ✅ New - restricted to your URLs only
CORS(app, origins=[
    "http://localhost:3000",           # local dev
    "https://recipe-explorer-development.netlify.app"     # replace with your real Netlify URL later
])

# Initialize JWT
jwt = JWTManager(app)

# Register blueprints (import AFTER app is created to avoid circular imports)
from routes.auth import auth_bp
from routes.recipes import recipes_bp
from routes.favorites import favorites_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(recipes_bp, url_prefix='/api/recipes')
app.register_blueprint(favorites_bp, url_prefix='/api/favorites')

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    return {'error': 'Bad request'}, 400

@app.errorhandler(401)
def unauthorized(error):
    return {'error': 'Unauthorized'}, 401

@app.errorhandler(404)
def not_found(error):
    return {'error': 'Resource not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return {'status': 'Backend is running'}, 200

@app.route('/')
def home():
    return {'message': 'Recipe Explorer Backend Running'}

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        use_reloader=False  # <--- THIS FIXES THE WINERROR
    )