// --- DATA & CONFIG ---
const CONFIG = {
    USE_EXTERNAL_PLAYER: true // Abilitato per caricare player2.glb
};

const LEVELS = [
    {
        id: 1,
        title: "Il marciapiede assassino",
        question: "Qual è il problema principale di questo incrocio?",
        correct: 0,
        answers: [
            "Manca uno scivolo accessibile.",
            "Il colore del marciapiede è poco visibile.",
            "Ci sono troppi pedoni."
        ],
        gag: "Complimenti, hai appena progettato l’Everest urbano. Ritenta!",
        successMsg: "Esatto! Un marciapiede senza scivolo è un muro invalicabile per chi è in carrozzina.",
        buildScene: (scene) => {
            const group = new THREE.Group();
            
            // Strada
            const roadGeo = new THREE.PlaneGeometry(30, 30);
            const roadMat = new THREE.MeshLambertMaterial({color: 0x333333});
            const road = new THREE.Mesh(roadGeo, roadMat);
            road.rotation.x = -Math.PI / 2;
            group.add(road);

            // Strisce pedonali
            for(let i=0; i<5; i++) {
                const stripe = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), new THREE.MeshLambertMaterial({color: 0xffffff}));
                stripe.rotation.x = -Math.PI / 2;
                stripe.position.set(0, 0.01, -3 + (i * 1.5));
                group.add(stripe);
            }

            // Marciapiede altissimo
            const sidewalkGeo = new THREE.BoxGeometry(30, 2, 10);
            const sidewalkMat = new THREE.MeshLambertMaterial({color: 0x888888});
            const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
            sidewalk.position.set(0, 1, -10);
            group.add(sidewalk);

            // Target (bordo del marciapiede senza scivolo)
            const targetGeo = new THREE.BoxGeometry(8, 2.1, 1);
            const targetMat = new THREE.MeshLambertMaterial({color: 0xff3333, transparent: true, opacity: 0.3});
            const target = new THREE.Mesh(targetGeo, targetMat);
            target.position.set(0, 1, -5);
            target.userData = { isTarget: true };
            group.add(target);
            
            scene.add(group);
            return { group, target, cameraPos: new THREE.Vector3(10, 8, 10), lookAt: new THREE.Vector3(0, 0, -5) };
        }
    },
    {
        id: 2,
        title: "Ascensore in ferie",
        question: "Qual è la soluzione più corretta?",
        correct: 2,
        answers: [
            "Costruire un ascensore ancora più piccolo.",
            "Aspettare che torni dalle ferie nel 2050.",
            "Riparare subito l’ascensore e prevedere un percorso alternativo accessibile."
        ],
        gag: "L’ascensore è più stanco di noi. Non è una soluzione. Ritenta!",
        successMsg: "Esatto! L'accessibilità non va mai in ferie, deve esserci un'alternativa.",
        buildScene: (scene) => {
            const group = new THREE.Group();
            
            // Pavimento
            const floorGeo = new THREE.PlaneGeometry(20, 20);
            const floorMat = new THREE.MeshLambertMaterial({color: 0x555555});
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.rotation.x = -Math.PI / 2;
            group.add(floor);

            // Muro
            const wallGeo = new THREE.BoxGeometry(20, 15, 1);
            const wallMat = new THREE.MeshLambertMaterial({color: 0xdddddd});
            const wall = new THREE.Mesh(wallGeo, wallMat);
            wall.position.set(0, 7.5, -5);
            group.add(wall);

            // Porte ascensore rotto
            const doorGeo = new THREE.BoxGeometry(4, 8, 1.2);
            const doorMat = new THREE.MeshLambertMaterial({color: 0x999999});
            const door = new THREE.Mesh(doorGeo, doorMat);
            door.position.set(0, 4, -5);
            group.add(door);
            
            // Crepa / nastro rotto
            const tapeGeo = new THREE.PlaneGeometry(5, 0.5);
            const tapeMat = new THREE.MeshLambertMaterial({color: 0xff0000});
            const tape = new THREE.Mesh(tapeGeo, tapeMat);
            tape.position.set(0, 4, -4.39);
            tape.rotation.z = Math.PI / 4;
            group.add(tape);

            // Cartello
            const signGeo = new THREE.PlaneGeometry(3, 2);
            const signMat = new THREE.MeshLambertMaterial({color: 0xffcc00});
            const sign = new THREE.Mesh(signGeo, signMat);
            sign.position.set(-3, 5, -4.4);
            sign.userData = { isTarget: true };
            group.add(sign);

            scene.add(group);
            return { group, target: sign, cameraPos: new THREE.Vector3(0, 5, 8), lookAt: new THREE.Vector3(0, 4, -5) };
        }
    },
    {
        id: 3,
        title: "Bagno accessibile per formiche",
        question: "Cosa rende davvero accessibile un bagno?",
        correct: 1,
        answers: [
            "Un bel cartello blu con il simbolo della carrozzina sulla porta.",
            "Spazio di manovra, porta larga, maniglioni e lavabo accessibile.",
            "La presenza di un profumatore per ambienti premium."
        ],
        gag: "Accessibile sì, ma solo se sei un origami. Ritenta!",
        successMsg: "Bravissimo! Le dimensioni e gli ausili contano quando si parla di accessibilità.",
        buildScene: (scene) => {
            const group = new THREE.Group();
            
            // Pavimento
            const floorGeo = new THREE.PlaneGeometry(10, 10);
            const floorMat = new THREE.MeshLambertMaterial({color: 0x88ccff});
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.rotation.x = -Math.PI / 2;
            group.add(floor);

            // Muri stretti
            const wallMat = new THREE.MeshLambertMaterial({color: 0xeeeeee});
            const w1 = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 0.5), wallMat);
            w1.position.set(0, 3, -3);
            group.add(w1);
            
            const w2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 6), wallMat);
            w2.position.set(-3, 3, 0);
            group.add(w2);

            // WC minuscolo incastrato
            const toiletGeo = new THREE.BoxGeometry(1.5, 1.5, 2);
            const toiletMat = new THREE.MeshLambertMaterial({color: 0xffffff});
            const toilet = new THREE.Mesh(toiletGeo, toiletMat);
            toilet.position.set(-2, 0.75, -2);
            
            // Target
            const targetGeo = new THREE.BoxGeometry(2, 2, 2.5);
            const targetMat = new THREE.MeshLambertMaterial({color: 0xff3333, transparent: true, opacity: 0.3});
            const target = new THREE.Mesh(targetGeo, targetMat);
            target.position.set(-2, 1, -2);
            target.userData = { isTarget: true };
            
            group.add(toilet);
            group.add(target);

            // Ostacolo (lavandino enorme in mezzo)
            const boxGeo = new THREE.BoxGeometry(2, 3, 2);
            const boxMat = new THREE.MeshLambertMaterial({color: 0x8b4513});
            const box = new THREE.Mesh(boxGeo, boxMat);
            box.position.set(0.5, 1.5, -0.5);
            group.add(box);

            scene.add(group);
            return { group, target, cameraPos: new THREE.Vector3(5, 7, 5), lookAt: new THREE.Vector3(-1, 2, -1) };
        }
    }
];

// --- SAVE SYSTEM ---
const SaveManager = {
    data: {
        currentLevel: 1,
        unlockedLevels: 1,
        score: 0,
        highScore: 0,
        lastPlayed: null
    },
    load: function() {
        try {
            const saved = localStorage.getItem('disabilityComediesSave');
            if (saved) {
                this.data = { ...this.data, ...JSON.parse(saved) };
            }
        } catch(e) { console.error("Save corrupted or blocked", e); }
    },
    save: function() {
        this.data.lastPlayed = new Date().toISOString();
        if (this.data.score > this.data.highScore) {
            this.data.highScore = this.data.score;
        }
        try {
            localStorage.setItem('disabilityComediesSave', JSON.stringify(this.data));
        } catch(e) { console.error("Cannot save, localStorage blocked", e); }
    },
    reset: function() {
        const hc = this.data.highScore;
        this.data = { currentLevel: 1, unlockedLevels: 1, score: 0, highScore: hc, lastPlayed: null };
        this.save();
    },
    addScore: function(points) {
        this.data.score += points;
        this.save();
    },
    unlockNext: function() {
        this.data.score += 200; // Bonus completamento
        if (this.data.currentLevel < LEVELS.length) {
            this.data.currentLevel++;
            if (this.data.currentLevel > this.data.unlockedLevels) {
                this.data.unlockedLevels = this.data.currentLevel;
            }
        }
        this.save();
    }
};

// --- THREE.JS ENGINE ---
const Engine = {
    scene: null, camera: null, renderer: null, raycaster: null, mouse: null,
    currentSceneObjects: [], interactiveObjects: [], isGameActive: false,
    playerModel: null, playerContainer: null,
    currentPlayerPos: new THREE.Vector3(),
    currentPlayerLookAt: new THREE.Vector3(),
    
    init: function() {
        const container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Cielo

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        // Luci
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('click', (e) => this.onMouseClick(e), false);
        window.addEventListener('touchstart', (e) => {
            if(e.touches.length > 0) {
                this.onMouseClick({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
            }
        }, false);

        if (CONFIG.USE_EXTERNAL_PLAYER) {
            this.loadPlayerModel();
        }
        
        this.animate();
    },

    loadPlayerModel: function() {
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.warn("GLTFLoader non trovato. Il gioco continua senza modello player.");
            return;
        }
        
        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/models/wheelchair.glb',
            (gltf) => {
                this.playerModel = gltf.scene;
                
                // Calcola e normalizza la scala con Box3
                const box = new THREE.Box3().setFromObject(this.playerModel);
                const size = new THREE.Vector3();
                box.getSize(size);
                
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 0) {
                    const scaleFactor = 2.6 / maxDim; // Aumentato del ~45% per renderlo più leggibile
                    this.playerModel.scale.setScalar(scaleFactor);
                }
                
                // Ricalcola il centro dopo la scalatura
                box.setFromObject(this.playerModel);
                const center = new THREE.Vector3();
                box.getCenter(center);
                
                // Centra la geometria su X e Z, ma allinea la base (min.y) allo zero locale
                this.playerModel.position.x += (this.playerModel.position.x - center.x);
                this.playerModel.position.y += (this.playerModel.position.y - box.min.y);
                this.playerModel.position.z += (this.playerModel.position.z - center.z);
                
                // Usa un container per spostare il player
                this.playerContainer = new THREE.Group();
                this.playerContainer.add(this.playerModel);
                
                if (this.scene) {
                    this.scene.add(this.playerContainer);
                }

                // Applica la posizione se il livello è già caricato
                this.updatePlayerTransform();

                console.log("Wheelchair GLB caricato correttamente");
            },
            undefined,
            (error) => {
                console.error("Errore reale caricamento wheelchair.glb:", error);
            }
        );
    },

    onWindowResize: function() {
        if(!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    onMouseClick: function(event) {
        if (!this.isGameActive || UIManager.isModalOpen()) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            let obj = intersects[0].object;
            // Risale se è in un gruppo
            while(obj && !obj.userData.isTarget && obj.parent) {
                obj = obj.parent;
            }
            if (obj && obj.userData.isTarget) {
                GameFlow.triggerQuestion();
            }
        }
    },

    loadLevel: function(levelData) {
        this.clearScene();
        const setup = levelData.buildScene(this.scene);
        this.currentSceneObjects.push(setup.group);
        
        if(setup.target) {
            this.interactiveObjects.push(setup.target);
        }

        this.camera.position.copy(setup.cameraPos);
        this.camera.lookAt(setup.lookAt);
        
        // Calcola dove posizionare il player in base a telecamera e target
        const dirXZ = new THREE.Vector3(setup.lookAt.x - setup.cameraPos.x, 0, setup.lookAt.z - setup.cameraPos.z).normalize();
        this.currentPlayerPos.set(setup.lookAt.x, 0.02, setup.lookAt.z); // y=0.02 per poggiare bene a terra senza compenetrare
        this.currentPlayerPos.addScaledVector(dirXZ, -4.0); // Distanza bilanciata per non far compenetrare il modello più grande col muro
        this.currentPlayerLookAt.set(setup.lookAt.x, 0.02, setup.lookAt.z);
        
        this.isGameActive = true;
        this.updatePlayerTransform();
    },

    updatePlayerTransform: function() {
        if (this.playerContainer && this.isGameActive) {
            if (this.playerContainer.parent !== this.scene) {
                this.scene.add(this.playerContainer);
            }
            this.playerContainer.position.copy(this.currentPlayerPos);
            this.playerContainer.lookAt(this.currentPlayerLookAt);
        }
    },

    clearScene: function() {
        this.currentSceneObjects.forEach(obj => {
            this.scene.remove(obj);
        });
        this.currentSceneObjects = [];
        this.interactiveObjects = [];
    },

    animate: function() {
        requestAnimationFrame(() => this.animate());
        
        // Semplice animazione per i target per farli notare
        if (this.isGameActive) {
            const time = Date.now() * 0.003;
            this.interactiveObjects.forEach(obj => {
                if(obj.material && obj.material.opacity !== undefined) {
                    obj.material.opacity = 0.2 + Math.sin(time) * 0.1;
                }
            });

            if (this.playerContainer && this.playerContainer.parent !== this.scene) {
                this.scene.add(this.playerContainer);
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
};

// --- UI & GAME FLOW ---
const UIManager = {
    screens: {
        main: document.getElementById('main-menu'),
        levels: document.getElementById('level-menu'),
        game: document.getElementById('game-ui'),
        end: document.getElementById('end-screen')
    },
    modals: {
        question: document.getElementById('question-modal'),
        feedback: document.getElementById('feedback-modal')
    },
    
    showScreen: function(screenName) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    },

    updateMenuStats: function() {
        document.getElementById('menu-score').innerText = SaveManager.data.score;
        document.getElementById('menu-highscore').innerText = SaveManager.data.highScore;
        
        const btnContinue = document.getElementById('btn-continue');
        if (SaveManager.data.score > 0 || SaveManager.data.currentLevel > 1) {
            btnContinue.style.display = 'block';
        } else {
            btnContinue.style.display = 'none';
        }
    },

    populateLevelMenu: function() {
        const list = document.getElementById('level-list');
        list.innerHTML = '';
        LEVELS.forEach(l => {
            const btn = document.createElement('button');
            btn.innerText = `Livello ${l.id}: ${l.title}`;
            if (l.id > SaveManager.data.unlockedLevels) {
                btn.disabled = true;
                btn.innerText += " (Bloccato)";
            } else {
                btn.onclick = () => GameFlow.startLevel(l.id);
            }
            list.appendChild(btn);
        });
    },

    showQuestion: function(levelData) {
        document.getElementById('question-text').innerText = levelData.question;
        const container = document.getElementById('answers-container');
        container.innerHTML = '';
        
        levelData.answers.forEach((ans, index) => {
            const btn = document.createElement('button');
            btn.innerText = ans;
            btn.onclick = () => GameFlow.checkAnswer(index);
            container.appendChild(btn);
        });
        
        this.modals.question.classList.remove('hidden');
    },

    hideQuestion: function() {
        this.modals.question.classList.add('hidden');
    },

    showFeedback: function(title, text, callback) {
        document.getElementById('feedback-title').innerText = title;
        document.getElementById('feedback-text').innerText = text;
        const btn = document.getElementById('btn-feedback-ok');
        btn.onclick = () => {
            this.modals.feedback.classList.add('hidden');
            if(callback) callback();
        };
        this.modals.feedback.classList.remove('hidden');
    },

    isModalOpen: function() {
        return !this.modals.question.classList.contains('hidden') || 
               !this.modals.feedback.classList.contains('hidden');
    },
    
    updateGameUI: function(levelId) {
        document.getElementById('game-level-name').innerText = `Livello ${levelId}`;
        document.getElementById('game-score').innerText = SaveManager.data.score;
    }
};

const GameFlow = {
    currentLevelData: null,

    init: function() {
        SaveManager.load();
        Engine.init();
        
        // Event Listeners Buttons
        document.getElementById('btn-new-game').onclick = () => {
            SaveManager.reset();
            this.startLevel(1);
        };
        
        document.getElementById('btn-continue').onclick = () => {
            this.startLevel(SaveManager.data.currentLevel > LEVELS.length ? LEVELS.length : SaveManager.data.currentLevel);
        };
        
        document.getElementById('btn-level-menu').onclick = () => {
            UIManager.populateLevelMenu();
            UIManager.showScreen('levels');
        };
        
        document.getElementById('btn-back-main').onclick = () => {
            UIManager.updateMenuStats();
            UIManager.showScreen('main');
        };
        
        document.getElementById('btn-reset').onclick = () => {
            if(confirm("Vuoi davvero cancellare i progressi? Il record verrà mantenuto.")) {
                SaveManager.reset();
                UIManager.updateMenuStats();
            }
        };
        
        document.getElementById('btn-exit-game').onclick = () => {
            Engine.isGameActive = false;
            Engine.clearScene();
            UIManager.updateMenuStats();
            UIManager.showScreen('main');
        };

        document.getElementById('btn-end-home').onclick = () => {
            UIManager.updateMenuStats();
            UIManager.showScreen('main');
        };

        UIManager.updateMenuStats();
        UIManager.showScreen('main');
    },

    startLevel: function(id) {
        const level = LEVELS.find(l => l.id === id);
        if(!level) return;
        
        this.currentLevelData = level;
        SaveManager.data.currentLevel = id;
        SaveManager.save();
        
        UIManager.updateGameUI(id);
        UIManager.showScreen('game');
        Engine.loadLevel(level);
    },

    triggerQuestion: function() {
        UIManager.showQuestion(this.currentLevelData);
    },

    checkAnswer: function(index) {
        UIManager.hideQuestion();
        
        if (index === this.currentLevelData.correct) {
            // Success
            SaveManager.addScore(100);
            UIManager.updateGameUI(this.currentLevelData.id);
            
            UIManager.showFeedback("Risposta Esatta!", this.currentLevelData.successMsg, () => {
                this.completeLevel();
            });
        } else {
            // Error
            // L'MVP dice: "errore: 0 punti e gag comica"
            UIManager.showFeedback("Sbagliato!", this.currentLevelData.gag);
        }
    },
    
    completeLevel: function() {
        SaveManager.unlockNext(); // Aggiunge bonus 200 punti e salva
        
        if (this.currentLevelData.id >= LEVELS.length) {
            // Fine del gioco
            Engine.isGameActive = false;
            Engine.clearScene();
            document.getElementById('end-score').innerText = SaveManager.data.score;
            UIManager.showScreen('end');
        } else {
            // Prossimo livello
            this.startLevel(this.currentLevelData.id + 1);
        }
    }
};

// Start
window.onload = () => GameFlow.init();
