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
        <div id="container" class="m-4 p-2 bg-zinc-900 rounded-xl min-h-60 max-w-96">
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
    <section bind:this={sections[5]} class="flex flex-col items-center justify-center">
        <div id="AboutMeHeader" class="m-px p-4 rounded-xl bg-zinc-900 text-white text-4xl">
            <h1>About Me</h1>
        </div>
    </section>
    <section bind:this={sections[6]} style="opacity: 0;" class="m-5 p-2 flex flex-col items-center justify-center">
        <div id="aboutMe" class="m-4 p-4 bg-zinc-900 rounded-xl text-white">
            <h2>I am currently an undergraduate student at The University of North Carolina at Charlotte majoring in Computer Science</h2>
            <h2>I am undecided between software development and cybersecurity as my major, as  I feel web devs must know cybersecurity and researchers/cybersecurity specialist should know some programming</h2>
            <h2>In my spare time I like to get away from the computer (though not to long) and take trips to the mountains go to trails with my partner and our dog or go out to eat at a good restraunt (my favriote currently is Webbs Custom Kitchen)</h2>
            <h2>I am currently a junior at UNCC and in my time not spend studying for class I enjoy working on my own software projects trying to integrate material learned in class and build something cool while having fun!</h2>
            <h2>I love hardware just as much as software! I have built 5 PC's with the two I currently use (one as a server one as my main) both being built by me I also enjoy arduino and ESP32 projects when I find time and brain capacity.</h2>
            <h2>Fun Fact: The first programming language I learned was Java and I have always disliked it but somehow my favorite is between two widly different programming languages, C(++) and JavaScript!</h2>
        </div>
    </section>

</div>