'use strict';

const pc = require('picocolors');
const app = require('../app');
//


async function main() {
  try {
    await app.listen(app.get('port'), () => {
      console.log(pc.blue(`Server on port:`), app.get('port'));
    });
  } catch (error) {
    console.log(error);
  }
}

main();