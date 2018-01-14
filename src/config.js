const production = process.env.NODE_ENV === 'production'
const logoPath = production ? './' : '/static/'
module.exports = {
  socket: production ? 'https://ymp3.herokuapp.com' : 'http://localhost:4000',
  api: production ? 'https://ymp3.herokuapp.com/api' : 'http://localhost:4000/api',
  logo: `${logoPath}/logo.png`
}