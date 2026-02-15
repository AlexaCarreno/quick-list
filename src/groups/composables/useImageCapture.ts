import { ref } from "vue";

export function useImageCapture(imageRef: { value: string }) {
  const video = ref<HTMLVideoElement | null>(null);
  const canvas = ref<HTMLCanvasElement | null>(null);
  const videoActive = ref(false);

  function openCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoEl = video.value;
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.onloadedmetadata = () => {
            videoEl.play();
            videoActive.value = true;
          };
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera.");
      });
  }

  function captureImage() {
    if (!video.value || !canvas.value) return;

    const context = canvas.value.getContext("2d");
    const width = video.value.videoWidth;
    const height = video.value.videoHeight;

    canvas.value.width = width;
    canvas.value.height = height;
    context?.drawImage(video.value, 0, 0, width, height);

    const base64Image = canvas.value.toDataURL("image/png");
    imageRef.value = base64Image;

    stopCamera();
  }

  function clearImage() {
    imageRef.value = "";
    stopCamera();
  }

  function stopCamera() {
    if (video.value?.srcObject) {
      const stream = video.value.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.value.srcObject = null;
    }
    videoActive.value = false;
  }

  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imageRef.value = reader.result as string;
      videoActive.value = false;
    };
    reader.readAsDataURL(file);
  }

  return {
    video,
    canvas,
    videoActive,
    openCamera,
    captureImage,
    clearImage,
    handleFileUpload,
    stopCamera,
  };
}
