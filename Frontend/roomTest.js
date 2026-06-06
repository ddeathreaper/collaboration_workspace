function setupWhiteboardFeature() {
    // --- Scoped Variables ---
    // These are completely invisible to the outside world now!
    let canvas = null;
    let ctx = null;
    let isDrawing = false;
    let currentTool = 'pencil';
    let brushColor = '#2563eb';
    let brushSize = 5;

    // --- 1. Init Function ---
    function initWhiteboard() {
        canvas = document.getElementById("whiteboard-canvas");
        if (!canvas) return;
        
        ctx = canvas.getContext("2d");

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        setupToolbarListeners();

        // Mouse Events
        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseout", stopDrawing);
    }

    // --- 2. Resize Function ---
    function resizeCanvas() {
        const container = document.getElementById("canvas-container");
        const currentColor = brushColor;
        const currentWidth = brushSize;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth;
    }

    // --- 3. Drawing Core Logic ---
    function startDrawing(e) {
        if (currentTool !== 'pencil') return;
        isDrawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }

    function stopDrawing() {
        if (isDrawing) {
            ctx.closePath();
            isDrawing = false;
        }
    }

    // --- 4. Toolbar Listeners ---
    function setupToolbarListeners() {
        const colorPicker = document.getElementById("color-picker");
        const brushSelect = document.getElementById("brush-size");
        const clearBtn = document.getElementById("tool-clear");
        const pencilBtn = document.getElementById("tool-pencil");

        colorPicker.addEventListener("input", (e) => {
            brushColor = e.target.value;
            ctx.strokeStyle = brushColor;
        });

        brushSelect.addEventListener("change", (e) => {
            brushSize = parseInt(e.target.value);
            ctx.lineWidth = brushSize;
        });

        clearBtn.addEventListener("click", () => {
            if (confirm("Clear the whiteboard?")) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        pencilBtn.addEventListener("click", () => {
            currentTool = 'pencil';
            document.querySelectorAll(".tool-btn").forEach(btn => btn.classList.remove("active"));
            pencilBtn.classList.add("active");
        });
    }

    // Kick everything off immediately when this feature wrapper is called
    initWhiteboard();
}