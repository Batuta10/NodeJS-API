var express = require('express');
    bodyParser = require('body-parser');
    mongodb = require('mongodb');
    objectID = require('mongodb').ObjectID;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port =  8080;

app.listen(port);

console.log('\n Servidor HTTP na porta ' + port);

app.get('/',function(req, res){
    res.send({msg: 'Olá Mundo'});
});

var db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017,{}),
    {}
);

//POST
app.post('/api', function(req, res){
    var dados = req.body;
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function (err, collection) {
            collection.insert(dados, function(err, records){
                if (err) {
                    res.json(err);
                }else{
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });
});
//GET
app.get('/api', function(req, res){
    var dados = req.body;
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function (err, collection) {
            collection.find().toArray(function (err, results) {
               if (err) {
                   res.json(err);
               }else{
                   res.json(results);
               }
               mongoclient.close();
            });
        });
    });
});
//GET ID
app.get('/api/:id', function(req, res){
    var dados = req.body;
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function (err, collection) {
            collection.find(objectID(req.params.id)).toArray(function (err, results) {
               if (err) {
                   res.json(err);
               }else{
                   res.json(results);
               }
               mongoclient.close();
            });
        });
    });
});
//PUT(Update)
app.put('/api/:id', function(req, res){
    var dados = req.body;
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function (err, collection) {
            collection.update(
                {_id: objectID(req.params.id)},
                { $set:{titulo: req.body.titulo}},
                {},
                function (err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(records);
                    }                    
                    mongoclient.close();
                }
            );
        });
    });
});
//PUT(Delete)
app.delete('/api/:id', function(req, res){
    var dados = req.body;
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function (err, collection) {
            collection.remove(
                {_id: objectID(req.params.id)},
                function (err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json({status: 'Deletado com sucesso!'});
                    }                    
                    mongoclient.close();
                }
            );
        });
    });
});