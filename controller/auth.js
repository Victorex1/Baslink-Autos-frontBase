const nodemailer = require("nodemailer");
const superbaseUrl = process.env.superbaseURL;
const superbaseKEY = process.env.superbaseKEY;

// fetching data from the database and sending it to the home page
exports.HomeGoods = async (req, res) => {
  try {
    const userCheck = req.user;

    let pageLimit = [];
    // Fetch all product records from your database model instance
    const result = await fetch(`${superbaseUrl}products`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
      },
    });

    const catalogItems = await result.json();
    // sending only 4 items to the home page if the total items are more than 4 otherwise sending all the items
    if (catalogItems.length > 4) {
      for (let i = 0; i < 4; i++) {
        pageLimit.push(catalogItems[i]);
      }
    } else {
      pageLimit = catalogItems;
    }

    // Render the page and pass BOTH data and count
    res.render("home", {
      datas: pageLimit,
      count: catalogItems.length, // This fixes the undefined error!
      title: "Home-page",
      user: userCheck,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// filtering products based on the selected feature type and sending the filtered data to the frontend
exports.productPageFilter = async (req, res) => {
  try {
    console.log(req.body);
    const type = req.body;
    // Correctly check if the internal 'fill' string variable is missing
    if (!type || !type.fill) {
      return res
        .status(400)
        .json({ success: false, message: "No value passed" });
    }

    // Fetch all product records from your database model instance
    const result = await fetch(`${superbaseUrl}products?type=eq.${type.fill}`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
      },
    });

    const similarProducts = await result.json();
    // Return clean JSON so your frontend fetch operation handles it cleanly
    return res.status(200).json(similarProducts);
  } catch (err) {
    console.log("An error occured", err);
  }
};

// fetching all the products and sending them to the product page
exports.productPage = async (req, res) => {
  try {
    const userCheck = req.user;

    // Fetch all product records from your database model instance
    const result = await fetch(`${superbaseUrl}products`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
      },
    });
    const catalogItems = await result.json();

    // counting the total number of pages based on the number of items and items per page
    const totalPage = Math.ceil(catalogItems.length / 10);

    // Render the page and pass BOTH data and count
    res.render("products", {
      datas: catalogItems,
      count: totalPage, // This fixes the undefined error!
      title: "product-page",
      user: userCheck,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// fetching product details and options for the product datails page
exports.ProductDetails = async (req, res) => {
  try {
    const userCheck = req.user;
    const id = req.params.id.trim();

    const resul = await fetch(`${superbaseUrl}products?id=eq.${id}`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
      },
    });

    const [item] = await resul.json();

    const result = await fetch(`${superbaseUrl}products`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
      },
    });

    const options = await result.json();
    const list = [];

    if (options.length > 5) {
      for (let a = 0; a < 5; a++) {
        let random = options[Math.floor(Math.random() * options.length)];
        const existingItem = list.some((num) => num.id === random.id);
        if (!existingItem) {
          list.push(random);
        }
      }

      res.render("productDetails", {
        user: userCheck,
        data: item,
        options: list,
        title: "productDetail-page",
      });

      return;
    }

    res.render("productDetails", {
      user: userCheck,
      data: item,
      options: options,
      title: "productDetail-page",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Superbase storage insertion timeout failure.",
    });
  }
};

exports.getNextPageProduct = async (req, res) => {
  try {
    const pageLimit = 10;
    const currentPage = req.body;
    const startPage = pageLimit * currentPage;

    // Fetch your catalog items from the database
    const catalogItems = await Blog.find({});
    const result = catalogItems.slice(startPage, pageLimit);
    const totalPage = Math.ceil(catalogItems.length / pageLimit);

    // Render the page and pass BOTH data and count
    res.status(200).json({
      datas: result,
      count: totalPage, // This fixes the undefined error!
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// sending email for confirmation of subscriotion to the newsletter
exports.emailSubmit = async (req, res) => {
  const email = req.body.email;

  try {
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email not provided" });

    const result = await fetch(`${superbaseUrl}email?email=eq.${email}`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
      },
    });
    const emaildb = await result.json();
    if (emaildb.length > 0)
      return res
        .status(400)
        .json({ success: false, message: "Email Already registered" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
        <!-- Main Email Container -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; padding: 48px 32px; text-align: center;">
        
        <!-- Logo / Header Section -->
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <!-- SVG Icon inline styled -->
            <svg style="width: 32px; height: 32px; color: #2563eb; margin-right: 8px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"></path>
            </svg>
            <span style="font-size: 18px; font-weight: 500; color: #334155; letter-spacing: -0.05em;">My Newsletter Service</span>
        </div>

        <!-- Heading -->
        <h1 style="font-size: 30px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 24px;">Almost There!</h1>

        <!-- Body Text -->
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 32px; max-width: 460px; margin-left: auto; margin-right: auto;">
            Thank you for signing up for our newsletter. Just one more step to start receiving our latest updates, offers, and exclusive content directly in your inbox. Please click the button below to confirm your subscription and complete the process.
        </p>

        <!-- CTA Button -->
        <div style="margin-bottom: 32px;">
            <a href="http://localhost:5000/android-stereo/emailconfirm/${encodeURIComponent(email)}" style="display: inline-block; background-color: #2563eb; color: #ffffff; cursor: pointer; font-weight: 600; font-size: 16px; padding: 14px 32px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                Confirm Subscription
            </a>
        </div>

        <!-- Divider -->
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">

        <!-- Info Notice -->
        <p style="font-size: 12px; color: #64748b; margin-bottom: 8px; line-height: 1.4;">
            If you didn't request this email, you can ignore it and you won't be subscribed.
        </p>
        <p style="font-size: 12px; color: #475569; font-weight: 500; margin-bottom: 24px;">
            This confirmation link <strong>will expire in 24 hours</strong>.
        </p>

        <!-- Footer Links -->
        <div style="font-size: 12px; color: #94a3b8;">
            <a href="#" style="text-decoration: none; color: #64748b;">Unsubscribe</a>
            <span style="margin: 0 4px;">|</span>
            <a href="#" style="text-decoration: none; color: #64748b;">Privacy Policy</a>
            <span style="margin: 0 4px;">|</span>
            <span>&copy; 2026 My Newsletter Service</span>
        </div>

     </div>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirm Subscription to Newsletter",
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (err, Info) => {
      if (Info)
        res
          .status(200)
          .json({ success: true, message: "Email sent successfully" });

      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Email could not be sent" });
    });
  } catch (err) {
    console.log("A server Error has occured: ", err);
  }
};

// registering email to DB
exports.emailDB = async (req, res) => {
  // setting id
  const capitaLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerLetter = "abcdefghijklmnopqrstuvwxyz";
  const number = "1234567890";

  let id = "";
  let total = "";
  total += capitaLetter + number + lowerLetter;

  for (let i = 0; i < 20; i++) {
    id += total[Math.floor(Math.random() * total.length)];
  }
  try {
    const userEmail = req.params.email;

    // sheck for existing email befor procedining code
    const respon = await fetch(`${superbaseUrl}email?email=eq.${userEmail}`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
        "Content-Type": "application/json",
      },
    });
    const check = await respon.json();
    if (check.length > 0) {
      console.log({ success: false, message: "Email already existing" });
      return res.json({ success: false, message: "Email already existing" });
    }
    console.log(userEmail, id);

    // saving email to db
    const result = await fetch(`${superbaseUrl}email`, {
      method: "POST",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        email: userEmail,
      }),
    });
    res.render("emailConfirm", { title: "Email Confirmation" });
  } catch (err) {
    console.log("An Error occured: ", err);
  }
};

// sending data to cart database
exports.TocartDB = async (req, res) => {
  const cartItem = req.body;
  try {
    if (!cartItem.itemId)
      return res
        .status(404)
        .json({ message: "Item failed to reach backend succesfuly" });
    // checking and preventing duplicate items in the cart collection
    const resp = await fetch(
      `${superbaseUrl}carts?itemId=eq.${cartItem.itemId}`,
      {
        method: "GET",
        headers: {
          apikey: superbaseKEY,
          Authorization: `Bearer ${superbaseKEY}`,
        },
      },
    );
    const check = await resp.json();

    if (check.length > 0) return res.json({ message: "Item Already in cart" });
    // saving the cart item to the database and sending a success response

    console.log(cartItem, "line 360");
    const respon = await fetch(`${superbaseUrl}carts`, {
      method: "POST",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    });
    //  const check = await respon.json()

    res.status(200).json({
      success: true,
      message: "item successfuly added to cart ",
    });
  } catch (err) {
    console.log("Error occured: ", err);
  }
};

// displaying the cart page with the items in the cart and their details
exports.displayCart = async (req, res) => {
  // geting the cart and product details form db

  try {

    let cartList = [];
    const userCheck = req.user;
    if(userCheck){
const resp1 = await fetch(
      `${superbaseUrl}carts?google_id=eq.${userCheck[0].id}`,
      {
        method: "GET",
        headers: {
          apikey: superbaseKEY,
          Authorization: `Bearer ${superbaseKEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    const cartDetails = await resp1.json();

    const resp2 = await fetch(`${superbaseUrl}products`, {
      method: "GET",
      headers: {
        apikey: superbaseKEY,
        Authorization: `Bearer ${superbaseKEY}`,
        "Content-Type": "application/json",
      },
    });
    const productDetail = await resp2.json();


    // looping through the cart and product details to check and get details of item and push it to cartlist

for (let i = 0; i < cartDetails.length; i++) {
  const currentCart = cartDetails[i];
  
  // Try to find matching product details in productDetail array
  const matchedProduct = productDetail.find((prod) => prod.id == currentCart.itemId);

  if (matchedProduct) {
    // Product exists in DB
    cartList.push({
      id: currentCart.id,             // Cart record ID
      itemId: currentCart.itemId,     // Product ID
      image: matchedProduct.GoodsImage,
      name: matchedProduct.GoodsName,
      price: matchedProduct.price,
      qnt: currentCart.Qnt,
      model: matchedProduct.year,
      isAvailable: true               // In Stock!
    });
  } else {
    // Product was DELETED from DB
    cartList.push({
      id: currentCart.id,             // Cart record ID so user can still delete it from cart!
      itemId: currentCart.itemId,
      image: "", 
      name: "Item No Longer Available",
      price: 0,
      qnt: currentCart.Qnt,
      model: "N/A",
      isAvailable: false              // Out of stock/Deleted!
    });
  }
}
    // rendering the cart page with the cartlist and title
    res.render("cart", {
      title: "cart-page",
      data: cartList,
      user: userCheck,
    });
    }else{
      res.render("cart", {
      title: "cart-page",
      data: cartList,
      user: userCheck,
    });
    }
    
  } catch (err) {
    console.log("Backend Err",err);
  }
};

exports.deleteCart = async (req, res) => {
  const id = req.body;
  console.log(id);
  
  try{
  if (!id)  return res.json({ success: false, message: "No item is passed to delete" });
    const resp = await fetch(`${superbaseUrl}carts?id=eq.${id.id}`,{
      method:'DELETE',
      headers:{
        'apikey':superbaseKEY,
        'Authorization':`Bearer ${superbaseKEY}`,
        'prefer':'return=representation'
      }
    })
    const deleteCart = await resp.json()

     const resp1 = await fetch(`${superbaseUrl}carts`,{
      method:'GET',
      headers:{
        'apikey':superbaseKEY,
        'Authorization':`Bearer ${superbaseKEY}`,
        'prefer':'return=representation'
      }
    })
    const CartLength = await resp1.json()

    console.log(CartLength.length);

  if (!deleteCart) {
    return res.json({
      success: false,
      message: "Item does not Exist",
    });
  }else if (deleteCart) {
    return res.json({
      success: true,
      message: "item successfuly deleted from DB",
      count: CartLength.length,
    });
  }
  }catch(err){
    console.log('Data base Error:', err)
  }

  
};
