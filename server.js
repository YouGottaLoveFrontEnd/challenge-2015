var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    app = express();

app.use(express.static(path.join('./public')));
app.set('views', './public');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Server started: ' + app.get('port'));
});