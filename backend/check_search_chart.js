import axios from 'axios';

async function checkDetails() {
  try {
    const searchRes = await axios.get('https://query2.finance.yahoo.com/v1/finance/search?q=AAPL');
    const quote = searchRes.data.quotes?.[0];
    console.log('--- Search Quote Keys ---', Object.keys(quote || {}));
    console.log('Search Quote Example:', quote);

    console.log('\n--- Chart Result Keys ---');
    const chartRes = await axios.get('https://query2.finance.yahoo.com/v8/finance/chart/AAPL?range=1mo&interval=1d');
    const chartData = chartRes.data.chart?.result?.[0];
    console.log('Chart meta keys:', Object.keys(chartData?.meta || {}));
    console.log('Chart meta details:', chartData?.meta);
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

checkDetails();
