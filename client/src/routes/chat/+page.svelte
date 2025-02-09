<script>
    /**
     * TODO: 
     * 1. Create buttons to choose chat model
     * 2. A sidebar with past conversation names pulled from redis
     * 3. Make chat UI better and add the ability for dark mode? maybe
     * 4. Block input after message is sen't
     */
    let message = '';
    let chatResponse = '';
    let showModal = false;
    let chatName = '';
    /**
     * @type {string[]}
     */
    let messageList = [];

    let responses = [];

    async function sendMessage() {
        console.log("Message Received: ", message);
        messageList.push(message);

        const response = await fetch('http://localhost:3000/API/chat1.5b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        chatResponse = data.message;
        responses.push(chatResponse);
    }

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    async function createNewChat() {
        console.log("New chat created with name:", chatName);
        // API to post to redis
        fetch('/API/saveChat', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ chatName, message }),

        });
        closeModal();
    }
</script>

<main class="flex flex-col items-center justify-center space-y-4">
    <div id="chatBox" class="w-80 h-80 border p-4 overflow-scroll">
        
        
    </div>

    <form on:submit|preventDefault={sendMessage} class="flex space-x-2">
        <input type="text" bind:value={message} placeholder="Type your message..." class="border p-2" required/>
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">Send</button>
    </form>
    
    <button on:click={openModal} class="bg-green-500 text-white p-2 rounded">New Chat</button>

    {#if showModal}
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded shadow-lg">
                <button on:click={closeModal} class="text-gray-500 hover:text-gray-700">&times;</button>
                <h2 class="text-xl mb-4">Enter Chat Name</h2>
                <input type="text" bind:value={chatName} placeholder="Chat Name" class="border p-2 mb-4 w-full" />
                <button on:click={createNewChat} class="bg-blue-500 text-white p-2 rounded">Create</button>
            </div>
        </div>
    {/if}
</main>

