<script>

let app = firebase.app();
const features = ['auth', 'database', 'firestore', 'messaging', 'storage'];
const activeFeatures = features.filter(feature => typeof app[feature] === 'function');

console.log(`Firebase SDK loaded with ${activeFeatures.join(', ')}`);
console.log(app);
</script>

<div id="message">
    <h2>Welcome</h2>
    <h1>Firebase Hosting Setup Complete</h1>
    <p>You're seeing this because you've successfully setup Firebase Hosting. Now it's time to go build something extraordinary!</p>
    <a target="_blank" href="https://firebase.google.com/docs/hosting/">Open Hosting Documentation</a>
    <p>Firebase SDK loaded with { activeFeatures.join(', ') }</p>
</div>


<style>
    #message { background: white; max-width: 360px; margin: 50px auto 16px; padding: 32px 24px; border-radius: 3px; }
    h2 { color: #ffa100; font-weight: bold; font-size: 16px; margin: 0 0 8px; }
    h1 { font-size: 22px; font-weight: 300; color: rgba(0,0,0,0.6); margin: 0 0 16px;}
    p { line-height: 140%; margin: 16px 0 24px; font-size: 14px; }
    a { display: block; text-align: center; background: #039be5; text-transform: uppercase; text-decoration: none; color: white; padding: 16px; border-radius: 4px; }
    #message, a { box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); }
</style>

