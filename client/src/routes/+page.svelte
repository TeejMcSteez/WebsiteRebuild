<script>
    import { onMount } from 'svelte';
    import { animate } from 'motion';
    // Photos
    import distanceDoorSesnsor from '$lib/assets/distanceDoorSesnsor.png';
    import exampleSRSM from '$lib/assets/exampleSRSM.png';
    import loginSucc from '$lib/assets/loginSuccesfful.png';
    
    /** @type {HTMLElement[]} */
    let sections = [];

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target, { opacity: [0, 1], y: [50, 0] }, { duration: 0.6 });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        sections.forEach(section => observer.observe(section));
    });
</script>

<div id="body" class="bg-zinc-800 overflow-auto">

    <div id="headerSection" class="bg-black flex flex-row justify-between items-center p-8">
        <h1 class="sm:text-xl text-3xl font-bold text-white">Tommy Halls Website</h1>
        <nav>
            <a href="/contact" class="text-white hover:bg-slate-500 bg-red-800 border-red-800 rounded-xl p-2 m-3">Contact</a>
        </nav>
    </div>
    
    <div id="line" class="m-px p-px bg-red-800 min-w-screen"></div>
    <!-- Figure out how I want sectioning, Depending on how I want to the website to feel -->
    <section bind:this={sections[0]} style="opacity: 0;" class="m-5 p-2 flex flex-col items-center justify-center">
        <div id="container" class="m-10 p-2 bg-zinc-900 min-h-80 max-w-80">
            <div id="intro" class="text-white p-4 m-4">
                <h2 class="m-4">Hello my name is Tommy Hall!</h2>
                <h2 class="m-4">I am currently a student at UNCC</h2>
                <h2 class="m-4">Scroll to see some of my projects and check out my contact page for more!</h2>
            </div>
        </div>
    </section>
    <section bind:this={sections[1]} style="opacity: 0;" class="">
        <div id="pictureContainer">
            <!-- Pictures in scroll sections with the picture section being its own section -->
            <section bind:this={sections[2]} style="opacity: 0;" class="m-5 p-2 m-w-80 m-h-80">
                <img src={distanceDoorSesnsor} alt="Door Sensor">
            </section>
            <section bind:this={sections[3]} style="opacity: 0;" class="m-5 p-2 m-w-80 m-h-80">
                <img src={loginSucc} alt="Successful Login">
            </section><section bind:this={sections[4]} style="opacity: 0;" class="m-5 p-2 m-w-80 m-h-80">
                <img src={exampleSRSM} alt="SRSM">
            </section>
        </div>
    </section>

</div>