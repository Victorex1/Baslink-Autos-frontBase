const container = document.querySelector('#cartItem');
const totalCartLength = document.querySelector('#Item-length');
const itemAmount = document.querySelector('#item-amount');
const estimatedAmount = document.querySelector('#estimated-total');



document.querySelector('#whatsappBtn').addEventListener('click', () => {
var messageHeader = "Good Day Mr Basilink \nI would like to purchase this item(s):\n";

// 'index' tracks the current item number (0, 1, 2...)
var itemsList = Array.from(container.children).map((result, index) => `${index + 1}. ${result.children[0].children[1].children[0].innerHTML}  (${result.children[1].children[1].children[0].value})`).join('\n');

var whatsappURL = `http://wa.me/9027674464?text=${encodeURIComponent(messageHeader + itemsList)}`;

    window.open(whatsappURL, '_blank').focus()
})


  // Listen for clicks on the ENTIRE list container
container.addEventListener('click',async  function(event) {

    // Check if the actual thing clicked was a button with the class "delete-btn"
    if (event.target.classList.contains('delete-btn')) {
    const id = event.target.id
    console.log(id)
    try{

        const send = await fetch('/android-stereo/deleteCart',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({id:id})
        })

        const result = await send.json()

        if(result.success) {

        
        const parentEl =   event.target.parentElement.parentElement
        parentEl.classList.remove('opacity-100','scale-100')
        parentEl.classList.add('opacity-0','scale-95')

        setTimeout(() => {
            parentEl.remove()
        }, 500);

        console.log(result.count)
        if(result.count == 0) {
            const html = `
                <div id="empty-box" class="rounded-md border-dashed border-gray-500 p-2 flex justify-between gap-2  my-1 phone2:flex-col  phone2:items-center">
      <img src="/box.png" class="w-[60px] md:w-[80px]" alt="">                
      <h2 class="font-bold text-[15px]  text-gray-500 my-2">No item to be displayed</h2>
    </div>
            `

            container.insertAdjacentHTML('beforeend',html)

            totalCartLength.innerHTML = 0;
            estimatedAmount.innerHTML = '0.00';
            itemAmount.innerHTML = '0.00'
        }

    }

    }catch(err){
     console.log(err)
    }}
  });


