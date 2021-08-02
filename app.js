const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const express = require('express');
const app = express();

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('morsy is start..'); 
    startupDebugger('Morgan enabled....');
}

dbDebugger('Connected to database..');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}.....`));