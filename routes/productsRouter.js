const { Router } = require("express");
const verifyToken = require("../middlewares/verifyToken");
const category = require("../model/category");
const products = require("../model/products");
const verifyRoles = require("../middlewares/verifyRoles");
const { ROLES_LIST } = require("../keys/config");
const report = require("../model/report");
const limitUser = require("../middlewares/limitUser");

const router = Router();

router.get("/allProducts", (req, res) => {
  products.find().then((data) => {
    return res.json(data);
  });
}); //barcha ma'lumotlarni ulashish

router.get("/show_item/:id", (req, res) => {
  products.findById(req.params.id).then((data) => {
    if (data) {
      return res.json(data);
    } else {
      return res.status(404).json({ error: "xatolik" });
    }
  });
}); //mahsulot haqida to`liq ma`lumot

router.get("/editProduct/:id", (req, res) => {
  products.findById(req.params.id).then((data) => {
    if (data) {
      return res.json(data);
    } else {
      return res.status(404).json({ error: "Xatolik" });
    }
  });
}); //element o`zgartirish uchun router

router.post("/addproducts", verifyToken, (req, res) => {
  console.log(req.body);
  if(req.body){
    products
    .create({
      cat_id: req.body.type,
      name: req.body.fish,
      amount: req.body.amount,
      orginal_price: req.body.price,
      sale_price: req.body.sale,
      deadLine: req.body.time ? req.body.time : null,
      postedBy: req.user,
      description: req.body.description,
    })
    .then((data) => {
      if(data){

        return res.json(data);
      }else{
        return res.status(404).json({error:"Xatolik"})
      }
    });
  }else{
    return res.status(406).json({error:"Ma`lumotni to`liq bering"})
  }
  
}); //mahsulotlarni ba`zaga joylaydi  // role bilan

router.delete("/remove_product/:id", verifyToken, verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor), (req, res) => {
  products.findByIdAndDelete(req.params.id).then((data) => {
    if (data) {
      return res.json(data);
    } else {
      return res.status(404).json({ error: "Xatolik" });
    }
  });
});

router.put("/editProduct/:id", verifyToken, verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor), (req, res) => {
  const {
    name,
    description,
    amount,
    type,
    deadLine,
    sale_price,
    orginal_price,
  } = req.body;
  products
    .findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          description,
          amount,
          type,
          deadLine,
          sale_price,
          orginal_price,
        },
      },
      { new: true }
    )
    .then((data) => {
      return res.json(data);
    })
    .catch((e) => console.log(e));
}); //mahsulotlarni o'zgartiradigan funksiay // role bilan

router.get("/search_item/:query", (req, res) => {
  let query = req.params.query;
  products.find({ name: { $regex: query } }).then((data) => {
    if (data) {
      return res.json(data);
    } else {
      return res.status(404).json({ error: "Topilmadi" });
    }
  });
}); // qidiruv bo`yicha topish

router.post("/show_item_report",limitUser, verifyToken, (req, res) => {
  const { amount, sale_price, product_id } = req.body;
  products.findOne({ _id:product_id })
  .then((result) => {
    if(!amount < 0 || !amount == 0){
    result.amount = result.amount - amount;
    result.save();
    if (result) {
      report
        .create({
          amount,
          sale_price,
          product_id,
          postedBy: req.user._id,
        })
        .then((data) => {
          return res.json(data);
        });
    } else {
      return res.json({ error: "Xatolik" });
    }
  }else{
    return res.status(406).json({error:'Miqdorni to`g`ri kiriting'})
  }

  });
});//bir martalik xaridni reportga yozadi

module.exports = router;
