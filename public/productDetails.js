// 1. Get the quantity dynamically from the HTML element on the page

document.querySelector("#whatsappItem").addEventListener("click", () => {
  const Quantity = document.querySelector("#Qnt").innerHTML.trim();
  const goodsName = document.querySelector("#goodsname").children[0].innerHTML;

  // 2. Inject the EJS values safely as JavaScript strings using quotes
  const customerName = "Your Name"; // You can change this to another EJS variable if you have one

  // 3. Build the text message with clean spacing
  const messageText = `Good Day Mr Basilink \nI would like to purchase this item(s): \n${goodsName} (${Quantity})`;

  // 4. Encode the text so spaces and linebreaks (\n) work perfectly in the browser URL
  const whatsappURL = `https://wa.me/2349027674464?text=${encodeURIComponent(messageText)}`;

  // 5. Open WhatsApp
  window.open(whatsappURL, "_blank").focus();
});

document.querySelector("#Add-Cart").addEventListener("click", async function (event) {
    const Qnt = document.querySelector("#Qnt").innerHTML;
    console.log(this.dataset.product);

    const user = this.dataset.product;
    console.log(user);
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
      if (user !== "undefined" && user !== "null") {
        // User clicked OK
        // Put your fetch() call or cart logic here
        const userid = JSON.parse(user);
        const cart = {
          itemId: this.dataset.id,
          Qnt: Qnt,
          id: id,
          google_id: userid.id,
        };

        const response = await fetch("/android/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(cart),
        });

        const result = await response.json();
        if (!result.success) return alert(result.message);

        if (result.success) {
          alert("Added to cart sucessfuly!!");
          window.location.href = "/android-stereo/product-page";
        }
      } else {
        const userConfirmed = confirm(
          "Sign in with Google to continue adding items to your cart.",
        );
        console.log(userConfirmed);
        // 2. Script RESUMES only after they click a button:
        if (userConfirmed) {
          const productData = {
            itemId: this.dataset.id,
            Qnt: Qnt,
            id: id,
            google_id:'',
          };
          let pendingCart =
            JSON.parse(localStorage.getItem("pendingCart")) || [];

          // 2. Add the item (or update quantity if already there)
          const existingIndex = pendingCart.findIndex(
            (item) => item.id === productData.id,
          );
          if (existingIndex > -1) {
            pendingCart[existingIndex].qnt += productData.qnt || 1;
          } else {
            pendingCart.push(productData);
          }

          // 3. Save back to browser storage
          localStorage.setItem("pendingCart", JSON.stringify(pendingCart));
          window.location = "/android-stereo/google";
        } else {
          // User clicked CANCEL
          console.log("User cancelled the action.");
        }
      }
    } catch (err) {
      console.log("An error occores:", err);
    }
  });

document.querySelector("#Add-Qnt").addEventListener("click", () => {
  const Qnt = document.querySelector("#Qnt");
  const Quantity = Number(Qnt.innerHTML) + 1;

  Qnt.innerHTML = Quantity;
});

document.querySelector("#Remove-Qnt").addEventListener("click", () => {
  // Find the current quantity element
  const qntElement = document.querySelector("#Qnt");

  // Convert the current text safely into a base-10 number
  let currentQuantity = parseInt(qntElement.innerHTML, 10);

  // Only subtract if the quantity is greater than 1
  if (currentQuantity > 1) {
    currentQuantity--; // Safely subtract 1 from the variable
    qntElement.innerHTML = currentQuantity; // Push the update back onto the screen
  }
});

const addCartBtn = document.getElementById("Add-Cart");
const spinner = document.getElementById("cart-spinner");
const btnContent = document.getElementById("btn-content");

addCartBtn.addEventListener("click", async function () {
  // 1. Enable Loading State
  addCartBtn.disabled = true;
  spinner.classList.remove("hidden");
  btnContent.innerHTML = "Adding...";

  try {
    const productId = this.dataset.id;

    // 2. Perform your API request (Replace with your actual endpoint)
    const response = await fetch("/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    });

    if (!response.ok) throw new Error("Failed to add item");

    // Optional: Success state feedback
    btnContent.innerHTML = '<i class="bi bi-check-lg"></i> Added!';
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  } finally {
    // 3. Reset Button after delay
    setTimeout(() => {
      addCartBtn.disabled = false;
      spinner.classList.add("hidden");
      btnContent.innerHTML = '<i class="bi bi-bag-check"></i> Add to Cart';
    }, 1500);
  }
});
