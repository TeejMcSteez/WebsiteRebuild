<script>
    import { onMount } from 'svelte';
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
    let chatIds = [];

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

    async function fetchChatIds() {
        try {
            const response = await fetch('http://localhost:3000/API/getAllChats');
            const data = await response.json();
            chatIds = data.chatIds;
        } catch (error) {
            console.error('Error fetching chat IDs:', error);
        }
    }

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }
    // FIX
    async function createNewChat() {
        console.log("New chat created with name:", chatName);
        // API to post to redis
        fetch('http://localhost:3000/API/saveChat', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ chatName, message }),
        });
        closeModal();
    }

    async function fetchChat(chatID) {
        try {
            const response = await fetch(`http://localhost:3000/API/loadChat/${chatID}`);
            const data = await response.json();
            const msgs = data.messages;

            messageList = msgs.map(msg => msg.text);
            responses = msgs.map(msg => msg.response);
        } catch (error) {
            console.error('Error fetching chat:', error);
        }
    }

    // Fetch chat IDs on component mount
    onMount(() => {
        fetchChatIds();
    });
</script>

<main class="flex flex-row h-screen">
    <nav class="w-1/4 bg-gray-800 text-white p-4">
        <h2 class="text-xl mb-4">Past Conversations</h2>
        {#each chatIds as chatId}
            <button on:click={() => fetchChat(chatId)} class="w-full text-left p-2 m-2 bg-gray-700 hover:bg-gray-600 rounded">{chatId}</button>
        {/each}
    </nav>

    <div class="flex flex-col items-center justify-center space-y-4 w-3/4 p-4">
        <div id="chatBox" class="w-full max-w-2xl h-96 border p-4 overflow-scroll bg-white">
            <!-- Doesn't properly diplay values and need to figure out why . . . -->
            {#each messageList as message, index}
                <p class="text-blue-500"><strong>User:</strong> {message}</p>
                <p class="text-green-500"><strong>Bot:</strong> {responses[index]}</p>
            {/each}
        </div>

        <form on:submit|preventDefault={sendMessage} class="flex space-x-2 w-full max-w-2xl">
            <input type="text" bind:value={message} placeholder="Type your message..." class="border p-2 flex-grow" required/>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Send</button>
        </form>
        
        <button on:click={openModal} class="bg-green-500 text-white p-2 rounded">New Chat</button>

        {#if showModal}
            <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
                    <button on:click={closeModal} class="text-gray-500 hover:text-gray-700">&times;</button>
                    <h2 class="text-xl mb-4">Enter Chat Name</h2>
                    <input type="text" bind:value={chatName} placeholder="Chat Name" class="border p-2 mb-4 w-full" />
                    <button on:click={createNewChat} class="bg-blue-500 text-white p-2 rounded">Create</button>
                </div>
            </div>
        {/if}
    </div>
</main>

