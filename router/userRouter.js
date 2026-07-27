const express = require("express");
const router = express.Router();
const controller = require('../controller/auth')
const passport = require('passport')

// routers
router.get("/contact-page", (req, res) =>{
  const userCheck = req.user

  res.render("contact", { title: "contact-page",user:userCheck })
});
router.get("/sign-out", (req, res) =>{

  req.logOut()
  res.redirect('/android-stereo/')
});

router.get("/", controller.HomeGoods);

router.get("/product-Page",controller.productPage);

router.get("/google",passport.authenticate('google', {
  scope:['profile']
}));

router.get("/redirect", passport.authenticate('google'), (req,res) => {
   res.redirect('/android-stereo/product-Page')
});

router.post("/next-Page",controller.getNextPageProduct);

router.post("/emailSubmit", controller.emailSubmit);

router.post("/deleteCart", controller.deleteCart);

router.get("/emailconfirm/:email", controller.emailDB);

router.get("/emailbody", (req,res) => {
  const userCheck = req.user
   res.render('emailSent',{title:'emailSent-page',user:userCheck})
});

router.get("/productDetail-page/:id", controller.ProductDetails);

router.post("/filter", controller.productPageFilter);

router.get('/Cart-page', controller.displayCart)

router.use((req,res)=> {
  res.status(404).render('404',{title:'404-page'})
})

module.exports = router;
