const exp = require('express');
const app = exp();
const port = 3000;

const totalPrice = { totalPrice: 0.0 };
let retObject;
const groceryList = [];

const calcTotalPrice = function () {
    totalPrice.totalPrice = 0.0;
    if(groceryList.length !== 0){groceryList.forEach((item) => {
      if (!isNaN(parseFloat(item.price))) {
        totalPrice.totalPrice += parseFloat(item.price);
      } else {
        totalPrice.totalPrice += 0.0;
      }
    })};
  };

app.use(exp.static('public'))
app.use(exp.json())

app.post("/submit", (req, res) => {
    console.log(req)
    groceryList.push(req.item);
    calcTotalPrice();
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { 'Content-Type': 'text/json' })
    res.end(JSON.stringify(retObject));
})

app.listen(port, ()=> {
    console.log(`Listening on ${port}`);
});