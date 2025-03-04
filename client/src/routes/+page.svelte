<script>
    /**
     * TODO: Implement the following features to enhance the website:
     * Most Important
     * 1. Add hover effects to project cards and interactive elements ✅
     * 2. Implement simple scroll-triggered fade-in animations for content ✅
     * 3. Create a dedicated "Projects" section with proper heading
     * 4. Organize projects in structured cards with consistent formatting
     * 5. Add a "Back to Top" button that appears when scrolling down ✅
     * 6. Improve spacing and typography in project descriptions 
     * Semi Important
     * 7. Create staggered animations for project cards as they enter viewport
     * 8. Implement a skills section with animated progress bars [working on] 🚧
     *   8a. Add admin functionality to my home page to access my supabase database to add new thinks im working on and their values
     *   8b. After adding that add fetching functionality to get the values from the database and display them in the progress bars
     * 9. Add sorting/filtering options for projects by category
     * 10. Create a scrollspy that highlights current section in navigation
     * 11. Add parallax scrolling effects for background elements ✅
     * 12. Implement smooth transitions between sections
     * Most Optional
     * 13. Create a dark/light mode toggle with theme persistence
     * 14. Implement a dynamic navbar that transforms on scroll
     * 15. Add a functional contact form with client-side validation
     * 16. Create interactive project previews (modal popups or sliders)
     * 17. Implement a particle.js or canvas-based animated background
     * 18. Build a mini-blog system with content filtering capabilities
    */

    // Svelte    
    import { onMount } from 'svelte';
    import { animate, time } from 'motion';
    // Photos
    import distanceDoorSesnsor from '$lib/assets/distanceDoorSesnsor.png';
    import exampleSRSM from '$lib/assets/exampleSRSM.png';
    import loginSucc from '$lib/assets/loginSuccesfful.png';
    import me from '$lib/assets/ME.png';
    
    /** @type {HTMLElement[]} */
    let sections = [];

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target, { opacity: [0, 1], y: [50, 0] }, { duration: Math.random()}); // Random duration to make it feel more natural
                        if (entry.target === sections[1]) {
                            typeAbout();
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        sections.forEach(section => observer.observe(section));

        // Parallax Scrolling
        window.addEventListener('scroll', () => {
            let scroll = window.scrollY;
            let body = document.getElementById('body');
            if (body) {
                body.style.backgroundPositionY = `${scroll / 2}px`;
            }
            console.log(scroll);
        });
    }); // End onMount

    // Functions
    
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // After scrolling to the top will pulse the contact button
        const contactButton = document.querySelector('a[href="/contact"]');
        if (contactButton) {
            contactButton.classList.add('animate-pulse');
            setTimeout(() => {
                contactButton.classList.remove('animate-pulse');
            }, 2500);
        }
    }

    // Types header to the about me section when user scrolls to it
    function typeAbout() {
        const aboutChar = "About Me";
        const timeout = 30;

        let charArr = [];

        for (let i = 0; i < aboutChar.length; i++) {
            charArr.push(aboutChar.charAt(i));
        }

        const aboutMe = document.getElementById('aboutMeTag');

        if (aboutMe?.innerHTML) {
            aboutMe.innerHTML = "";
        }

        setTimeout(() => {
            let i = 0;
            let interval = setInterval(() => {
                if (i < charArr.length && aboutMe) { // If about me is not null and the index is not greater than the length of the array will type
                    aboutMe.innerHTML += charArr[i];
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, timeout);
        }, 500);       
    }

</script>

<div id="body" class="bg-slate-800 overflow-auto">

    <div id="headerSection" class="bg-black flex flex-row justify-between items-center p-8">
        <h1 class="sm:text-xl text-3xl font-bold text-white">Tommy Halls Website</h1>
        <nav>
            <a href="/contact" class="text-white hover:bg-slate-800 hover:animate-pulse bg-red-800 border-red-800 rounded-xl p-3 m-4">Contact</a>
        </nav>
    </div>
    
    <div id="line" class="m-px p-px bg-red-800 min-w-screen"></div>
    <!-- Figure out how I want sectioning, Depending on how I want to the website to feel -->

    <section bind:this={sections[0]} style="opacity: 0;" class="min-w-screen min-h-screen m-5 p-2 flex flex-col items-center justify-center">
        <div id="container" class="m-4 p-2 bg-zinc-900 rounded-xl relative">
            <img src={me} alt="Me" class="absolute top-0 right-0 w-32 h-32 rounded-full border-4 border-none transform translate-x-1/4 -translate-y-1/2 z-8">
            <div id="intro" class="text-white p-4 m-4 text-center">
                <h2 class="m-4 text-2xl">Hello my name is Tommy Hall!</h2>
                <h2 class="m-4 text-2xl">I am currently a student at UNCC</h2>
                <h2 class="m-4 text-2xl">Scroll to see some of my projects and check out my contact page for more!</h2>
            </div>
        </div>
    </section>

    <div id="line" class="m-px p-px bg-red-800 min-w-screen"></div>

    <div id="project/aboutSection" class="items-center justify-center bg-black">

        <section bind:this={sections[1]} style="opacity: 0;" id="aboutSection" class="min-w-32 min-h-32 flex flex-col items-center justify-center bg-slate-900">
            <div id="AboutMeHeader" class="m-px p-4 rounded-xl bg-zinc-900 text-white text-4xl text-center">
                <h1  id="aboutMeTag">Loading Typewriter . . .</h1>
            </div>
        </section>
    
        <section bind:this={sections[2]} style="opacity: 0;" class="min-w-screen min-h-screen flex flex-col items-center justify-center bg-slate-900">
    
                <section bind:this={sections[3]} style="opacity: 0;" class="m-5 p-2 m-w-80 m-h-80">
                    <div class="hover:-translate-y-6 text-white p-4 m-4 text-center text-3xl bg-zinc-900 rounded-xl">
                        <h2>I am currently an undergraduate student at The University of North Carolina at Charlotte majoring in Computer Science</h2>
                        <h2>I am undecided between software development and cybersecurity as my major, as I feel web devs must know cybersecurity and researchers/cybersecurity specialist should know some programming</h2>
                    </div>
                </section>
    
                <section bind:this={sections[4]} style="opacity: 0;" class="m-1 p-2 w-96 h-96">
                    <img src={distanceDoorSesnsor} class="hover:-translate-y-6" alt="Door Sensor">
                    <p class="text-center m-2 p-2 text-white bg-slate-800 rounded-xl">ESP32 Door sensor network with sensor and server ESP32 using ESP-Now protocol</p>
                </section>
    
                <section bind:this={sections[5]} style="opacity: 0;" class="m-5 p-2 m-w-80 m-h-80">
                    <div class="text-white p-4 m-4 text-center text-3xl bg-zinc-900 rounded-xl hover:-translate-y-6">
                        <h2>In my spare time I like to get away from the computer (though not to long) and take trips to the mountains go to trails with my partner and our dog or go out to eat at a good restraunt (my favorite currently is Webbs Custom Kitchen)</h2>
                    </div>
                </section>
    
                <section bind:this={sections[6]} style="opacity: 0;" class="m-1 p-2 w-96 h-96">
                    <img src={loginSucc} class="hover:-translate-y-6" alt="Successful Login">
                    <p class="text-center m-2 p-2 text-white bg-slate-800 rounded-xl">Login Page of Remote System Monitor</p>
                </section>
                
                <section bind:this={sections[7]} style="opacity: 0;" class="m-5 p-2 m-w-80 m-h-80">
                    <div class="text-white p-4 m-4 text-center text-3xl bg-zinc-900 rounded-xl hover:-translate-y-6">
                        <h2>I am currently a junior at UNCC and in my time not spend studying for class I enjoy working on my own software projects trying to integrate material learned in class and build something cool while having fun!</h2>
                        <h2>I love hardware just as much as software! I have built 5 PC's with the two I currently use (one as a server one as my main) both being built by me I also enjoy arduino and ESP32 projects when I find time and brain capacity.</h2>
                        <h2>Fun Fact: The first programming language I learned was Java and I have always disliked it but somehow my favorite is between two widly different programming languages, C(++) and JavaScript!</h2>
                    </div>
                </section>
                
                <section bind:this={sections[8]} style="opacity: 0;" class="m-1 p-2 w-96 h-96">
                    <img src={exampleSRSM} class="hover:-translate-y-6" alt="SRSM">
                    <p class="text-center m-2 p-2 text-white bg-slate-800 rounded-xl">Remote System Monitor</p>
                </section>
                <section>
                    <div class="bg-zinc-900 rounded-xl hover:motion-safe:-translate-y-4 p-4 m-4">
                        <h1 class="text-white text-2xl">XP Bar for Current Skills I'm Workin On</h1>
                    </div>
                </section>
                <!-- Add admin functionality using node and supabase or something else so I can add new things Im working on and change the values much easier than this -->
                <section bind:this={sections[9]} style="opacity: 0;" class="m-5 p-2 grid grid-cols-2 gap-4 w-full max-w-4xl">
                    
                    <!-- First Progress Bar -->
                    <div class="bg-zinc-900 p-4 rounded-xl hover:motion-safe:-translate-y-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                Write Another Blog Post (For Fun)
                            </span>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                0%
                            </span>
                        </div>
                        <div class="w-full h-2 bg-gray-200 rounded-full">
                            <div class="h-full rounded-full bg-rose-600" style="width:0%"></div>
                        </div>
                    </div>
    
                    <!-- Second Progress Bar -->
                    <div class="bg-zinc-900 p-4 rounded-xl hover:motion-safe:-translate-y-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                Data Structures and Algorithms (Course)
                            </span>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                35%
                            </span>
                        </div>
                        <div class="w-full h-2 bg-gray-200 rounded-full">
                            <div class="h-full rounded-full bg-rose-600" style="width:35%"></div>
                        </div>
                    </div>
    
                    <!-- Third Progress Bar -->
                    <div class="bg-zinc-900 p-4 rounded-xl hover:motion-safe:-translate-y-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                My Website (Professional/Practice)
                            </span>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                60%
                            </span>
                        </div>
                        <div class="w-full h-2 bg-gray-200 rounded-full">
                            <div class="h-full rounded-full bg-rose-600" style="width:60%"></div>
                        </div>
                    </div>    
                    <!-- Fourth Progress Bar -->
                    <div class="bg-zinc-900 p-4 rounded-xl hover:motion-safe:-translate-y-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                SupaBase Basics (New Technology)
                            </span>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-slate-500">
                                20%
                            </span>
                        </div>
                        <div class="w-full h-2 bg-gray-200 rounded-full">
                            <div class="h-full rounded-full bg-rose-600" style="width:20%"></div>
                        </div>
                    </div>
                     
                </section>
        </section>
    
        <div id="line" class="m-px p-px bg-red-800 min-w-screen"></div>
    
        <section bind:this={sections[10]} style="opacity: 0;" class="flex flex-col items-center justify-center bg-rose-900">
            <div id="footer" class="m-4 p-4 bg-zinc-900 rounded-xl text-white text-center text-xl hover:motion-safe:animate-bounce">
                <h2>Thank you for visiting my website!</h2>
                <h2>Feel free to check out my contact page for more information as well as my blog!</h2>
            </div>
    
            <button onclick={scrollToTop} class="text-center bg-zinc-900 text-white p-4 m-4 rounded-xl justify-center items-center hover:bg-red-800 hover:animate-pulse">Scroll To Top</button>
        </section>
        
        <div id="line" class="m-px p-px bg-red-800 min-w-screen"></div>

        <section bind:this={sections[11]} style="opacity: 0;">
            <div class="flex flex-col items-center justify-center bg-black text-white text-xs p-2">
                <footer>Hosted On <a href="https://vercel.com/" target="_blank"><b>Vercel</b></a> Domain with <a href="https://namecheap.com/" target="_blank"><b>NameCheap</b></a></footer>
                <footer><a href="https://github.com/TeejMcSteez/WebsiteRebuild" target="_blank">This Website on <b>Github</b></a></footer>
            </div>
        </section>

    </div>

</div>