<script>
    import err from '../lib/assets/err.jpg';
    export let error;

    if (!error) {
        error = "You have encountered an error. Please try again later.";
    }
</script>
<img src={err} alt="Error Dinosaur" class="m-w-screen m-h-screen">
<h1 class="text-3xl flex-col text-center">Ah ah ah, that wasn't the magic word . . . </h1>
<h1 class="text-3xl flex-col text-center">The challenge you face: {error} . . .</h1>