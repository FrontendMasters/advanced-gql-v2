const dfnsFormat = require('date-fns/format')

const formatDate = (stamp, format) => dfnsFormat(stamp, format) 
module.exports = {formatDate}
