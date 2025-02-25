const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    test('GET /api/stock-prices?stock=[stock]', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices')
            .set('content-type', 'application/json')
            .query({stock: 'goog'})
            .end(function (err, res) {
                if (err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.stockData.stock);
                assert.isNumber(res.body.stockData.price);
                assert.isNumber(res.body.stockData.likes);
                done();
            });
    });
    test('GET /api/stock-prices?stock=[stock]&like=true', function (done) {
        chai
            .request(server)
            .get('/api/stock-prices')
            .set('content-type', 'application/json')
            .query({stock: 'goog', like: true})
            .end(function (err, res) {
                if (err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.stockData.stock);
                assert.isNumber(res.body.stockData.price);
                assert.isNumber(res.body.stockData.likes);
                done();
            });
    });
    test('GET /api/stock-prices?stock=[stock]&like=true', function (done) {
        chai
            .request(server)
            .get('/api/stock-prices')
            .set('content-type', 'application/json')
            .query({stock: 'goog', like: true})
            .end(function (err, res) {
                if (err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.stockData.stock);
                assert.isNumber(res.body.stockData.price);
                assert.isNumber(res.body.stockData.likes);
                done();
            });
    });
    test('GET /api/stock-prices?stock=[stock]&stock=[stock]', function (done) {
        chai
            .request(server)
            .get('/api/stock-prices')
            .set('content-type', 'application/json')
            .query({stock: ['goog','tsla']})
            .end(function (err, res) {
                if (err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.stockData[0].stock);
                assert.isNumber(res.body.stockData[0].price);
                assert.isNumber(res.body.stockData[0].rel_likes);
                done();
            });
    });
    test('GET /api/stock-prices?stock=[stock]&stock=[stock]&like=true', function (done) {
        chai
            .request(server)
            .get('/api/stock-prices')
            .set('content-type', 'application/json')
            .query({stock: ['goog', 'tsla'], like: true})
            .end(function (err, res) {
                if (err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isString(res.body.stockData[0].stock);
                assert.isNumber(res.body.stockData[0].price);
                assert.isNumber(res.body.stockData[0].rel_likes);
                done();
            });
    });
});