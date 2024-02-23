const moment = require('moment'); 

exports.getCurrentDateTime=()=> {
  const now = moment(); 
  const formattedDateTime = now.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

  return formattedDateTime;
}
