const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const camera = document.getElementById("camera");
let choosen = document.getElementById("chaeyoung");
let mode = "user";
let capturing = false;

function capture(mode) {
    navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                facingMode: mode,
            },
        })
        .then((stream) => {
            camera.srcObject = stream;
        });
}

function stopCamera() {
    camera.srcObject && camera.srcObject.getTracks().forEach((t) => t.stop());
}

function render() {
    const width = canvas.width;
    const height = canvas.height;
    const videoSize = {
        width: camera.offsetWidth,
        height: camera.offsetHeight,
    };
    const ratio = Math.max(width / videoSize.width, height / videoSize.height);

    if (!capturing) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(
            camera,
            0,
            0,
            videoSize.width,
            videoSize.height,
            (width - videoSize.width * ratio) / 2,
            (height - videoSize.height * ratio) / 2,
            videoSize.width * ratio,
            videoSize.height * ratio
        );
        ctx.drawImage(choosen, 0, 0, width, height);
        window.requestAnimationFrame(render);
    }
}

function dataURIToBlob(dataURI) {
    const binStr = atob(dataURI.split(",")[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    return window.URL.createObjectURL(
        new Blob([arr], {
            type: "image/png",
        })
    );
}

render();
capture(mode);
document.getElementById("capture").addEventListener("click", () => {
    const downloadBtn = document.getElementById("download");

    capturing = true;
    camera.pause();
    downloadBtn.href = dataURIToBlob(canvas.toDataURL());
    downloadBtn.download = `You & ${choosen.id}`;
    downloadBtn.click();
    camera.play();
    capturing = false;
    render();
});
document.getElementById("switch").addEventListener("click", () => {
    stopCamera();
    mode = `${mode === "user" ? "environment" : "user"}`;
    capture(mode);
});
[...document.querySelectorAll(".twice")].forEach((twice) => {
    twice.addEventListener("click", (e) => {
        choosen = e.target;
    });
});
