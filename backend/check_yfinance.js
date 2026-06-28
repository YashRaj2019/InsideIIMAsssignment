import yahooFinance from 'yahoo-finance2';

const yf = new yahooFinance();
console.dir(yf);
console.log('typeof yf.search:', typeof yf.search);
console.log('typeof yf.quoteSummary:', typeof yf.quoteSummary);
console.log('typeof yf.historical:', typeof yf.historical);
console.log('typeof yf.quote:', typeof yf.quote);
console.log('typeof yf.autoc:', typeof yf.autoc);
console.log('Instance properties:', Object.getOwnPropertyNames(yf));
console.log('Prototype properties:', Object.getOwnPropertyNames(Object.getPrototypeOf(yf)));
