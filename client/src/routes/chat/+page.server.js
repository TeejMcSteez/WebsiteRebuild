export const actions = {
    default: async({ request }) => {
        const formData = await request.formData();
        const message = formData.get('message');

        console.log("Recieved: ", message);
    }
};