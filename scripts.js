document.querySelector('.admin-button').addEventListener('click', function() {
    const adminList = document.getElementById('admins');
    adminList.classList.toggle('hidden');
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function startCooldown(duration) {
    const cooldownDisplay = document.getElementById('cooldown');
    cooldownDisplay.classList.remove('hidden');
    let remainingTime = duration;

    const interval = setInterval(() => {
        remainingTime--;
        cooldownDisplay.textContent = `You can send another request in ${remainingTime} seconds`;

        if (remainingTime <= 0) {
            clearInterval(interval);
            cooldownDisplay.classList.add('hidden');
            document.querySelector('#supportForm button').disabled = false;
        }
    }, 1000);
}

document.getElementById('supportForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const problem = document.getElementById('problem').value.trim();

    if (!username || !contact || !problem) {
        showNotification('Please fill out all fields.');
        return;
    }

    const webhookURL = 'https://discord.com/api/webhooks/1251568248047276053/YNeZYLCvrvRwFLrFVDNHqDQ0uMr5ECkynuhRoxdt0_RTygqvoTubWgdqcGH2vcM7pgTR';

    const embed = {
        "title": "New support request received",
        "description": `**User Name:** ${username}\n**Contact Info:** ${contact}\n**Problem Details:**\n${problem}`,
        "color": 8421504,
        "fields": [{
                "name": "Accepted by",
                "value": "Pending",
                "inline": true
            },
            {
                "name": "Refused by",
                "value": "Pending",
                "inline": true
            }
        ]
    };

    const payload = {
        embeds: [embed]
    };

    fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                showNotification('Sent Successfully');
                document.getElementById('supportForm').reset();

                // Start cooldown
                document.querySelector('#supportForm button').disabled = true;
                startCooldown(15 * 60); // 15 minutes cooldown
            } else {
                showNotification('Failed to send');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to send');
        });
});
