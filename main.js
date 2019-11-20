const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    camCanvas = document.createElement("canvas"),
    camCtx = camCanvas.getContext("2d"),
    camera = document.getElementById("camera"),
    capture = mode => {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: mode
            }
        }).then(stream => {
            camera.srcObject = stream;
        })
    },
    stop = () => {
        camera.srcObject && camera.srcObject.getTracks().forEach(t => t.stop());
    };

let choosen = document.getElementById("chaeyoung"),
    mode = "user";

function render() {
    const width = canvas.width,
        height = canvas.height,
        videoSize = {
            width: camera.offsetWidth,
            height: camera.offsetHeight
        },
        ratio = Math.max(width / videoSize.width, height / videoSize.height);

    ctx.clearRect(0, 0, width, height),
        ctx.drawImage(camera, 0, 0, videoSize.width, videoSize.height, (width - videoSize.width * ratio) / 2, (height - videoSize.height * ratio) / 2, videoSize.width * ratio, videoSize.height * ratio),
        ctx.drawImage(choosen, 0, 0, width, height),
        window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render),

    capture(mode),

    document.getElementById("capture").addEventListener("click", () => {
        const a = document.getElementById("download");

        a.href = canvas.toDataURL(),
            a.click()
    }),

    document.getElementById("switch").addEventListener("click", () => {
        stop(),
            mode = `${mode === "user" ? "environment" : "user"}`,
            capture(mode)
    }),

    [...document.querySelectorAll(".twice")].forEach(twice => {
        twice.addEventListener("click", e => {
            choosen = e.target
        })
    })
