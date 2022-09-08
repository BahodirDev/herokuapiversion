const queryReport = require("../model/queryReport");
const report = require("../model/report");

module.exports = async(arg) => {
  if (arg.body.person) {
    let data = await queryReport.find();
    if(data.length){
        queryReport.find().then((data) => {
            data.forEach((val) => {
              if(val.postedBy.toString() !== arg.body.person.toString()){
                  val.deleteOne()
              }else{
                console.log(val,'val');
              }
            });
          });
    }else{
     report.find({ postedBy: arg.body.person }).then((data) => {
      data.forEach((val) => {
        queryReport
          .create({
            _id: val._id,
            product_id: val.product_id,
            amount: val.amount,
            sale_price: val.sale_price,
            postedBy: val.postedBy,
            created_at: val.created_at,
            updated_at: val.updated_at,
            name:val.name,
            category:val.category
          })
      });
    });
    return await queryReport.find()
    }
    
  }else  if (arg.body.name) {
    let data = await queryReport.find();
    if(data.length){
        queryReport.find().then((data) => {
            data.forEach((val) => {
              if(val.name.toString() !== arg.body.name.toString()){
                  val.deleteOne()
              }else{
                console.log(val,'val');
              }
            });
          });
          ///
    }else{
     report.find({ name: {$regex:arg.body.name} }).then((data) => {
      data.forEach((val) => {
        console.log(val);
        queryReport
          .create({
            _id: val._id,
            product_id: val.product_id,
            amount: val.amount,
            sale_price: val.sale_price,
            postedBy: val.postedBy,
            created_at: val.created_at,
            updated_at: val.updated_at,
            name:val.name,
            category:val.category
          })
      });
    });
}

}
return await queryReport.find()
};
