<script>
    import { onMount } from 'svelte';
    import { animate } from 'motion';
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
                        animate(entry.target, { opacity: [0, 1], y: [50, 0] }, { duration: Math.random() });
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
        });
      // Gets skill info
        getSupabaseSkillData();
    }); // End mount

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const contactButton = document.querySelector('a[href="/contact"]');
        if (contactButton) {
            contactButton.classList.add('animate-pulse');
            setTimeout(() => {
                contactButton.classList.remove('animate-pulse');
            }, 2500);
        }
    }
    /** @type {{ skill_name: string, complet_perc: string }[]} */
    let supabaseData = [];

    function typeAbout() {
        const aboutChar = "About Me";
        const timeout = 30;
        let charArr = aboutChar.split("");
        const aboutMe = document.getElementById('aboutMeTag');
        if (aboutMe) aboutMe.innerHTML = "";
        setTimeout(() => {
            let i = 0;
            let interval = setInterval(() => {
                if (i < charArr.length && aboutMe) {
                    aboutMe.innerHTML += charArr[i];
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, timeout);
        }, 500);
    }

    async function getSupabaseSkillData() {
      try {
        const res = await fetch('/api/supabase');
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Failed to fetch');
        }
        supabaseData = json.data
      } catch (err) {
        throw err;
      }
    }
</script>

<div id="body" class="dark:bg-slate-800 bg-sky-200 overflow-auto font-sans text-gray-100">
  <!-- Header Section -->
  <header class="bg-black flex justify-between items-center p-6 shadow-lg sticky top-0 z-50">
    <h1 class="text-3xl font-bold">Tommy Hall's Portfolio</h1>
    <nav>
      <a href="/contact" class="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">
        Contact
      </a>
    </nav>
  </header>

  <div class="border-t border-red-600"></div>

  <!-- Main Content -->
  <main class="space-y-16">
    <!-- Introduction Section -->
    <section bind:this={sections[0]} style="opacity: 0;" class="min-h-screen flex flex-col items-center justify-center px-4">
      <div class="relative bg-zinc-900 rounded-xl p-8 shadow-lg">
        <img src={me} alt="Tommy" class="absolute -top-12 right-4 w-24 h-24 rounded-full border-4 border-red-600 shadow-lg">
        <div class="mt-16 text-center">
          <h2 class="text-2xl font-semibold mb-2">Hello, I'm Tommy Hall!</h2>
          <p class="text-lg">Student at UNCC. Scroll down to see my projects and more details.</p>
        </div>
      </div>
    </section>

    <!-- About Section with Typewriter Effect -->
    <section bind:this={sections[1]} style="opacity: 0;" id="aboutSection" class="dark:bg-slate-900 py-12">
      <div class="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-xl shadow-lg">
        <h1 id="aboutMeTag" class="text-4xl font-bold text-center">
          Loading Typewriter . . .
        </h1>
      </div>
      <div class="max-w-3xl my-2 mx-auto bg-zinc-900 p-8 rounded-xl shadow-lg">
        <p>
            I am passionate about web development and security, while in school I have mainly stuck with web development to learn how to program and how computers work in general I aim to learn more about 
            cybersecurity.
        </p>
      </div>
      <div class="max-w-3xl my-2 mx-auto bg-zinc-900 p-8 rounded-xl shadow-lg">
        <p>
            Aside from my time programming and in school I enjoy working with hardware to such as building computers (up to 6 now) as well as playing with microcontrollers like the ESP32. I also enjoy 3D printing parts and useful little things like a Xbox controller holder.
        </p>
      </div>
      <div class="max-w-3xl my-2 mx-auto bg-zinc-900 p-8 rounded-xl shadow-lg">
        <p>
            When i'm not on the computer me and my partner enjoy travelling to the mountains or the beach with our dog and spending time outside.
        </p>
      </div>
      <div class="max-w-3xl my-2 mx-auto bg-zinc-900 p-8 rounded-xl shadow-lg">
        <p>
            Thats me! Check out my blog for a cool story on how I made the blog system work on my website!
        </p>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="dark:bg-slate-900 bg-sky-200 py-12">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="dark:text-white text-3xl font-bold text-center mb-8 dark:bg-inherit bg-zinc-900 p-2 rounded-xl">Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Project Card 1 -->
          <div bind:this={sections[3]} style="opacity: 0;" class="bg-zinc-900 rounded-xl p-6 shadow-lg hover:-translate-y-2 transform transition">
            <img src={distanceDoorSesnsor} alt="Door Sensor" class="w-full h-48 object-cover rounded-md mb-4">
            <h3 class="text-2xl font-semibold mb-2 text-gray-300">Door Sensor Network</h3>
            <p class="text-sm text-white">ESP32 Door sensor network with sensor and server ESP32 using ESP-Now protocol.</p>
          </div>
          <!-- Project Card 2 -->
          <div bind:this={sections[6]} style="opacity: 0;" class="bg-zinc-900 rounded-xl p-6 shadow-lg hover:-translate-y-2 transform transition">
            <img src={loginSucc} alt="Successful Login" class="w-full h-48 object-cover rounded-md mb-4">
            <h3 class="text-2xl font-semibold mb-2 text-gray-300">Remote System Monitor</h3>
            <p class="text-sm text-white">Login Page of Remote System Monitor.</p>
          </div>
          <!-- Project Card 3 -->
          <div bind:this={sections[8]} style="opacity: 0;" class="bg-zinc-900 rounded-xl p-6 shadow-lg hover:-translate-y-2 transform transition">
            <img src={exampleSRSM} alt="SRSM" class="w-full h-48 object-cover rounded-md mb-4">
            <h3 class="text-2xl font-semibold mb-2 text-gray-300">SRSM Project</h3>
            <p class="text-sm text-white">Main Page of readings for the Secure Remote System Monitor</p>
          </div>
          <!-- Additional project cards can be added here -->
        </div>
      </div>
    </section>

    <!-- Skills / Progress Bars Section -->
    <section bind:this={sections[9]} style="opacity: 0;" class="dark:bg-slate-900 bg-sky-200 py-12">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8 p-2 rounded-xl dark:text-white dark:bg-inherit bg-zinc-900">Current Skills Progress</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <!-- Progress bar from supabase data -->
          {#if supabaseData.length > 0}
            {#each supabaseData as skill}
              <div class="bg-zinc-900 p-4 rounded-xl shadow-lg">
                <div class="flex justify-between mb-2">
                  <span class="text-xs font-semibold bg-slate-500 rounded-full px-2 py-1">{skill.skill_name}</span>
                  <span class="text-xs font-semibold bg-slate-500 rounded-full px-2 py-1">{skill.complet_perc}%</span>
                </div>
                <div class="w-full h-2 bg-gray-200 rounded-full">
                  <div class="h-full rounded-full bg-rose-600" style="width: {skill.complet_perc}%"></div>
                </div>
              </div>
            {/each}
          {:else}
            <div class="bg-zinc-900 p-4 rounded-xl shadow-lg text-center">
              <p class="text-white text-xl">There is currently no skills data! (i.e. I am lazy)</p>
            </div>
          {/if}
        </div>
      </div>
    </section>
  </main>

  <!-- Footer Section -->
  <footer class="bg-rose-500 py-8">
    <div class="max-w-5xl mx-auto px-4 text-center">
      <div id="footer" class="bg-zinc-900 p-6 rounded-xl shadow-lg hover:animate-bounce transition">
        <p class="text-xl">Thank you for visiting my website!</p>
        <p class="text-xl">Check out my contact page for more information or read my blog.</p>
      </div>
      <div class="mt-4 text-xs">
        <p>
          Hosted on <a href="https://vercel.com/" class="underline" target="_blank">Vercel</a> |
          Domain by <a href="https://namecheap.com/" class="underline" target="_blank">NameCheap</a>
        </p>
        <p>
          <a href="https://github.com/TeejMcSteez/WebsiteRebuild" class="underline" target="_blank">View on Github</a>
        </p>
      </div>
    </div>
  </footer>

  <!-- Back to Top Button -->
  <button onclick={scrollToTop} class="fixed bottom-4 right-4 bg-zinc-900 text-white px-4 py-2 rounded shadow-lg hover:bg-red-800 transition">
    Back to Top
  </button>
</div>
