const { Router } = require("express");
const category = require("../model/category");
const order = require("../model/order");
const products = require("../model/products");
const report = require("../model/report");
const verifyToken = require("../middlewares/verifyToken");
const verifyRoles = require("../middlewares/verifyRoles");
const reportQuery = require("../middlewares/reportQuery");
const queryReport = require("../model/queryReport");
const { ROLES_LIST } = require("../keys/config");

const router = Router();

router.get("/getHistory", (req, res) => {
  // report.aggregate([{$group:}])
  report
    .find()
    .populate("product_id", "")
    .populate("postedBy", "")
    .then((data) => {
      return res.json(data);
    });
}); //report ni oynaga chiqaradi

router.get("/getReport/:id", (req, res) => {
  report
    .findById(req.params.id)
    .populate("product_id", "")
    .populate("postedBy", "")
    .then((data) => {
      return res.json(data);
    });
}); //report ni oynaga chiqaradi

router.put("/editReport/:id",verifyToken, verifyRoles(ROLES_LIST.admin,ROLES_LIST.editor),(req,res)=>{
  products.findOne({_id:req.body.product_id})
    .then(data=>{
      if(req.body.org_amount > req.body.amount){
        data.amount =  data.amount + (req.body.org_amount - req.body.amount);
        data.save();
      }else if(req.body.org_amount < req.body.amount){
        data.amount =  data.amount - ( req.body.amount - req.body.org_amount);
        data.save();
      }
    })
  report.findOne({_id:req.params.id})
.then(data=>{
    if(data){
      data.amount = req.body.amount,
      data.sale_price = req.body.sale_price
      data.name = req.body.name;
      data.save()
      return res.json(data)
    }else{
        return res.status(406).json({error:"Xatolik"})
    }
})
})

router.post("/getQuery", (req, res) => {
  const { name, person, category, date, month } = req.body;
  if (name) {
    report
      .find({ name: { $regex: name } })
      .populate("postedBy", "")
      .populate("product_id", "")
      .then((data) => {
        return res.json(data);
      });
  }else  if (person) {
    report
      .find({ postedBy:person}) 
      .populate("postedBy", "")
      .populate("product_id", "")
      .then((data) => {
        return res.json(data);
      });
  }else  if (category) {
    report
      .find({ category: { $regex: category.toLowerCase() } })
      .populate("postedBy", "")
      .populate("product_id", "")
      .then((data) => {
        return res.json(data);
      });
  }else if (date) {
  let query = new Date(date);
  let today = new Date(query).setUTCHours(23, 59, 59, 999);
    report
      .find({ createdAt: { $gt: query, $lt: today } })
      .populate("product_id", "")
      .populate("postedBy", "")
      .then((data) => {
        if (data) {
          return res.json(data);
        } else {
          return res.json({
            error: `${req.params.query} bo'yicha qidiruv topilmadi`,
          });
        }
      });
  
  }else if (month) {
    console.log(month,'month');
    console.log(new Date().getDate(),'mo');
    let query = new Date(month);
    let today = new Date(query).setUTCMonth(query);
      // report
      //   .find({ createdAt: { $gt: query, $lt: today } })
      //   .populate("product_id", "")
      //   .populate("postedBy", "")
      //   .then((data) => {
      //     if (data) {
      //       return res.json(data);
      //     } else {
      //       return res.json({
      //         error: `${req.params.query} bo'yicha qidiruv topilmadi`,
      //       });
      //     }
      //   });
    
    }
});// bittalab saralash



// -------------------------------------------///
router.post("/getQueryReport", (req, res) => {
    const { name, person, category, date } = req.body;
    // name bo`yicha
    if (name,person) {
      report
        .find({ name: { $regex: name }, postedBy:person })
        .populate("postedBy", "")
        .populate("product_id", "")
        .then((data) => {
          return res.json(data);
        });
    }else  if (name,category) {
      report
        .find({ name: { $regex: name },category: { $regex: category }}) 
        .populate("postedBy", "")
        .populate("product_id", "")
        .then((data) => {
          return res.json(data);
        });
    }else if (name,date) {
    let query = new Date(date);
    let today = new Date(query).setUTCHours(23, 59, 59, 999);
      report
        .find({ createdAt: { $gt: query, $lt: today },name: { $regex: name } })
        .populate("product_id", "")
        .populate("postedBy", "")
        .then((data) => {
          if (data) {
            return res.json(data);
          } else {
            return res.json({
              error: `${req.params.query} bo'yicha qidiruv topilmadi`,
            });
          }
        });
    }else  if (name,person,category) {
        report
          .find({ name: { $regex: name }, postedBy:person, category: { $regex: category } })
          .populate("postedBy", "")
          .populate("product_id", "")
          .then((data) => {
            return res.json(data);
          });
      }else if (name,date,person,category) {
      let query = new Date(date);
      let today = new Date(query).setUTCHours(23, 59, 59, 999);
        report
          .find({ createdAt: { $gt: query, $lt: today },name: { $regex: name },postedBy:person, category: { $regex: category }  })
          .populate("product_id", "")
          .populate("postedBy", "")
          .then((data) => {
            if (data) {
              return res.json(data);
            } else {
              return res.json({
                error: `${req.params.query} bo'yicha qidiruv topilmadi`,
              });
            }
          });
      }else if (name,date,person) {
        let query = new Date(date);
        let today = new Date(query).setUTCHours(23, 59, 59, 999);
          report
            .find({ createdAt: { $gt: query, $lt: today },name: { $regex: name },postedBy:person })
            .populate("product_id", "")
            .populate("postedBy", "")
            .then((data) => {
              if (data) {
                return res.json(data);
              } else {
                return res.json({
                  error: `${req.params.query} bo'yicha qidiruv topilmadi`,
                });
              }
            });
        }else  if (name,date,category) {
            let query = new Date(date);
            let today = new Date(query).setUTCHours(23, 59, 59, 999);
              report
                .find({ createdAt: { $gt: query, $lt: today },name: { $regex: name },category: { $regex: category } })
                .populate("product_id", "")
                .populate("postedBy", "")
                .then((data) => {
                  if (data) {
                    return res.json(data);
                  } else {
                    return res.json({
                      error: `${req.params.query} bo'yicha qidiruv topilmadi`,
                    });
                  }
                });
            }else if (person,category) {
                report
                  .find({ postedBy:person,category: { $regex: category }}) 
                  .populate("postedBy", "")
                  .populate("product_id", "")
                  .then((data) => {
                    return res.json(data);
                  });
              }else if (person,date) {
                let query = new Date(date);
                let today = new Date(query).setUTCHours(23, 59, 59, 999);
                  report
                    .find({ createdAt: { $gt: query, $lt: today },postedBy:person })
                    .populate("product_id", "")
                    .populate("postedBy", "")
                    .then((data) => {
                      if (data) {
                        return res.json(data);
                      } else {
                        return res.json({
                          error: `${req.params.query} bo'yicha qidiruv topilmadi`,
                        });
                      }
                    });
                } else if (person,date,category) {
              let query = new Date(date);
              let today = new Date(query).setUTCHours(23, 59, 59, 999);
                report
                  .find({ createdAt: { $gt: query, $lt: today },category: { $regex: category },postedBy:person })
                  .populate("product_id", "")
                  .populate("postedBy", "")
                  .then((data) => {
                    if (data) {
                      return res.json(data);
                    } else {
                      return res.json({
                        error: `${req.params.query} bo'yicha qidiruv topilmadi`,
                      });
                    }
                  });
              } else  if (date,category) {
                let query = new Date(date);
                let today = new Date(query).setUTCHours(23, 59, 59, 999);
                  report
                    .find({ createdAt: { $gt: query, $lt: today },category: { $regex: category }})
                    .populate("product_id", "")
                    .populate("postedBy", "")
                    .then((data) => {
                      if (data) {
                        return res.json(data);
                      } else {
                        return res.json({
                          error: `${req.params.query} bo'yicha qidiruv topilmadi`,
                        });
                      }
                    });
                } else{
                    return res.json([])
                }
     





  });

  //// ------------------------------------ ////
router.delete('/removeReport/:id', verifyToken,verifyRoles(ROLES_LIST.admin,ROLES_LIST.editor), (req,res)=>{
  report.findByIdAndDelete(req.params.id)
  .then(data=>{
    if(data){
      return res.json(data)
    }else{
      return res.status(406).json({error:"Xatolik"})
    }
  })
})

module.exports = router;
