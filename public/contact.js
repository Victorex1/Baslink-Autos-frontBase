const nameinput = document.querySelector('#name')
const subjectinput = document.querySelector('#subject')
const messageinput = document.querySelector('#message')
const button = document.querySelector('#formSubmit')

button.addEventListener('click', async (e) => {
    e.preventDefault() 

    let name = nameinput.value.trim()
    let subject = subjectinput.value.trim()
    let message = messageinput.value.trim()

    if(!name || !subject || !message){
        alert('Fill in all forms')
        return 
    }

    const form = { name, subject, message }
      // 3. Build the text message with clean spacing
    const messageText = `Good Day Mr Basilink \nI am (Mr./Mrs) ${name} and am wrighting to you about *${subject}*\n ${message}`;

    // 4. Encode the text so spaces and linebreaks (\n) work perfectly in the browser URL
    const whatsappURL = `https://wa.me/2349027674464?text=${encodeURIComponent(messageText)}`;

    // 5. Open WhatsApp
    window.open(whatsappURL, '_blank').focus();
})


