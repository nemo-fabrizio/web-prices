from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

api_key = 'd6fe2689-fe84-4c24-8694-72795cabfee9'
api_url = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest'

@app.route('/get_crypto_data', methods=['GET'])
def get_crypto_data():
    symbols = request.args.get('symbols', 'BTC,ETH,USDT,USDC')
    
    parameters = {
        'symbol': symbols,
    }
    
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': api_key,
    }

    response = requests.get(api_url, params=parameters, headers=headers)
    
    if response.status_code != 200:
        return jsonify({'error': 'HTTP error! Status: {}'.format(response.status_code)}), 400

    data = response.json()
    return jsonify(data)

@app.route('/', methods=['GET'])
def index():
    return render_template('index_v2.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)

