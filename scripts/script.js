const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const mainScreen = document.getElementById('mainScreen');
const successScreen = document.getElementById('successScreen');
const catScreen = document.getElementById('catScreen');
        
    let timerRunning = false;
        let timerId = null;
        let mobileClickCount = 0; 

        // Helper to detect mobile
        function isMobile() {
            return window.innerWidth <= 768;
        }

        // --- INTERACTION LOGIC ---
        function handleInteraction(e) {
            
            if (isMobile()) {
                // === MOBILE: CLICK TO SHRINK/GROW ===
                if (e.type === 'mouseenter') return; // Ignore hover on mobile
                e.preventDefault(); 
                
                mobileClickCount++;

                if (mobileClickCount >= 3) {
                    showCat();
                } else {
                    // Resize Buttons
                    const scaleYes = 1 + (mobileClickCount * 0.4); 
                    const scaleNo = 1 - (mobileClickCount * 0.2);
                    yesBtn.style.transform = `scale(${scaleYes})`;
                    noBtn.style.transform = `scale(${scaleNo})`;
                }

            } else {
                // === PC: SMOOTH DODGE ===
                // Only move on hover, OR click if they somehow catch it
                moveButtonSmoothly();
            }
        }

        // --- PC SMOOTH MOVEMENT MATH ---
        function moveButtonSmoothly() {
            // 1. Start 10s Timer
            if (!timerRunning) {
                timerRunning = true;
                timerId = setTimeout(() => { showCat(); }, 10000); 
            }

            // 2. Make Fixed if not already
            if (noBtn.style.position !== 'fixed') {
                const rect = noBtn.getBoundingClientRect();
                noBtn.style.position = 'fixed';
                noBtn.style.left = rect.left + 'px';
                noBtn.style.top = rect.top + 'px';
            }

            // 3. Get Current Position
            const currentLeft = parseFloat(noBtn.style.left) || 0;
            const currentTop = parseFloat(noBtn.style.top) || 0;

            // 4. Calculate a "Jump" (Delta) instead of random teleport
            // Move between 100px and 250px away
            const minJump = 100; 
            const maxJump = 250; 
            
            const dirX = Math.random() < 0.5 ? -1 : 1;
            const dirY = Math.random() < 0.5 ? -1 : 1;

            let moveX = (minJump + Math.random() * (maxJump - minJump)) * dirX;
            let moveY = (minJump + Math.random() * (maxJump - minJump)) * dirY;

            let newX = currentLeft + moveX;
            let newY = currentTop + moveY;

            // 5. Boundary Checks (Bounce off walls)
            const btnWidth = noBtn.offsetWidth;
            const btnHeight = noBtn.offsetHeight;
            const pad = 20; 

            // If goes off left/right
            if (newX < pad) newX = window.innerWidth - btnWidth - pad - (Math.random()*50);
            if (newX + btnWidth > window.innerWidth - pad) newX = pad + (Math.random()*50);
            
            // If goes off top/bottom
            if (newY < pad) newY = window.innerHeight - btnHeight - pad - (Math.random()*50);
            if (newY + btnHeight > window.innerHeight - pad) newY = pad + (Math.random()*50);

            // 6. Apply with CSS transition
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
        }

        // Listeners
        noBtn.addEventListener('mouseenter', handleInteraction); // PC Hover
        noBtn.addEventListener('click', handleInteraction);      // PC Click / Mobile Tap
        noBtn.addEventListener('touchstart', handleInteraction); // Mobile Tap

        // Yes Button
        yesBtn.addEventListener('click', () => {
            if (timerId) clearTimeout(timerId);
            mainScreen.style.display = 'none';
            successScreen.style.display = 'flex';
            document.body.style.backgroundColor = "#ffcdd2";
        });

        // Show Cat
        function showCat() {
            if (successScreen.style.display !== 'flex') {
                mainScreen.style.display = 'none';
                catScreen.style.display = 'flex';
                document.body.style.backgroundColor = "black";
                setTimeout(() => { resetGame(); }, 5000);
            }
        }

        // Reset
        function resetGame() {
            catScreen.style.display = 'none';
            mainScreen.style.display = 'flex';
            document.body.style.backgroundColor = "#ffdde1";

            timerRunning = false;
            mobileClickCount = 0;
            if (timerId) clearTimeout(timerId);

            // Reset Positions & Scales
            noBtn.style.position = 'relative';
            noBtn.style.left = 'auto';
            noBtn.style.top = 'auto';
            noBtn.style.transform = 'scale(1)';
            yesBtn.style.transform = 'scale(1)';
        }
    