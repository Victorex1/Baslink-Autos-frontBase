const filter = document.querySelector("#filter");
const Page = document.querySelector("#pages");
const productBody = document.querySelector("#product-box");
const count = document.querySelector("#count");
const load = document.querySelector("#loadcatalog");
const speaker = document.querySelector("#speaker");
const android = document.querySelector("#android");
const camera = document.querySelector("#camera");
const others = document.querySelector("#others");
const superbaseURL='https://boqdbdkbjwvpkrmvgxxu.supabase.co/rest/v1/'
const superbaseKEY='sb_publishable_rVlUdk31asZcL2IIL7h_bg_InqTxNpq';
// --- SAFETY CHECKS FOR EVENT LISTENERS ---
if (filter) {
  filter.addEventListener("change", (e) => {
    const currentCatogery = e.target.value;
    console.log("currentCatogery: ", currentCatogery);
    handleCatogery(currentCatogery);
  });
}

android.addEventListener("click", (e) => {
  console.log("Android");
  handleCatogery("Android");
});

speaker.addEventListener("click", (e) => {
  console.log("Speaker");
  handleCatogery("Speaker");
});

camera.addEventListener("click", (e) => {
  console.log("Camera");
  handleCatogery("Camera");
});

others.addEventListener("click", (e) => {
  handleCatogery("Other");
});
async function handleCatogery(current) {
  if (current == "All Products") {
    document.location = "/android-stereo/product-page";
  } else {
    try {
      // FIXED: Using a unique ID string here to avoid colliding with global 'loading' variable
      if (productBody) {
        productBody.innerHTML = `<h2 id="loadcatalog" class='text-xl my-10 text-gray-400'><b>Loading...</b></h2>`;
      }

      console.log(current);
      const response = await fetch("/android-stereo/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fill: current }),
      });

      const requestedItem = await response.json();

      if (!requestedItem || requestedItem.length === 0) {
        alert("item not in stock");
        return window.location.reload();
      }

      setTimeout(() => {
        if (productBody) productBody.innerHTML = "";

        // Hide the persistent loading element safely if it exists
        if (loading) loading.style.display = "none";

        requestedItem.forEach((data) => {
          const htmll = `<div class="rounded-md border border-gray-300 bg-white p-2 flex justify-between gap-2 my-1 phone2:flex-col phone2:items-center">
                        <div class="w-18 rounded-md overflow-hidden">
                          <img src="${data.GoodsImage}" alt="" class="w-full h-full hover:scale-110" />
                        </div>
                        <div class="w-35">
                          <p class="font-bold text-[10px] ">${data.GoodsName}</p>
                          <div class="my-2 text-[9px] flex gap-3 items-center font-bold">
                            <p class="text-blue-600 "><i class="fa-solid fa-naira-sign"></i> ${data.price}</p>
                            <p class="text-gray-400 font-bold"><strike>40,000</strike></p>
                          </div>
                          <div class="flex justify-between items-center">
                            <a href="/android-stereo/productDetail-page/${data.__id}" class="p-1 cursor-pointer rounded-md border hover:bg-blue-600 hover:text-white border-gray-500 font-bold text-blue-600 text-[9px]">View Details</a>
                            <button class="p-1 cursor-pointer rounded-md border border-gray-500 text-black text-[10px] hover:text-blue-600 hover:border-blue-600"><i class="fa-regular fa-heart"></i></button>
                          </div>
                        </div>
                      </div>`;
          if (productBody) productBody.insertAdjacentHTML("beforeend", htmll);
        });
      }, 500); // Pro-Tip: Lowered from 4000ms to 500ms so users don't think your app froze!
    } catch (err) {
      console.log("server Error:", err);
    }
  }
}

Page.addEventListener("click", async (e) => {
  const currentPage = e.innerHTML;
  try {
    const data = await fetch("/android-stereo/next-Page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageNumber: currentPage }),
    });
    const result = await data.json();

    result.datas.forEach((data) => {
      const html1 = `<div 
                class="rounded-md border border-gray-300 bg-white p-2 flex justify-between gap-2  my-1 phone2:flex-col  phone2:items-center">
                <div class="w-18 rounded-md overflow-hidden">
                  <img src=${data.GoodsImage}  alt="" class="w-full h-full hover:scale-110" />
                </div>
                <div class="w-35">
                  <p class="font-bold text-[10px] ">
                    ${data.GoodsName}
                  </p>
                  <div class="my-2 text-[9px] flex gap-3 items-center font-bold">
                    <p class="text-blue-600 ">
                      <i class="fa-solid fa-naira-sign"></i> ${data.price}
                    </p>
                    <p class="text-gray-400 font-bold"><strike>40,000</strike></p>
                  </div>
                  <div class="flex justify-between items-center">
                    <a href="/android-stereo/productDetail-page/${data.__id}"  class="p-1 cursor-pointer rounded-md border hover:bg-blue-600 hover:text-white border-gray-500 font-bold text-blue-600 text-[9px]">
                      View Details
                  </a>
                    <button class="p-1 cursor-pointer rounded-md border border-gray-500 text-black  text-[10px] hover:text-blue-600 hover:border-blue-600" >
                      <i class="fa-regular fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>`;

      productBody.appendChild(html1);
    });

    for (let i = 1; i < result.count + 1; i++) {
      const html2 = `
                <p id="pages" class=" text-[13px] cursor-pointer  p-2 border border-gray-400  hover:bg-gray-200 font-bold rounded-md mx-2"
                >${i}</p>
              `;
      count.innerHTML = html2;
    }
  } catch (err) {}
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Safe extraction of user data from the DOM
    const userDataEl = document.getElementById('user-data');
    if (!userDataEl || !userDataEl.dataset.user) return;

    const currentUser = JSON.parse(userDataEl.dataset.user);
    console.log("Logged-in user:", currentUser);

    // 2. Proper truthy check for the user object
    if (currentUser && currentUser.id) {
      
      // 3. Get pending cart item string safely from LocalStorage
      const storedPending = localStorage.getItem("pendingCart");
      if (!storedPending) return;

      const pendingCarts = JSON.parse(storedPending);
    console.log("Local:", pendingCarts);

      if (Array.isArray(pendingCarts) && pendingCarts.length > 0) {
        
        // 4. Attach the user ID to each cart item before syncing
        const cartPayload = pendingCarts.map(item => ({
          ...item,
          google_id: currentUser.id
        }));

        console.log("Syncing payload to Supabase:", cartPayload);

        // 5. Post to Supabase DB Carts table
        const response = await fetch(`${superbaseURL}carts`, {
          method: "POST",
          headers: {
            'apikey': superbaseKEY,
            'Authorization': `Bearer ${superbaseKEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal" // Optional: Optimizes Supabase response size
          },
          body: JSON.stringify(cartPayload),
        });

        if (response.ok) {
          console.log("Cart items successfully synced!");
          // Clear temporary local storage now that items live safely in DB
          localStorage.removeItem("pendingCart");
        } else {
          const errData = await response.json();
          console.error("Supabase sync failed:", errData);
        }
      }
    }
  } catch (err) {
    console.error("Error running cart sync routine:", err);
  }
});

// Check if there is saved cart data waiting to be synced

