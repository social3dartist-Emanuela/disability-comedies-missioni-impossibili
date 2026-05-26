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
            const floorMat = new THREE.MeshLambertMaterial({color: 0x555555}); // Grigio scuro per contrasto
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.rotation.x = -Math.PI / 2;
            group.add(floor);

            // Parete principale dell'edificio
            const wallGeo = new THREE.BoxGeometry(15, 15, 1);
            const wallMat = new THREE.MeshLambertMaterial({color: 0x8aa1a6}); // Azzurro/grigio ospedale
            const wall = new THREE.Mesh(wallGeo, wallMat);
            wall.position.set(0, 7.5, -5.5);
            group.add(wall);

            // Cornice dell'ascensore (Scocca metallica scura)
            const frameMat = new THREE.MeshLambertMaterial({color: 0x333333});
            const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8.5, 0.5), frameMat);
            fLeft.position.set(-2.25, 4.25, -5.0);
            group.add(fLeft);
            const fRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8.5, 0.5), frameMat);
            fRight.position.set(2.25, 4.25, -5.0);
            group.add(fRight);
            const fTop = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 0.5), frameMat);
            fTop.position.set(0, 8.25, -5.0);
            group.add(fTop);

            // Porte a due ante (in metallo chiaro, con piccolo gap centrale per mostrare il blocco)
            const doorMat = new THREE.MeshLambertMaterial({color: 0xc4cace});
            const doorLeft = new THREE.Mesh(new THREE.BoxGeometry(1.95, 8, 0.2), doorMat);
            doorLeft.position.set(-1.05, 4, -5.1);
            group.add(doorLeft);
            const doorRight = new THREE.Mesh(new THREE.BoxGeometry(1.95, 8, 0.2), doorMat);
            doorRight.position.set(1.05, 4, -5.1);
            group.add(doorRight);

            // Pulsantiera laterale
            const panel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 0.2), new THREE.MeshLambertMaterial({color: 0x222222}));
            panel.position.set(3, 4.5, -5.3);
            group.add(panel);
            // Pulsante guasto (luce rossa)
            const btn = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({color: 0xff0000}));
            btn.position.set(3, 4.5, -5.15);
            group.add(btn);

            // Indicatore di piano (Display rosso rotto sopra le porte)
            const indGeo = new THREE.BoxGeometry(1.5, 0.4, 0.1);
            const indMat = new THREE.MeshBasicMaterial({color: 0xff0000}); 
            const indicator = new THREE.Mesh(indGeo, indMat);
            indicator.position.set(0, 7.8, -4.8);
            group.add(indicator);

            // Nastri di segnalazione (Barriera a X davanti le porte)
            const tapeMat = new THREE.MeshBasicMaterial({color: 0xff3300}); // Arancio/rosso molto visibile
            const tape1 = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 0.3), tapeMat);
            tape1.position.set(0, 4.5, -4.9);
            tape1.rotation.z = Math.PI / 6;
            group.add(tape1);
            const tape2 = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 0.3), tapeMat);
            tape2.position.set(0, 4.5, -4.89); // Leggermente sfalsato in Z per evitare z-fighting
            tape2.rotation.z = -Math.PI / 6;
            group.add(tape2);

            // Cartello testo dinamico "FUORI SERVIZIO"
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffcc00'; ctx.fillRect(0,0,512,256); // Fondo giallo scuolabus
            ctx.strokeStyle = '#000000'; ctx.lineWidth = 20; ctx.strokeRect(0,0,512,256); // Bordo nero
            ctx.fillStyle = '#000000'; 
            ctx.font = 'bold 70px "Segoe UI", Arial, sans-serif'; 
            ctx.textAlign = 'center'; ctx.textBaseline='middle';
            ctx.fillText('FUORI', 256, 90); 
            ctx.fillText('SERVIZIO', 256, 175);
            
            const tex = new THREE.CanvasTexture(canvas);
            const signMat = new THREE.MeshLambertMaterial({map: tex});
            const sign = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 0.1), signMat);
            sign.position.set(0, 2.8, -4.7); // Appeso al centro delle porte
            sign.rotation.x = -Math.PI / 16; // Inclinato verso l'alto per leggerlo meglio dalla camera
            sign.userData = { isTarget: true }; // Mantiene l'interattività per il click
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
            
            // Pavimento a piastrelle (Generato con Canvas)
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0,0,256,256); // Fondo chiaro
            ctx.fillStyle = '#81c784'; // Piastrelle verde acqua
            ctx.fillRect(0,0,128,128);
            ctx.fillRect(128,128,128,128);
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(6, 6);
            const floorMat = new THREE.MeshLambertMaterial({map: tex});
            const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorMat);
            floor.rotation.x = -Math.PI / 2;
            group.add(floor);

            // Muri (Bianco/Piastrella)
            const wallMat = new THREE.MeshLambertMaterial({color: 0xfdfdfd});
            
            // Muro di fondo
            const wallBack = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 0.4), wallMat);
            wallBack.position.set(-2, 3, -4.2);
            group.add(wallBack);
            
            // Muro laterale sinistro
            const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 8), wallMat);
            wallLeft.position.set(-6.2, 3, -0.4);
            group.add(wallLeft);
            
            // Muro divisorio frontale (crea la porta stretta)
            const partLeft = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6, 0.4), wallMat);
            partLeft.position.set(-3.75, 3, 1.2);
            group.add(partLeft);
            
            const partRight = new THREE.Mesh(new THREE.BoxGeometry(1.5, 6, 0.4), wallMat);
            partRight.position.set(1.25, 3, 1.2);
            group.add(partRight);

            // Cornice della porta per far capire bene l'ingresso
            const frameMat = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
            const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.45), frameMat);
            frameTop.position.set(-0.5, 5.9, 1.2);
            group.add(frameTop);
            const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 0.45), frameMat);
            frameLeft.position.set(-1.6, 3, 1.2);
            group.add(frameLeft);
            const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 0.45), frameMat);
            frameRight.position.set(0.6, 3, 1.2);
            group.add(frameRight);
            
            // Porta di legno (montata su cerniera per non coprire la visuale centrale)
            const doorGroup = new THREE.Group();
            doorGroup.position.set(-1.5, 0, 1.2); // Punto di rotazione (cerniera sinistra)
            doorGroup.rotation.y = Math.PI / 2.2; // Aperta verso l'interno quasi a 90 gradi per liberare la visuale
            
            const doorMat = new THREE.MeshLambertMaterial({color: 0xc19a6b});
            const door = new THREE.Mesh(new THREE.BoxGeometry(1.9, 5.8, 0.1), doorMat);
            door.position.set(0.95, 2.9, 0); // Spostata rispetto alla cerniera
            doorGroup.add(door);

            // Maniglia della porta (fondamentale per la riconoscibilità)
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3), new THREE.MeshLambertMaterial({color: 0xffffff}));
            handle.rotation.z = Math.PI / 2;
            handle.position.set(1.7, 2.9, 0.1); 
            doorGroup.add(handle);
            
            group.add(doorGroup);

            // Sanitari: WC
            const toiletBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.8), new THREE.MeshLambertMaterial({color: 0xffffff}));
            toiletBase.position.set(-4.8, 0.7, -3);
            group.add(toiletBase);
            const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.8), new THREE.MeshLambertMaterial({color: 0xeeeeee}));
            toiletTank.position.set(-4.8, 2.2, -3.6);
            group.add(toiletTank);

            // Sanitari: Lavandino
            const sinkPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 1.8), new THREE.MeshLambertMaterial({color: 0xffffff}));
            sinkPedestal.position.set(-2.2, 0.9, -3.5);
            group.add(sinkPedestal);
            const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.2), new THREE.MeshLambertMaterial({color: 0xffffff}));
            sinkBasin.position.set(-2.2, 1.9, -3.2);
            group.add(sinkBasin);
            
            // Specchio
            const mirrorGeo = new THREE.PlaneGeometry(1.2, 1.8);
            const mirrorMat = new THREE.MeshPhongMaterial({color: 0x99ccff, shininess: 100});
            const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
            mirror.position.set(-2.2, 3.5, -3.98);
            group.add(mirror);

            // Ostacolo (Cestino che blocca ulteriormente il poco spazio di manovra)
            const trashGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.2);
            const trashMat = new THREE.MeshLambertMaterial({color: 0x333333});
            const trash = new THREE.Mesh(trashGeo, trashMat);
            trash.position.set(-3.5, 0.6, -1);
            group.add(trash);

            // Hotspot interattivo (Area del problema)
            // Un cubo traslucido rosso che evidenzia la porta stretta e l'ostacolo
            const targetGeo = new THREE.BoxGeometry(2.2, 5, 2);
            const targetMat = new THREE.MeshLambertMaterial({color: 0xff3333, transparent: true, opacity: 0.3});
            const target = new THREE.Mesh(targetGeo, targetMat);
            target.position.set(-0.5, 2.5, 0.5); // Posizionato esattamente al centro del varco della porta
            target.userData = { isTarget: true };
            group.add(target);

            scene.add(group);
            return { group, target, cameraPos: new THREE.Vector3(4, 6.5, 8.5), lookAt: new THREE.Vector3(-0.5, 2, -0.5) };
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
        if (!this.isGameActive) return;

        // Filtra i click: reagisce solo se il click è avvenuto fisicamente sul canvas 3D
        // Evita che i click sui bottoni HTML si propaghino e chiudano subito i popup!
        if (event.target.tagName !== 'CANVAS') return;

        // Se c'è un modal aperto, un click sulla scena lo chiude senza rispondere
        if (UIManager.isModalOpen()) {
            UIManager.hideQuestion();
            UIManager.modals.feedback.classList.add('hidden');
            return;
        }

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
            UIManager.hideQuestion(); // Forza chiusura se aperto
            UIManager.modals.feedback.classList.add('hidden');
            UIManager.updateMenuStats();
            UIManager.showScreen('main');
        };

        const btnCloseQuestion = document.getElementById('btn-close-question');
        if (btnCloseQuestion) {
            btnCloseQuestion.onclick = () => {
                UIManager.hideQuestion();
            };
        }

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
