const { Router } = require("express");
const category = require("../model/category");
const order = require("../model/order");
const products = require("../model/products");
const report = require("../model/report");
const verifyToken = require('../middlewares/verifyToken');
const verifyRules = require('../middlewares/verifyRoles');
const {ROLES_LIST} = require('../keys/config');
const compareLast = require("../middlewares/compareLast");
const findAmount = require("../middlewares/findAmount");
const verifyRoles = require("../middlewares/verifyRoles");
const limitUser = require("../middlewares/limitUser");

const router = Router();

router.post("/orderadd",  verifyToken, compareLast, (req, res) => {
  const { id, amount, sale_price } = req.body;

  order.find({product_id:id})
  .then(async data=>{
    if(!data){
      return res.status(404).json({errr:"Xatolik"})
    }else{

    if(data.length > 0){
        let upgrade =  await order.findOne({product_id:id});
        upgrade.amount = parseFloat(upgrade.amount) + parseFloat(amount);
        upgrade.save()
        return res.json(upgrade)
    }else{
        order.create({
            product_id:id,
            sale_price,
            amount,
            posetdBy:req.user._id
        }).then(app=>{
            return res.json(app)
        })
    }
  }

  })
}); // buyurtma qabul qiladi

router.get("/getAllProducts", compareLast, (req, res) => {
  order
    .find()
    .populate("product_id", "")
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(404).json({ error: "Xatolik" });
      }
    });
}); // buyurtmani oynaga chiqaradi

router.put("/editamount", limitUser, async(req, res) => {
  let amountOfProduct = await findAmount(req.body.idd);

  order
    .findOne(
      {
        _id:req.body.id
      }
    )
    .populate("product_id", "")
    .then((data) => {
      if( req.body.amount < 0 || req.body.amount == 0  ){
        console.log(req.body.amount);
        return res.status(403).json({error:"Miqdorni to`g`ri kiritng"})
      }else{
        console.log(req.body.amount);

        if (req.body.amount > amountOfProduct.amount) {
          console.log(data,'bir');
          data.amount = req.body.amount,
          data.msg="true";
          data.save();
          return res.json(data);
        } else {
          console.log(data,'ikki');
          data.amount = req.body.amount,
          data.msg="false";
          data.save();
          return res.json(data);
        }
      }
     
    });
}); // miqdorini o'zgartiradi
router.put("/editprice", (req, res) => {
  if(req.body.price< 0){
    return res.status(404).json({ error: "Xatolik" });
  }else{
    order
    .findByIdAndUpdate(
      req.body.id,
      {
        $set: { sale_price: req.body.price },
      },
      { new: true }
    )
    .populate("product_id", "")
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(404).json({ error: "Xatolik" });
      }
    });
  }
 
}); // miqdorini o'zgartiradi

router.delete("/removeorder/:id", (req, res) => {
  order.findByIdAndDelete(req.params.id).then((data) => {
    if (data) {
      return res.json(data);
    } else {
      return res.status(404).json({ error: "xatolik" });
    }
  });
}); // basket dagi elementni o`chirib yuboramiz


// ---- role ni shu yerdan tekshirish zarur -- //
router.get("/cost", verifyToken, verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor, ROLES_LIST.user),(req, res) => {

    order.find({posetdBy: req.user._id})
    .populate('product_id', 'name cat_id')
    .then(data=>{
      console.log(data,'data');
        data.forEach((val,idx,mass)=>{
            products.findOne({ _id: val.product_id })
            .then(async app=>{
                    if(app.amount<val.amount ){
                       console.log(val._id);
                    }else{
                      console.log(app,'app');
                        app.amount = parseFloat(app.amount)-parseFloat(val.amount);
                        app.save();
                        report
                    .create({
                      postedBy:req.user._id,
                      product_id: val.product_id,
                      amount: val.amount,
                      sale_price: val.sale_price,
                      name:val.product_id.name.toLowerCase(),
                      category:val.product_id.cat_id.toLowerCase()
                    })
                    .then(app2=>{
                        console.log(app2);
                    })
                    await order.findByIdAndDelete({_id:val._id});
                                   
                }
                
            })            
        })
        return res.json({msg:"Muvaffaqiyatli amalga oshirildi"})
    })
    .catch(e=>{
        return res.json({error:e})
    })

}); //basketdagi elementi o`zgartiramiz

router.get("/cost_cost",(req,res)=>{
    order.find()
        .then(data=>{
            return res.json(data)
        })
})

module.exports = router;
