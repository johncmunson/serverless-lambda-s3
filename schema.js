const defaultConfig = {
  padding_position: 'end',
  padding_symbol: ' '
}

module.exports = [
  {
    name: 'First',
    width: 20,
    ...defaultConfig
  },
  {
    name: 'Last',
    width: 20,
    ...defaultConfig
  },
  {
    name: 'Email',
    width: 50,
    ...defaultConfig
  },
  {
    name: 'Phone',
    width: 18,
    ...defaultConfig
  }
]
