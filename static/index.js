document.addEventListener('DOMContentLoaded', function () {
    symbols_quotes();
    symbols_graph();
    
    setInterval(symbols_quotes, 10000);
});


function colorizeChangeText(change) {
    const words = change.split(" ");
    const coloredText = words.map((word, index) => {
      if (index === 1) {
        const color = parseFloat(word) < 0 ? "#dd4548" : "#26b59c";
        return `<span style="color: ${color};">${word}</span>`;
      } else {
        return `<span>${word}</span>`;
      }
    }).join(" ");
    
    return coloredText;
}

function symbols_quotes(){
    const apiKey = 'd6fe2689-fe84-4c24-8694-72795cabfee9';
    //const apiUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
    const apiUrl = '/get_crypto_data';

    const parameters = {
        'symbol': 'BTC,ETH,USDT,USDC'
    };
    //url.search = new URLSearchParams(parameters).toString();

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Handle the API response data here
            const coinmarketdata = document.getElementById('cryptocurrencies');
            coinmarketdata.innerHTML = '';
            console.log(data);
            for (const symbol in data.data) {
                if (data.data.hasOwnProperty(symbol)) {
                    const cryptocurrency = data.data[symbol][0];
                    const coin_div = document.createElement('div');
                    const coin_prices_div = document.createElement('div');
                    coin_div.classList.add('cryptocurrencies');
                    const coin_header = document.createElement('div');
                    coin_header.classList.add('cryptocurrencies_header');
                    const h1 = document.createElement('h1');
                    const logo = document.createElement('img');
                    logo.src = `static/images/${symbol}.svg`
                    h1.textContent = `${symbol}`;
                    coin_header.appendChild(logo);
                    coin_header.appendChild(h1);
                    coin_div.appendChild(coin_header);
                    coinmarketdata.appendChild(coin_div);
                    const element_data_div = document.createElement('div');
                    const element_change_div = document.createElement('div');
                    const element_data_h1 = document.createElement('h1');
                    const element_change_1h = document.createElement('h1');
                    const element_change_24h = document.createElement('h1');
                    const element_change_7d = document.createElement('h1');
                    element_data_h1.textContent = `$${cryptocurrency.quote.USD.price.toFixed(2)}`;
                    element_data_div.appendChild(element_data_h1);
                    const change_1h = `1h% ${cryptocurrency.quote.USD.percent_change_1h > 0 ? '+' : ''}${cryptocurrency.quote.USD.percent_change_1h.toFixed(2)}`;
                    element_change_1h.innerHTML = colorizeChangeText(change_1h);
                    element_change_div.appendChild(element_change_1h);
                    const change_24h = `1d% ${cryptocurrency.quote.USD.percent_change_24h > 0 ? '+' : ''}${cryptocurrency.quote.USD.percent_change_24h.toFixed(2)}`;
                    element_change_24h.innerHTML = colorizeChangeText(change_24h);
                    element_change_div.appendChild(element_change_24h);
                    const change_7d = `7d% ${cryptocurrency.quote.USD.percent_change_7d > 0 ? '+' : ''}${cryptocurrency.quote.USD.percent_change_7d.toFixed(2)}`;
                    element_change_7d.innerHTML = colorizeChangeText(change_7d);
                    element_change_div.appendChild(element_change_7d);
                    element_data_div.classList.add('price_div')
                    coin_prices_div.appendChild(element_data_div);
                    coin_prices_div.appendChild(element_change_div);
                    coin_prices_div.classList.add('coin_prices'); 
                    coin_div.appendChild(coin_prices_div);


                }
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function symbol_history(symbol) {
    const apiKey = 'your_api_key_here';
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart/range`;
    const parameters = {
        'vs_currency': 'usd',
        'from': '1662879218',
        'to': '1696971521'
    };
    const url = new URL(apiUrl);
    url.search = new URLSearchParams(parameters).toString();

    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        var timestamps = [];
        var prices = [];

        data.prices.forEach(pair => {
            timestamps.push(pair[0]);
            prices.push(pair[1]);
        });

        return [timestamps, prices];
    });
}

function symbols_graph() {
    symbol = 'bitcoin'
    symbol_history(symbol)
        .then(data => {
            const [timestamps, prices] = data;
            plot_history_prices(timestamps, prices);
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
}



function plot_history_prices(labels,values, values_2){
    var ctx = document.getElementById("myChart").getContext("2d");
    console.log(labels)
    console.log(values)
    var data = {
        labels: labels,
        datasets: [
          {
            label: "Data",
            data: values,
            borderColor: "#6DC1C8",
            pointRadius: 0,
            backgroundColor: "rgba(0, 0, 255, 0.2)",
          },
          {
            label: "Data_2",
            data: values_2,
            // Line color 
            borderColor: "red", // Line color 
            pointRadius: 0, // Set the pointRadius to 0 to hide data points
            backgroundColor: "rgba(0, 0, 255, 0.2)", // Fill area color
          },
        ],
      };
    
      var options = {
        responsive: true,
        scales: {
          x: {
            type: "linear", // Use linear scale for the X-axis
            position: "bottom",
            ticks: {
                display: false, // Hide x-axis ticks
            },
          },
          y: {
            type: "linear", // Use linear scale for the Y-axis
            ticks: {
                font: {
                    size: 20, 
                },
                color: "whitesmoke", // Change the color of the y-axis numbers
            },
          },
        },
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
        },
      };
    
      var myChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: options,
      });
}