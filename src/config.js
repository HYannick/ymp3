const production = process.env.NODE_ENV === 'production'
const logoPath = production ? './' : '/static/'
module.exports = {
  socket: production ? 'https://ymp3.herokuapp.com' : 'http://localhost:4001',
  api: production ? 'https://ymp3.herokuapp.com/api' : 'http://localhost:4001/api',
  logo: `${logoPath}/logo.png`,
  firefox: `${logoPath}/firefox.svg`,
  chrome: `${logoPath}/chrome.svg`
}