<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights';

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });
	let { children } = $props();
</script>

{@render children()}
