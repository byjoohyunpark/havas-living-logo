const quoteRoutes = (app, fs) => {

    // variables
    const dataPath = './srv/data/quotes.json';

    // refactored helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/quotes', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // readFile(data => {
    //         console.log(data, 'readFile')
    //         const keys = Object.keys(data)
    //         let newQuoteId = parseInt(keys[keys.length - 1]) + 1
    //     },
    //     true);

    // CREATE
    app.post('/quotes', (req, res) => {
        readFile(data => {
                console.log(data, 'readFile')
                const keys = Object.keys(data)
                let newQuoteId = parseInt(keys[keys.length - 1]) + 1
                let quote = req.body
                quote.isVisible = true
                // add the new Quote
                data.push(quote)
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(data);
                });
            },
            true);
    });

    // UPDATE
    app.put('/quotes/:id', (req, res) => {
        readFile(data => {

                // add the new quote
                const quoteId = req.params["id"];
                const body = req.body

                if (body.showQuote) {
                    data[quoteId].isVisible = JSON.parse(body.showQuote)
                }

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(data);
                });
            },
            true);
    });


    // DELETE
    app.delete('/quotes/:id', (req, res) => {
        readFile(data => {

                // add the new quote
                const quoteId = req.params["id"];
                console.log(data['1'], 'data', quoteId)
                // delete data[quoteId];
                data.splice(quoteId, 1);
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(data);
                });
            },
            true);
    });


};

module.exports = quoteRoutes;