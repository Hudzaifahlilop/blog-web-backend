exports.createProducts = (req, res, next) => {
    console.log('request', req.body);
    const name = req.body.name;
    const price = req.body.price;
    res.json(
        {
            message: 'Create product success',
            data: {
                id: 1,
                name: name,
                price: price
            }
        }
    );
    next();
}

exports.getAllProducts = (req, res, next) => {
    res.json({
        message: 'get all product success',
        data: [
            {
                id: 1,
                name: 'biskuit roma',
                price: 8000
            }
        ]
    });
    next();
}