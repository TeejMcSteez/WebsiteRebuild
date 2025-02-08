<script>
    import { onMount } from 'svelte';
    import { animate } from 'motion';
    // Photos
    // See if I cant find some type defintions for sections
    // So they will stop red lining and types will be known
    let section1;
    let section2;
    let hasAnimated = false;

    onMount(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;

                    animate(section1, {opacity: [0,1], y:[50, 0], duration: 0.6});
                }
            },
            {threshold: 0.1}
        );
        observer.observe(section1);
    });
</script>

<div id="headerSection" class="bg-black flex flex-row justify-between items-center p-8">
    <h1 class="sm:text-xl text-3xl font-bold text-white">Tommy Halls Website</h1>
    <nav>
        <a href="/contact" class="text-white hover:bg-slate-500 bg-red-800 border-red-800 rounded-xl p-2 m-3">Contact</a>
    </nav>
</div>

<div id="line" class="m-px p-px bg-red-800 min-w-screen"></div>
<!-- Figure out how I want sectioning, Depending on how I want to the website to feel -->
<section1 bind:this={section1} style="opacity: 0;">
    <div id="container" class="m-auto p-2 bg-zinc-900 ">
        <div id="intro" class="text-white flex flex-col items-center justify-center min-h-80 p-4 m-4">
            <h2 class="m-4">Hello my name is Tommy Hall!</h2>
            <h2 class="m-4">I am currently a student at UNCC</h2>
            <h2 class="m-4">Checkout my Github or Instagram in the contacts page to see some of my projects and work!</h2>
        </div>
    </div>
</section1>
<section1 bind:this={section2} style="opacity: 0;">
    <div id="pictureContainer">
        <!-- Add pictures here not sure how svelete handles that yet -->
    </div>
</section1>