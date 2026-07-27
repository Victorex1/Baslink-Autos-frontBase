const userAccount = document.querySelector(".account-icon");
const userBody = document.querySelector(".account-body");
const closeNews = document.querySelector(".closeNews");
const confirmSub = document.querySelector(".confirmsub");
const newsBody = document.querySelector(".newsbody");
const subScribeBtn = document.querySelector("#subScribeBtn");

// FIX: Target .sitebody exactly (removed trailing space typo)
const siteBody = document.querySelector(".sitebody");
const newsSub = document.querySelector("#news");
const menuBody = document.querySelector(".menu-body");
const menuIcon = document.querySelector(".menu-icon");
const closeMenu = document.querySelector(".close-menu");
const loading = document.querySelector("#loading");
const boxContainer = document.querySelector("#box-container");
const emptyBox = document.querySelector("#empty-box");

if(boxContainer !== null || emptyBox !== null) loading.classList.add("hidden");

if(subScribeBtn){
  subScribeBtn.addEventListener("click" ,async (e) => {
    e.preventDefault()
    const emailInput = newsSub.value.trim();
    if(emailInput === "") return alert('Enter a valid email address');

    // send to the server
    try{
      const response = await fetch("/android-stereo/emailSubmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailInput })
      });

      const result = await response.json();
      if(!result.success) return alert(result.message || 'Email submission failed')
     if (result.success) {
    window.location.href = "/android-stereo/emailbody";
}
      } catch (error) {
      console.error("Error submitting email:", error);
    }
  })
}

if(menuIcon){
menuIcon.addEventListener("click", () => {
  // If profile is open, close it down

  // Cleanly toggle the navigation view tray open and closed
  menuBody.classList.remove("hidden");
  userBody.classList.add("hidden");
});
}

if(closeMenu){
closeMenu.addEventListener("click", () => {
  menuBody.classList.add("hidden");
  userBody.classList.add("hidden");
});
}

if(userAccount){
userAccount.addEventListener("click", () => {
  menuBody.classList.add("hidden");
  userBody.classList.toggle("hidden");
});
}

if(closeNews){
closeNews.addEventListener("click", () => {
  newsBody.classList.add("hidden");
});
}


// Pop up newsletter after 10 seconds
window.addEventListener("load", () => {
  setTimeout(() => {
    if (newsBody) newsBody.classList.remove("hidden");
  }, 5000);

});

if(confirmSub){
confirmSub.addEventListener("click", () => {
  if (siteBody) siteBody.scrollTop = siteBody.scrollHeight;
  if (newsSub) newsSub.focus();
  newsBody.classList.add("hidden");
});
}
