from flask import Flask, render_template, jsonify, make_response
import os

app = Flask(__name__)

# Security: Disable debug mode in production
DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

@app.route('/')
def home():
    """Main homepage route"""
    try:
        response = make_response(render_template('index.html'))
        # Add cache control headers for better performance
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    except Exception as e:
        if DEBUG:
            raise e
        return make_response(jsonify({'error': 'Internal server error'}), 500)

@app.route('/api/products')
def get_products():
    """API endpoint to get product data"""
    try:
        products = [
            {
                "id": 1,
                "name": "Adidas Sport Runner",
                "brand": "Adidas",
                "price": 129.99,
                "category": "running",
                "image": "adidas-blue.jpg",
                "description": "Classic Adidas sneakers with royal blue accents and premium leather construction"
            },
            {
                "id": 2,
                "name": "Nike Retro Classic",
                "brand": "Nike",
                "price": 149.99,
                "category": "casual",
                "image": "nike-retro-red.jpg",
                "description": "Iconic Nike sneakers featuring a bold red and navy colorway with vintage-inspired design"
            },
            {
                "id": 3,
                "name": "Puma Viz Runner",
                "brand": "Puma",
                "price": 89.99,
                "category": "sports",
                "image": "puma-viz.jpg",
                "description": "Sleek black Puma running shoes with red accents and enhanced grip"
            },
            {
                "id": 4,
                "name": "Puma Randomevent",
                "brand": "Puma",
                "price": 159.99,
                "category": "lifestyle",
                "image": "puma-random.jpg",
                "description": "Limited edition Puma collaboration with yellow accents and air cushioning"
            }
        ]
        
        response = make_response(jsonify(products))
        response.headers['Content-Type'] = 'application/json'
        return response
        
    except Exception as e:
        if DEBUG:
            raise e
        return make_response(jsonify({'error': 'Unable to load products'}), 500)

@app.errorhandler(404)
def page_not_found(error):
    """Handle 404 errors"""
    return make_response(jsonify({'error': 'Page not found'}), 404)

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return make_response(jsonify({'error': 'Internal server error'}), 500)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=DEBUG)