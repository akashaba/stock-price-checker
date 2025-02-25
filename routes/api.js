'use strict';
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.DB)
.then(() => {
  console.log("Connected to database!");
})
.catch((err) => {
  console.error(err);
})

const stockSchema = new mongoose.Schema({
  stock: String,
  likes: Number,
  ips: [String]
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const hash = bcrypt.hashSync(req.ip, 10);
      if (Array.isArray(req.query.stock)) {
        const response1 = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[0]}/quote`);
        const response2 = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[1]}/quote`);
        let data1 = await Stock.findOne({stock: response1.data.symbol}).exec();
        let data2 = await Stock.findOne({stock: response2.data.symbol}).exec();
        if (data1 == null) {
          const newStock1 = new Stock({
            stock: response1.data.symbol,
            likes: 0,
            ips: []
          });
          newStock1.save();
          data1 = newStock1;
        }

        if (data2 == null) {
          const newStock2 = new Stock({
            stock: response2.data.symbol,
            likes: 0,
            ips: []
          });
          newStock2.save();
          data2 = newStock2;
        }
        res.json({
          stockData: [{
            stock: response1.data.symbol,
            price: response1.data.close,
            rel_likes: data1.likes - data2.likes
          }, {
            stock: response2.data.symbol,
            price: response2.data.close,
            rel_likes: data2.likes - data1.likes
          }]
        });
        let isNew = !data1.ips.some(hsh => bcrypt.compareSync(req.ip, hsh));
        if (req.query.like && isNew) {
          const updateStock1 = await Stock.findOneAndUpdate({stock: response1.data.symbol}, 
            {
              $inc: {
                likes: 1
              },
              $push: {
                ips: hash
              }
            }, {new: true});
          const updateStock2 = await Stock.findOneAndUpdate({stock: response2.data.symbol}, 
            {
              $inc: {
                likes: 1
              },
              $push: {
                ips: hash
              }
            }, {new: true});
        }
      } else {
        const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`);
        const data = await Stock.findOne({stock: response.data.symbol}).exec();
        if (data == null) {
          const newStock = new Stock({
            stock: response.data.symbol,
            likes: 0,
            ips: []
          });
          newStock.save()
          .then(savedStock => {
            res.json({
              stockData: {
                stock: response.data.symbol,
                price: response.data.close,
                likes: savedStock.likes
              }
            });
          })
        } else {
          let isNew = !data.ips.some(hsh => bcrypt.compareSync(req.ip, hsh));
          if (req.query.like && isNew) {
            const updateStock = await Stock.findOneAndUpdate({stock: response.data.symbol}, 
              {
                $inc: {
                  likes: 1
                },
                $push: {
                  ips: hash
                }
              }, {new: true});
            res.json({
              stockData: {
                stock: response.data.symbol,
                price: response.data.close,
                likes: updateStock.likes
              }
            });
          } else {
            res.json({
              stockData: {
                stock: response.data.symbol,
                price: response.data.close,
                likes: data.likes
              }
            });
          }
        }
      }
    });
    
};