// --- DATA & CONFIG ---
const CONFIG = {
    USE_EXTERNAL_PLAYER: true // Abilitato per caricare player2.glb
};

// Accessibilità 3D - Disability Comedies Missioni Impossibili
// Cache bust: Fix definitivo hotspot Livello 1 GitHub Pages
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
            
            // Caricamento HDRI asincrono solo per l'environment (non modifica lo sfondo)
            if (typeof THREE.RGBELoader !== 'undefined') {
                new THREE.RGBELoader().load('assets/hdr/canary_wharf_1k.hdr', function(texture) {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    scene.environment = texture;
                }, undefined, function(error) {
                    console.warn("Impossibile caricare assets/hdr/canary_wharf_1k.hdr. Continuo con luce base.");
                });
            }

            // 5. Target interattivo: il gradino (problema di accessibilità)
            // Visibile sopra le strisce, davanti allo scalino, leggermente sollevato
            const targetGeo = new THREE.BoxGeometry(4.0, 0.2, 1.2);
            const targetMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.2});
            const target = new THREE.Mesh(targetGeo, targetMat);
            
            // Valori definitivi recuperati dall'editor
            target.position.set(-2.711456180001685, 1.5, -0.922291236000337);
            target.scale.set(1.25, 1.25, 1.25);
            
            target.userData = { isTarget: true };
            group.add(target);
            
            // Espone il target per il Dev Editor
            window.level1Target = target;
            
            // Evidenziazione visiva del bordo alto del marciapiede per maggior chiarezza
            const edgeGeo = new THREE.BoxGeometry(4.2, 0.05, 0.2);
            const edgeMat = new THREE.MeshBasicMaterial({color: 0xffddaa, transparent: true, opacity: 0.3});
            const edgeHighlight = new THREE.Mesh(edgeGeo, edgeMat);
            edgeHighlight.position.set(0, 0.65, -4.8); // Sollevato a 0.65 per evitare z-fighting col modello GLB
            group.add(edgeHighlight);

            // Scena procedurale di Fallback
            const fallbackGroup = new THREE.Group();

            // 1. Strada asfaltata (Texture procedurale migliorata, più scura e mista)
            const roadCanvas = document.createElement('canvas');
            roadCanvas.width = 512; roadCanvas.height = 512;
            const rCtx = roadCanvas.getContext('2d');
            rCtx.fillStyle = '#1a1a1a'; rCtx.fillRect(0,0,512,512); // Base asfalto scuro
            for(let i=0; i<6000; i++) {
                rCtx.fillStyle = Math.random() > 0.5 ? '#242424' : '#111111';
                rCtx.globalAlpha = Math.random() * 0.5 + 0.2;
                rCtx.fillRect(Math.random()*512, Math.random()*512, 2, 2);
            }
            rCtx.globalAlpha = 1.0;
            const roadTex = new THREE.CanvasTexture(roadCanvas);
            roadTex.wrapS = THREE.RepeatWrapping; roadTex.wrapT = THREE.RepeatWrapping;
            roadTex.repeat.set(20, 20);
            
            const roadMat = new THREE.MeshLambertMaterial({map: roadTex, color: 0x999999});
            const road = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), roadMat);
            road.rotation.x = -Math.PI / 2;
            road.receiveShadow = true;
            fallbackGroup.add(road);

            // 2. Marciapiede (Cordolo definito + Pavimentazione realistica)
            const curbGeo = new THREE.BoxGeometry(60, 1.2, 0.5);
            const curbMat = new THREE.MeshLambertMaterial({color: 0x4a4a4a}); // Cemento scuro
            const curb = new THREE.Mesh(curbGeo, curbMat);
            curb.position.set(0, 0.6, -5.25);
            curb.castShadow = true; curb.receiveShadow = true;
            fallbackGroup.add(curb);

            const paveCanvas = document.createElement('canvas');
            paveCanvas.width = 256; paveCanvas.height = 256;
            const pCtx = paveCanvas.getContext('2d');
            pCtx.fillStyle = '#a0a0a0'; pCtx.fillRect(0,0,256,256); // Base cemento
            // Aggiungiamo un po' di grana al cemento
            for(let i=0; i<2000; i++) {
                pCtx.fillStyle = Math.random() > 0.5 ? '#b0b0b0' : '#909090';
                pCtx.fillRect(Math.random()*256, Math.random()*256, 2, 2);
            }
            pCtx.strokeStyle = '#777777'; pCtx.lineWidth = 3;
            pCtx.strokeRect(0,0,128,128); pCtx.strokeRect(128,128,128,128);
            const paveTex = new THREE.CanvasTexture(paveCanvas);
            paveTex.wrapS = THREE.RepeatWrapping; paveTex.wrapT = THREE.RepeatWrapping;
            paveTex.repeat.set(30, 8);

            const sidewalkGeo = new THREE.BoxGeometry(60, 1.18, 15);
            const sidewalkMat = new THREE.MeshLambertMaterial({map: paveTex});
            const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
            sidewalk.position.set(0, 0.59, -13);
            sidewalk.castShadow = true; sidewalk.receiveShadow = true;
            fallbackGroup.add(sidewalk);

            // 3. Strisce pedonali (Integrate, leggermente usurate e trasparenti)
            for(let i=0; i<7; i++) {
                const stripe = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.6), new THREE.MeshLambertMaterial({color: 0xdddddd, transparent: true, opacity: 0.85}));
                stripe.rotation.x = -Math.PI / 2;
                stripe.position.set(0, 0.02, -4.2 + (i * 1.2));
                stripe.receiveShadow = true;
                fallbackGroup.add(stripe);
            }

            // 4. Elementi Urbani (Palo più spesso, cartello più grande)
            const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.5), new THREE.MeshLambertMaterial({color: 0x777777}));
            signPole.position.set(4.5, 2.25, -5.8);
            signPole.castShadow = true;
            fallbackGroup.add(signPole);
            
            const signCanvas = document.createElement('canvas');
            signCanvas.width = 256; signCanvas.height = 256;
            const sCtx = signCanvas.getContext('2d');
            sCtx.fillStyle = '#0055a4'; sCtx.fillRect(0,0,256,256); // Sfondo blu
            sCtx.fillStyle = '#ffffff'; 
            sCtx.beginPath(); sCtx.moveTo(128, 20); sCtx.lineTo(236, 236); sCtx.lineTo(20, 236); sCtx.fill(); // Triangolo bianco
            sCtx.fillStyle = '#000000';
            sCtx.fillRect(110, 110, 20, 60); // Corpo
            sCtx.beginPath(); sCtx.arc(120, 80, 16, 0, Math.PI*2); sCtx.fill(); // Testa
            for(let i=0; i<3; i++) {
                sCtx.fillRect(60 + i*50, 190, 36, 16); // Strisce pedonali interne
            }
            const signTex = new THREE.CanvasTexture(signCanvas);
            const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.1), new THREE.MeshLambertMaterial({map: signTex}));
            signBoard.position.set(4.5, 4.2, -5.8);
            signBoard.castShadow = true;
            fallbackGroup.add(signBoard);
            
            // Cestino urbano sul marciapiede per aggiungere realismo
            const trashGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.4);
            const trashMat = new THREE.MeshLambertMaterial({color: 0x2f4f4f}); // Grigio/Verde scuro
            const trash = new THREE.Mesh(trashGeo, trashMat);
            trash.position.set(-4, 1.9, -6.5);
            trash.castShadow = true; trash.receiveShadow = true;
            fallbackGroup.add(trash);

            group.add(fallbackGroup);

            // Caricamento asincrono del modello GLB Urbano Principale
            if (typeof THREE.GLTFLoader !== 'undefined') {
                const loader = new THREE.GLTFLoader();
                loader.load('assets/models/livello1_urban_scene.glb', function(gltf) {
                    // Rimuovi la scena procedurale di fallback se il caricamento ha successo
                    group.remove(fallbackGroup);

                    const urbanScene = gltf.scene;
                    
                    // Abilitiamo le ombre per tutti i nodi del modello caricato
                    urbanScene.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });

                    // Aggiungiamo il modello caricato alla scena del livello
                    group.add(urbanScene);

                }, undefined, function(error) {
                    console.warn("Impossibile caricare assets/models/livello1_urban_scene.glb. Uso la scena procedurale di fallback.");
                });
            }

            scene.add(group);
            return { group, target, cameraPos: new THREE.Vector3(5, 5, 5), lookAt: new THREE.Vector3(0, 0.5, -5) };
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
            
            // --- ILLUMINAZIONE D'INTERNI ---
            const ambientLight = new THREE.AmbientLight(0xfff0e0, 0.4); // Luce calda diffusa
            group.add(ambientLight);
            
            const corridorLight = new THREE.PointLight(0xfffaee, 0.8, 20);
            corridorLight.position.set(0, 7.8, -2);
            corridorLight.castShadow = true;
            corridorLight.shadow.mapSize.width = 1024;
            corridorLight.shadow.mapSize.height = 1024;
            group.add(corridorLight);

            // Plafoniera (luce visibile)
            const lampMat = new THREE.MeshBasicMaterial({color: 0xffffff});
            const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16), lampMat);
            lamp.position.set(0, 7.95, -2);
            group.add(lamp);

            // --- MATERIALI AVANZATI PROCEDURALI ---
            // 1. Pavimento Gres Porcellanato
            const floorCanvas = document.createElement('canvas');
            floorCanvas.width = 512; floorCanvas.height = 512;
            const fCtx = floorCanvas.getContext('2d');
            fCtx.fillStyle = '#cfd4d8'; fCtx.fillRect(0,0,512,512);
            fCtx.fillStyle = '#c5cbd0';
            for(let i=0; i<3000; i++) {
                fCtx.globalAlpha = Math.random() * 0.3;
                fCtx.fillRect(Math.random()*512, Math.random()*512, 3, 3);
            }
            fCtx.globalAlpha = 1.0;
            fCtx.strokeStyle = '#aab2b8'; fCtx.lineWidth = 2;
            for(let i=0; i<=512; i+=128) {
                fCtx.beginPath(); fCtx.moveTo(i,0); fCtx.lineTo(i,512); fCtx.stroke();
                fCtx.beginPath(); fCtx.moveTo(0,i); fCtx.lineTo(512,i); fCtx.stroke();
            }
            const floorTex = new THREE.CanvasTexture(floorCanvas);
            floorTex.wrapS = THREE.RepeatWrapping; floorTex.wrapT = THREE.RepeatWrapping;
            floorTex.repeat.set(6, 6);
            
            const floorMat = new THREE.MeshStandardMaterial({map: floorTex, roughness: 0.15, metalness: 0.1});
            const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMat);
            floor.rotation.x = -Math.PI / 2;
            floor.receiveShadow = true;
            group.add(floor);

            // 2. Pareti con texture intonaco
            const wallCanvas = document.createElement('canvas');
            wallCanvas.width = 256; wallCanvas.height = 256;
            const wCtx = wallCanvas.getContext('2d');
            wCtx.fillStyle = '#f4f6f7'; wCtx.fillRect(0,0,256,256);
            wCtx.fillStyle = '#e8ecef';
            for(let i=0; i<5000; i++) {
                wCtx.globalAlpha = Math.random() * 0.2;
                wCtx.fillRect(Math.random()*256, Math.random()*256, 2, 2);
            }
            const wallTex = new THREE.CanvasTexture(wallCanvas);
            wallTex.wrapS = THREE.RepeatWrapping; wallTex.wrapT = THREE.RepeatWrapping;
            wallTex.repeat.set(10, 5);
            
            const wallMat = new THREE.MeshStandardMaterial({map: wallTex, roughness: 0.95});

            // --- ARCHITETTURA (ATRIO) ---
            // Parete di fondo
            const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 15, 1), wallMat);
            backWall.position.set(0, 7.5, -6.0);
            backWall.receiveShadow = true;
            group.add(backWall);
            // Parete sinistra
            const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 20), wallMat);
            leftWall.position.set(-8, 7.5, 0);
            leftWall.receiveShadow = true;
            group.add(leftWall);
            // Parete destra
            const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 20), wallMat);
            rightWall.position.set(8, 7.5, 0);
            rightWall.receiveShadow = true;
            group.add(rightWall);
            // Soffitto
            const ceilMat = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 1.0});
            const ceiling = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 20), ceilMat);
            ceiling.position.set(0, 8.5, 0);
            group.add(ceiling);

            // Battiscopa
            const baseboardMat = new THREE.MeshStandardMaterial({color: 0x3a4045, roughness: 0.8});
            const baseBack = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 0.2), baseboardMat);
            baseBack.position.set(0, 0.25, -5.4);
            group.add(baseBack);
            const baseLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 20), baseboardMat);
            baseLeft.position.set(-7.4, 0.25, 0);
            group.add(baseLeft);
            const baseRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 20), baseboardMat);
            baseRight.position.set(7.4, 0.25, 0);
            group.add(baseRight);

            // --- ASCENSORE ---
            // Cornice sporgente (effetto nicchia)
            const frameMat = new THREE.MeshStandardMaterial({color: 0x5a5f64, metalness: 0.5, roughness: 0.4});
            const fLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8.0, 0.8), frameMat);
            fLeft.position.set(-2.8, 4.0, -5.3);
            fLeft.castShadow = true; fLeft.receiveShadow = true;
            group.add(fLeft);
            const fRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8.0, 0.8), frameMat);
            fRight.position.set(2.8, 4.0, -5.3);
            fRight.castShadow = true; fRight.receiveShadow = true;
            group.add(fRight);
            const fTop = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.5, 0.8), frameMat);
            fTop.position.set(0, 8.0, -5.3);
            fTop.castShadow = true; fTop.receiveShadow = true;
            group.add(fTop);

            // Porte metalliche arretrate (Acciaio spazzolato)
            const doorCanvas = document.createElement('canvas');
            doorCanvas.width = 256; doorCanvas.height = 256;
            const dCtx = doorCanvas.getContext('2d');
            dCtx.fillStyle = '#9aa0a6'; dCtx.fillRect(0,0,256,256);
            dCtx.fillStyle = '#8a9096';
            for(let i=0; i<1000; i++) {
                dCtx.globalAlpha = Math.random() * 0.1;
                dCtx.fillRect(0, Math.random()*256, 256, 1);
            }
            const doorTex = new THREE.CanvasTexture(doorCanvas);
            const doorMat = new THREE.MeshStandardMaterial({map: doorTex, metalness: 0.7, roughness: 0.3});
            
            const doorLeft = new THREE.Mesh(new THREE.BoxGeometry(2.15, 7.5, 0.2), doorMat);
            doorLeft.position.set(-1.1, 3.75, -5.5);
            doorLeft.receiveShadow = true;
            group.add(doorLeft);
            const doorRight = new THREE.Mesh(new THREE.BoxGeometry(2.15, 7.5, 0.2), doorMat);
            doorRight.position.set(1.1, 3.75, -5.5);
            doorRight.receiveShadow = true;
            group.add(doorRight);
            
            // Fessura centrale
            const gap = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7.5, 0.1), new THREE.MeshBasicMaterial({color: 0x000000}));
            gap.position.set(0, 3.75, -5.45);
            group.add(gap);

            // Pulsantiera a colonna
            const panelMat = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 0.9, roughness: 0.2});
            const panel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.15), panelMat);
            panel.position.set(3.6, 4.5, -5.45);
            group.add(panel);
            // Pulsanti (Su spento, Giù spento)
            const btnUp = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.05), new THREE.MeshStandardMaterial({color: 0x555555}));
            btnUp.position.set(3.6, 4.8, -5.35);
            group.add(btnUp);
            const btnDown = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.05), new THREE.MeshStandardMaterial({color: 0x555555}));
            btnDown.position.set(3.6, 4.5, -5.35);
            group.add(btnDown);

            // Display "ERR" rosso
            const dispCanvas = document.createElement('canvas');
            dispCanvas.width = 256; dispCanvas.height = 64;
            const dsCtx = dispCanvas.getContext('2d');
            dsCtx.fillStyle = '#0a0000'; dsCtx.fillRect(0,0,256,64);
            dsCtx.fillStyle = '#ff0000'; dsCtx.font = 'bold 45px "Courier New", monospace'; dsCtx.textAlign='center'; dsCtx.textBaseline='middle';
            dsCtx.fillText('ERR', 128, 32);
            const dispTex = new THREE.CanvasTexture(dispCanvas);
            
            const displayBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 0.1), new THREE.MeshStandardMaterial({color: 0x111111}));
            displayBox.position.set(0, 8.5, -5.45);
            group.add(displayBox);
            const displayScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.4), new THREE.MeshBasicMaterial({map: dispTex}));
            displayScreen.position.set(0, 8.5, -5.39);
            group.add(displayScreen);

            // --- SEGNALETICA GUASTO ---
            const tapeCanvas = document.createElement('canvas');
            tapeCanvas.width = 512; tapeCanvas.height = 64;
            const tCtx = tapeCanvas.getContext('2d');
            tCtx.fillStyle = '#ffb300'; tCtx.fillRect(0,0,512,64); // Giallo più scuro e realistico
            tCtx.fillStyle = '#111111';
            for(let i=-64; i<512; i+=64) {
                tCtx.beginPath(); tCtx.moveTo(i, 0); tCtx.lineTo(i+32, 0); tCtx.lineTo(i+96, 64); tCtx.lineTo(i+64, 64); tCtx.fill();
            }
            const tapeTex = new THREE.CanvasTexture(tapeCanvas);
            tapeTex.wrapS = THREE.RepeatWrapping; tapeTex.wrapT = THREE.RepeatWrapping;
            tapeTex.repeat.set(5, 1);
            
            const tapeMat = new THREE.MeshStandardMaterial({map: tapeTex, roughness: 0.9});
            const tape1 = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.5), tapeMat);
            tape1.position.set(0, 4.5, -5.3);
            tape1.rotation.z = Math.PI / 8;
            group.add(tape1);
            const tape2 = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.5), tapeMat);
            tape2.position.set(0, 4.5, -5.28);
            tape2.rotation.z = -Math.PI / 8;
            group.add(tape2);

            // Cartello professionale "FUORI SERVIZIO"
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 384;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,512,384);
            ctx.fillStyle = '#d32f2f'; ctx.fillRect(0,0,512,90); // Intestazione
            ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 12; ctx.strokeRect(0,0,512,384);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 50px "Segoe UI", Arial'; ctx.textAlign = 'center'; ctx.textBaseline='middle';
            ctx.fillText('AVVISO', 256, 45);
            ctx.fillStyle = '#212121'; ctx.font = 'bold 75px "Segoe UI", Arial';
            ctx.fillText('FUORI', 256, 170); 
            ctx.fillText('SERVIZIO', 256, 260);
            ctx.fillStyle = '#757575'; ctx.font = 'italic 30px "Segoe UI", Arial';
            ctx.fillText('Ci scusiamo per il disagio', 256, 330);
            
            const tex = new THREE.CanvasTexture(canvas);
            const signMat = new THREE.MeshStandardMaterial({map: tex, roughness: 0.6});
            const sign = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.05), signMat);
            sign.position.set(0, 3.2, -5.1);
            sign.rotation.x = -Math.PI / 32; 
            sign.castShadow = true;
            group.add(sign);

            // --- TARGET INTERATTIVO ---
            const targetGeo = new THREE.BoxGeometry(4.8, 7.8, 0.5);
            const targetMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.2});
            const target = new THREE.Mesh(targetGeo, targetMat);
            target.position.set(0, 4.0, -5.0); 
            target.userData = { isTarget: true };
            group.add(target);

            scene.add(group);
            return { group, target, cameraPos: new THREE.Vector3(0, 5, 8), lookAt: new THREE.Vector3(0, 4, -5) };
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
            
            // --- ILLUMINAZIONE D'INTERNI ---
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            group.add(ambientLight);
            
            const mainLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
            mainLight.position.set(5, 10, 5);
            mainLight.castShadow = true;
            mainLight.shadow.mapSize.width = 1024;
            mainLight.shadow.mapSize.height = 1024;
            group.add(mainLight);

            // --- CARICAMENTO MODELLO BLENDER ---
            if (typeof THREE.GLTFLoader !== 'undefined') {
                const loader = new THREE.GLTFLoader();
                loader.load('assets/models/level3_bathroom.glb', (gltf) => {
                    const model = gltf.scene;
                    
                    // Abilita le ombre per tutte le mesh
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    // Valori definitivi recuperati dall'editor per la versione pubblica
                    model.position.set(-6.100000000000001, -6.399999999999999, -3.3000000000000007);
                    model.rotation.y = -0.470963267949647;
                    model.scale.setScalar(2.7999999999999998);
                    
                    window.level3Model = model;
                    group.add(model);
                    console.log("Modello level3_bathroom.glb caricato con successo");
                }, undefined, (err) => {
                    console.error("Errore nel caricamento del modello level3_bathroom.glb", err);
                });
            }

            // --- HOTSPOT (Elegante e discreto) ---
            const targetGeo = new THREE.BoxGeometry(2.0, 4.8, 2.0);
            const targetMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.2});
            const target = new THREE.Mesh(targetGeo, targetMat);
            target.position.set(-0.5, 2.4, 0.5); // Mantiene le coordinate funzionali intatte
            target.userData = { isTarget: true };
            group.add(target);

            scene.add(group);
            // Telecamera ripristinata in terza persona per mostrare carrozzina e ingresso bagno
            return { group, target, cameraPos: new THREE.Vector3(3.0, 5.0, 7.5), lookAt: new THREE.Vector3(-0.5, 2.0, -1.0) };
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
        this.renderer.shadowMap.enabled = true; // Abilita le ombre
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ombre morbide
        
        // Tone Mapping per HDR
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        
        container.appendChild(this.renderer.domElement);

        // Luci migliorate
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Luce naturale più chiara per schiarire le ombre
        this.scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.9); // Luce solare calda
        dirLight.position.set(15, 25, 15);
        dirLight.castShadow = true;
        // Ottimizzazione mappa ombre
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        dirLight.shadow.bias = -0.0005;
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

                // Abilita le ombre per ogni mesh del modello
                this.playerModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                console.log("Wheelchair GLB caricato correttamente con ombre");
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
        console.log(`[${new Date().toLocaleTimeString()}] CLICK SCHERMO | Active: ${this.isGameActive} | Element: ${event.target.tagName}#${event.target.id}`);
        if (!this.isGameActive) return;

        // Filtra i click: reagisce solo se il click è avvenuto sul canvas o contenitori neutri
        if (event.target.tagName !== 'CANVAS' && event.target.id !== 'canvas-container' && event.target.id !== 'ui-layer') {
            console.log("Click bloccato da elemento HTML sovrastante:", event.target.tagName, event.target.id);
            return;
        }

        // Se c'è un modal aperto, un click sulla scena lo chiude senza rispondere
        if (UIManager.isModalOpen()) {
            UIManager.hideQuestion();
            UIManager.modals.feedback.classList.add('hidden');
            return;
        }

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        console.log("Oggetti interattivi checkati:", this.interactiveObjects.length);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            console.log("RAYCAST HIT:", intersects[0].object.type || "Sconosciuto");
            let obj = intersects[0].object;
            // Risale se è in un gruppo
            while(obj && !obj.userData.isTarget && obj.parent) {
                obj = obj.parent;
            }
            if (obj && obj.userData.isTarget) {
                console.log("HOTSPOT LIVELLO " + SaveManager.data.currentLevel + " CLICCATO");
                GameFlow.triggerQuestion();
            } else {
                console.log("Oggetto colpito NON è target:", obj);
            }
        } else {
            console.log("NESSUN OGGETTO COLPITO DAL RAYCASTER.");
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
        // Resetta l'environment HDRI per i livelli successivi
        if (this.scene) {
            this.scene.environment = null;
        }
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
    lastAnswerWasError: false,

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
                Engine.isGameActive = true;
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
        
        // Assicura che l'Editor DEV L1 non sia visibile in altri livelli
        if (id !== 1 && typeof DevEditor !== 'undefined' && DevEditor.panel) {
            DevEditor.panel.classList.add('hidden');
            DevEditor.panel.style.display = 'none';
            DevEditor.panel.style.pointerEvents = 'none';
            if(typeof DevEditor.hideIndicator === 'function') DevEditor.hideIndicator();
            console.log("EDITOR L1 NASCOSTO FUORI DAL LIVELLO 1");
        }

        // Assicura che l'Editor L3 non sia visibile in altri livelli
        if (id !== 3 && typeof DevEditorL3 !== 'undefined' && DevEditorL3.panel) {
            DevEditorL3.panel.classList.add('hidden');
            DevEditorL3.panel.style.display = 'none';
            DevEditorL3.panel.style.pointerEvents = 'none';
        }
        
        Engine.loadLevel(level);
    },

    triggerQuestion: function() {
        if (!Engine.isGameActive) return; // Evita doppie aperture
        
        if (this.lastAnswerWasError) {
            console.log("DOMANDA RIAPERTA DOPO ERRORE");
            this.lastAnswerWasError = false;
        } else {
            console.log("DOMANDA LIVELLO " + SaveManager.data.currentLevel + " APERTA");
        }
        
        Engine.isGameActive = false;
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
            console.log("RISPOSTA SBAGLIATA - HOTSPOT ANCORA ATTIVO");
            this.lastAnswerWasError = true;
            UIManager.showFeedback("Sbagliato!", this.currentLevelData.gag, () => {
                Engine.isGameActive = true; // Riattiva il raycaster
            });
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

// --- DEV EDITOR (SOLO LIVELLO 1 - HOTSPOT) ---
const DevEditor = {
    panel: document.getElementById('dev-editor'),
    indicator: null,
    
    init: function() {
        console.log("EDITOR HOTSPOT L1 DISATTIVATO");
        if(!this.panel) return;
        
        // Listener globale per tasto E
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'e') {
                if (Engine.isGameActive && SaveManager.data.currentLevel === 1) {
                    this.togglePanel();
                }
            }
        });

        const addBtnListener = (id, logMsg, action) => {
            const btn = document.getElementById(id);
            if(btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log(logMsg);
                    action();
                });
            }
        };

        addBtnListener('ed-btn-close', "EDITOR CHIUSO", () => this.togglePanel());
        addBtnListener('ed-btn-save', "Editor: Salvataggio", () => this.save());
        addBtnListener('ed-btn-reset', "Editor: Reset", () => this.reset());
        addBtnListener('ed-btn-snap', "Editor: Snap al player", () => this.snapToWheelchair());

        // Controlli movimento
        const getStep = () => parseFloat(document.getElementById('ed-step-select').value) || 0.1;
        const scaleStep = 0.25;
        
        addBtnListener('ed-btn-up', "Editor: Su", () => { const s = getStep(); this.moveTarget(0, s, 0); });
        addBtnListener('ed-btn-down', "Editor: Giù", () => { const s = getStep(); this.moveTarget(0, -s, 0); });
        addBtnListener('ed-btn-fwd', "Editor: Avanti", () => { const s = getStep(); this.moveTarget(0, 0, -s); });
        addBtnListener('ed-btn-bwd', "Editor: Indietro", () => { const s = getStep(); this.moveTarget(0, 0, s); });
        addBtnListener('ed-btn-left', "Editor: Sinistra", () => { const s = getStep(); this.moveTarget(-s, 0, 0); });
        addBtnListener('ed-btn-right', "Editor: Destra", () => { const s = getStep(); this.moveTarget(s, 0, 0); });
        
        addBtnListener('ed-btn-scale-plus', "Editor: Zoom+", () => this.scaleTarget(scaleStep));
        addBtnListener('ed-btn-scale-minus', "Editor: Zoom-", () => this.scaleTarget(-scaleStep));
    },

    togglePanel: function() {
        if (this.panel.classList.contains('hidden')) {
            // Apri
            this.panel.classList.remove('hidden');
            this.panel.style.display = 'block';
            this.panel.style.pointerEvents = 'auto';
            this.showIndicator();
            this.updateCoordsText();
        } else {
            // Chiudi
            this.panel.classList.add('hidden');
            this.panel.style.display = 'none';
            this.panel.style.pointerEvents = 'none';
            this.hideIndicator();
        }
    },
    
    showIndicator: function() {
        if (!this.indicator && Engine.scene) {
            this.indicator = new THREE.Group();
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.5), // Sfera più grande
                new THREE.MeshBasicMaterial({color: 0xff0000, depthTest: false, depthWrite: false}) // Sempre in primo piano
            );
            sphere.position.y = 2.0;
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(1.5, 0.1, 16, 32), // Anello più grande e spesso
                new THREE.MeshBasicMaterial({color: 0xff0000, depthTest: false, depthWrite: false}) // Sempre in primo piano
            );
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = 0.05;
            this.indicator.add(sphere);
            this.indicator.add(ring);
            this.indicator.renderOrder = 999;
            Engine.scene.add(this.indicator);
        }
        
        if (this.indicator) this.indicator.visible = true;
        
        // Rendi l'hotspot più opaco mentre l'editor è aperto
        if (window.level1Target) {
            window.level1Target.material.opacity = 0.8;
        }
    },
    
    hideIndicator: function() {
        if (this.indicator && Engine.scene) {
            Engine.scene.remove(this.indicator);
            // Distruzione vigorosa per forzare rimozione
            this.indicator.children.forEach(c => {
                if(c.geometry) c.geometry.dispose();
                if(c.material) c.material.dispose();
            });
            this.indicator = null;
        }
        // Ripristina l'opacità originale fissa dell'hotspot (0.35) quando l'editor è chiuso
        if (window.level1Target) {
            window.level1Target.material.opacity = 0.35;
        }
    },

    updateCoordsText: function() {
        if (!window.level1Target) return;
        const t = window.level1Target;
        const text = `X: ${t.position.x.toFixed(2)} | Y: ${t.position.y.toFixed(2)} | Z: ${t.position.z.toFixed(2)} | Scala: ${t.scale.x.toFixed(2)}`;
        document.getElementById('ed-coords').innerText = text;
        
        if (this.indicator) {
            this.indicator.position.copy(t.position);
        }
    },

    snapToWheelchair: function() {
        if (!window.level1Target || !Engine.playerContainer) return;
        
        // Assicura l'opacità visibile (nel caso fosse chiusa/buggata)
        window.level1Target.material.opacity = 0.8;
        
        const pPos = Engine.playerContainer.position;
        // Solleva dal terreno a Y=0.5 e mettilo a -2.5 di fronte (Z)
        window.level1Target.position.set(pPos.x, 0.5, pPos.z - 2.5);
        this.updateCoordsText();
    },

    moveTarget: function(dx, dy, dz) {
        if (!window.level1Target) return;
        window.level1Target.position.x += dx;
        window.level1Target.position.y += dy;
        window.level1Target.position.z += dz;
        this.updateCoordsText();
    },

    scaleTarget: function(ds) {
        if (!window.level1Target) return;
        window.level1Target.scale.addScalar(ds);
        this.updateCoordsText();
    },

    save: function() {
        if (!window.level1Target) return;
        const t = window.level1Target;
        const data = {
            pos: [t.position.x, t.position.y, t.position.z],
            scale: [t.scale.x, t.scale.y, t.scale.z]
        };
        localStorage.setItem('editorSettings_level1_hotspot', JSON.stringify(data));
        alert("Hotspot salvato.");
    },

    reset: function() {
        localStorage.removeItem('editorSettings_level1_hotspot');
        alert("Reset effettuato.");
        this.panel.classList.add('hidden');
        GameFlow.startLevel(1);
    }
};

// Inizializza l'editor all'avvio
document.addEventListener('DOMContentLoaded', () => {
    DevEditor.init();
    DevEditorL3.init();
});

// --- DEV EDITOR BAGNO (SOLO LIVELLO 3) ---
const DevEditorL3 = {
    panel: document.getElementById('dev-editor-l3'),
    
    init: function() {
        console.log("EDITOR BAGNO L3 DISATTIVATO");
        console.log("LIVELLO 3 FUNZIONANTE");
        if(this.panel) {
            this.panel.classList.add('hidden');
            this.panel.style.display = 'none';
            this.panel.style.pointerEvents = 'none';
        }
        return; // Disattiva tutti i listener e nasconde l'editor
        
        // Listener globale per tasto E
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'e') {
                if (Engine.isGameActive && SaveManager.data.currentLevel === 3) {
                    this.togglePanel();
                }
            }
        });

        const addBtnListener = (id, logMsg, action) => {
            const btn = document.getElementById(id);
            if(btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log(logMsg);
                    action();
                });
            }
        };

        addBtnListener('ed3-btn-close', "EDITOR BAGNO L3 CHIUSO", () => this.togglePanel());
        addBtnListener('ed3-btn-save', "BAGNO L3 SALVATO", () => this.save());
        addBtnListener('ed3-btn-reset', "Editor L3: Reset", () => this.reset());

        const getStep = () => parseFloat(document.getElementById('ed3-step-select').value) || 0.1;
        
        addBtnListener('ed3-btn-up', "BAGNO L3 SPOSTATO", () => { const s = getStep(); this.moveModel(0, s, 0); });
        addBtnListener('ed3-btn-down', "BAGNO L3 SPOSTATO", () => { const s = getStep(); this.moveModel(0, -s, 0); });
        addBtnListener('ed3-btn-fwd', "BAGNO L3 SPOSTATO", () => { const s = getStep(); this.moveModel(0, 0, -s); });
        addBtnListener('ed3-btn-bwd', "BAGNO L3 SPOSTATO", () => { const s = getStep(); this.moveModel(0, 0, s); });
        addBtnListener('ed3-btn-left', "BAGNO L3 SPOSTATO", () => { const s = getStep(); this.moveModel(-s, 0, 0); });
        addBtnListener('ed3-btn-right', "BAGNO L3 SPOSTATO", () => { const s = getStep(); this.moveModel(s, 0, 0); });
        
        addBtnListener('ed3-btn-rot-left', "BAGNO L3 RUOTATO", () => { const s = getStep(); this.rotateModel(-s); });
        addBtnListener('ed3-btn-rot-right', "BAGNO L3 RUOTATO", () => { const s = getStep(); this.rotateModel(s); });
        
        addBtnListener('ed3-btn-scale-plus', "BAGNO L3 SCALATO", () => { const s = getStep(); this.scaleModel(s); });
        addBtnListener('ed3-btn-scale-minus', "BAGNO L3 SCALATO", () => { const s = getStep(); this.scaleModel(-s); });
    },

    togglePanel: function() {
        if (this.panel.classList.contains('hidden')) {
            this.panel.classList.remove('hidden');
            this.panel.style.display = 'block';
            this.panel.style.pointerEvents = 'auto';
            this.updateCoordsText();
            console.log("EDITOR BAGNO L3 APERTO");
        } else {
            this.panel.classList.add('hidden');
            this.panel.style.display = 'none';
            this.panel.style.pointerEvents = 'none';
        }
    },
    
    updateCoordsText: function() {
        if (!window.level3Model) return;
        const m = window.level3Model;
        const text = `X: ${m.position.x.toFixed(2)} | Y: ${m.position.y.toFixed(2)} | Z: ${m.position.z.toFixed(2)} | R: ${m.rotation.y.toFixed(2)} | S: ${m.scale.x.toFixed(2)}`;
        document.getElementById('ed3-coords').innerText = text;
    },

    moveModel: function(dx, dy, dz) {
        if (!window.level3Model) return;
        window.level3Model.position.x += dx;
        window.level3Model.position.y += dy;
        window.level3Model.position.z += dz;
        this.updateCoordsText();
    },
    
    rotateModel: function(dr) {
        if (!window.level3Model) return;
        window.level3Model.rotation.y += dr;
        this.updateCoordsText();
    },

    scaleModel: function(ds) {
        if (!window.level3Model) return;
        const newScale = window.level3Model.scale.x + ds;
        if (newScale > 0) {
            window.level3Model.scale.setScalar(newScale);
        }
        this.updateCoordsText();
    },

    save: function() {
        if (!window.level3Model) return;
        const m = window.level3Model;
        const data = {
            pos: [m.position.x, m.position.y, m.position.z],
            rotY: m.rotation.y,
            scale: m.scale.x
        };
        localStorage.setItem('editorSettings_level3_bathroom', JSON.stringify(data));
        alert("Bagno L3 salvato.");
    },

    reset: function() {
        localStorage.removeItem('editorSettings_level3_bathroom');
        alert("Reset effettuato.");
        this.panel.classList.add('hidden');
        GameFlow.startLevel(3);
    }
};
