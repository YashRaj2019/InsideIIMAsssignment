import axios from 'axios';

async function testQuoteUrl() {
  try {
    const res = await axios.get('https://query2.finance.yahoo.com/v7/finance/quote?symbols=AAPL', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const quote = res.data.quoteResponse?.result?.[0];
    console.log('Quote URL success!');
    console.log('Symbol:', quote?.symbol);
    console.log('Name:', quote?.longName);
    console.log('Price:', quote?.regularMarketPrice);
    console.log('MarketCap:', quote?.marketCap);
    console.log('TrailingPE:', quote?.trailingPE);
  } catch (err) {
    console.error('Quote URL failed:', err.message);
    if (err.response) {
      console.log('Response Status:', err.response.status);
    }
  }
}

testQuoteUrl();
