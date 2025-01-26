
document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    }

    var name = document.getElementById("nameSearch").value.toUpperCase();
    var photoInput = document.getElementById("photo");
    var photoFile = photoInput.files[0];
    var bgColor = document.querySelector('input[name="bgColor"]:checked').value;
    var selectedBorder = document.getElementById("borderSelection").value;

    if (!photoFile) {
      alert("Silakan unggah foto terlebih dahulu.");
      return;
    }

    var canvas = document.getElementById("avatarCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 1100;
    canvas.height = 1100;

    var reader = new FileReader();
    reader.onload = async function (event) {
      var photoDataURL = event.target.result;

      try {
        const photoImg = await loadImage(photoDataURL);
        const borderImg = await loadImage(`image/${selectedBorder}`);

        var photoWidth = photoImg.width;
        var photoHeight = photoImg.height;
        var cropSize = Math.min(photoWidth, photoHeight);
        var cropX = (photoWidth - cropSize) / 2;
        var cropY = (photoHeight - cropSize) / 2;

        var targetPhotoSize;
        if (selectedBorder === "border1.png") {
          targetPhotoSize = 1067;
        } else if (
          selectedBorder === "border2.png" ||
          selectedBorder === "border3.png"
        ) {
          targetPhotoSize = 902;
        }

        var scaleFactor = targetPhotoSize / cropSize;
        var scaledPhotoWidth = cropSize * scaleFactor;
        var scaledPhotoHeight = cropSize * scaleFactor;
        var offsetX = (canvas.width - targetPhotoSize) / 2;
        var offsetY = (canvas.height - targetPhotoSize) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (selectedBorder === "border1.png") {
          console.log("Rendering border 1...");

          var fullCanvasSize = 1100;
          ctx.save();
          ctx.drawImage(
            photoImg,
            cropX,
            cropY,
            cropSize,
            cropSize,
            0,
            0,
            fullCanvasSize,
            fullCanvasSize
          );
          ctx.restore();

          ctx.drawImage(borderImg, 0, 0, canvas.width, canvas.height);
        }

        if (selectedBorder === "border2.png") {
          console.log("Rendering border 2...");

          var targetPhotoSize = 902;
          var fullCanvasSize = 1100;

          ctx.save();
          ctx.drawImage(
            photoImg,
            cropX,
            cropY,
            cropSize,
            cropSize,
            0,
            0,
            fullCanvasSize,
            fullCanvasSize
          );
          ctx.restore();

          var leftOffsetX = -canvas.width * 0.4; 
          var topOffsetY = -canvas.height * 0.1273; 
          ctx.save();
          ctx.drawImage(
            photoImg,
            cropX,
            cropY,
            cropSize,
            cropSize,
            leftOffsetX,
            topOffsetY,
            targetPhotoSize,
            targetPhotoSize
          );
          ctx.restore();

          var rightOffsetX = canvas.width * 0.6; 
          var bottomOffsetY = canvas.height * 0.3727; 
          ctx.save();
          ctx.drawImage(
            photoImg,
            cropX,
            cropY,
            cropSize,
            cropSize,
            rightOffsetX,
            bottomOffsetY,
            targetPhotoSize,
            targetPhotoSize
          );
          ctx.restore();

          function applyMotionBlur(ctx, blurLength, shiftX, shiftY) {
            ctx.save();
            ctx.filter = "grayscale(100%)";
            for (var i = 0; i < blurLength; i++) {
              ctx.globalAlpha = 1 - i / blurLength;
              ctx.drawImage(
                canvas, 
                shiftX * i, 
                shiftY * i, 
                canvas.width,
                canvas.height
              );
            }

            ctx.restore();
            ctx.globalAlpha = 1;
          }

          applyMotionBlur(ctx, 4, 3, 3);

          var centerX = (canvas.width - targetPhotoSize) / 2;
          var centerY = (canvas.height - targetPhotoSize) / 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            targetPhotoSize / 2,
            0,
            Math.PI * 2
          );
          ctx.closePath();
          ctx.clip(); 
          ctx.drawImage(
            photoImg,
            cropX,
            cropY,
            cropSize,
            cropSize,
            centerX,
            centerY,
            targetPhotoSize,
            targetPhotoSize
          );
          ctx.restore();

    
          ctx.drawImage(borderImg, 0, 0, canvas.width, canvas.height);
        }

   
        else if (selectedBorder === "border3.png") {
          console.log("Rendering border 3...");

      
          var blurPhotoSize = 1300;
          var blurOffsetX = (canvas.width - blurPhotoSize) / 2;
          var blurOffsetY = (canvas.height - blurPhotoSize) / 2;
          ctx.save();
          ctx.filter = "blur(30px)";
          ctx.drawImage(
            photoImg,
            cropX,
            cropY,
            cropSize,
            cropSize,
            blurOffsetX,
            blurOffsetY,
            blurPhotoSize,
            blurPhotoSize
          );
          ctx.restore();

          var targetPhotoSize = 902;
          var offsetX = (canvas.width - targetPhotoSize) / 2;
          var offsetY = (canvas.height - targetPhotoSize) / 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            targetPhotoSize / 2,
            0,
            Math.PI * 2
          );
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(
            photoImg,
            cropX,
            cropY,
            cropSize,
            cropSize,
            offsetX,
            offsetY,
            targetPhotoSize,
            targetPhotoSize
          );
          ctx.restore();

          ctx.drawImage(borderImg, 0, 0, canvas.width, canvas.height);
        }

        var svgElement = document.getElementById("textBackground");
        var svgText = document.getElementById("textElement");
        var svgRect = document.getElementById("backgroundRect");
        svgText.textContent = name;
        svgRect.setAttribute("fill", bgColor);
        var svgData = new XMLSerializer().serializeToString(svgElement);
        var svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        var url = URL.createObjectURL(svgBlob);

        var img = new Image();
        img.onload = function () {
          ctx.drawImage(
            img,
            (canvas.width - 150) / 2,
            canvas.height - 120 - 40,
            150,
            40
          );
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } catch (error) {
        console.error("Gagal memuat gambar:", error);
      }
    };

    reader.readAsDataURL(photoFile);
  });


  function getGreetingBasedOnTime() {
    const currentHour = new Date().getHours();
    let greeting;

if (currentHour >= 4 && currentHour < 10) {
  greeting = "Selamat Pagi";
} else if (currentHour >= 10 && currentHour < 14) {
  greeting = "Selamat Siang";
} else if (currentHour >= 14 && currentHour < 18) {
  greeting = "Selamat Sore";
} else {
  greeting = "Selamat Malam";
}
    return greeting;
  }

  function typeText(element, text, callback, index = 0) {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      setTimeout(() => typeText(element, text, callback, index + 1), 100);
    } else if (callback) {
      callback(); // Panggil callback setelah animasi selesai
    }
  }

  function showWelcomeOverlay(name) {
    const overlay = document.getElementById("welcomeOverlay");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const closeButton = document.getElementById("closeOverlay");

    // Reset text content
    welcomeMessage.textContent = "";
    closeButton.style.display = "none"; // Sembunyikan tombol "Close"

    // Get greeting based on time
    const greeting = getGreetingBasedOnTime();

    // Build the full message
    const fullMessage = `${greeting}, ${name}`;

    // Show overlay
    overlay.style.display = "flex";

    // Animate typing
    typeText(welcomeMessage, fullMessage, function () {
      
      closeButton.style.display = "block";
    });
  }

  function closeWelcomeOverlay() {
    const overlay = document.getElementById("welcomeOverlay");
    overlay.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.getElementById("closeOverlay");

    if (closeButton) {
      closeButton.addEventListener("mouseenter", function () {
        const greeting = getGreetingBasedOnTime();
        closeButton.textContent = `${greeting} juga bg tur`;
      });

      closeButton.addEventListener("mouseleave", function () {
        closeButton.textContent = "Close";
      });

      closeButton.addEventListener("touchstart", function () {
        const greeting = getGreetingBasedOnTime();
        closeButton.textContent = `${greeting} juga bg tur`;
      });

      closeButton.addEventListener("touchend", function () {
        closeButton.textContent = "Close";
      });
    } else {
      console.error("Element with ID 'closeOverlay' not found.");
    }

    document
      .getElementById("closeOverlay")
      .addEventListener("click", closeWelcomeOverlay);

    document
      .getElementById("welcomeOverlay")
      .addEventListener("click", function (event) {
        if (event.target === this) {
          closeWelcomeOverlay();
        }
      });
  });

  function onUserSelectedName(userName) {
    showWelcomeOverlay(userName);
  }

  function showSuggestions(query) {
    const suggestions = document.getElementById("nameSuggestions");
    suggestions.innerHTML = "";

    if (!query) {
      suggestions.style.display = "none";
      return;
    }

    const filteredNames = names.filter((name) =>
      name.toLowerCase().includes(query.toLowerCase())
    );

    filteredNames.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      li.style.padding = "8px";
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        document.getElementById("nameSearch").value = name;
        suggestions.style.display = "none";
        const selectedName = document.getElementById("nameSearch").value;
        showWelcomeOverlay(selectedName);
      });

      suggestions.appendChild(li);
    });

    if (filteredNames.length > 0) {
      suggestions.style.display = "block";
    } else {
      suggestions.style.display = "none";
    }
  }

  document.getElementById("nameSearch").addEventListener("input", function () {
    const query = this.value;
    showSuggestions(query);
  });
  const fileInput = document.getElementById("photo");
  const fileNameDisplay = document.getElementById("fileName");
  const fileLabel = document.querySelector(".custom-file-label");
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      fileLabel.textContent = "foto yang itu komuk kak:)";
      fileNameDisplay.textContent = fileName;
    } else {
      fileLabel.textContent = "Upload Photo Jelek mu itu disini";
      fileNameDisplay.textContent = "*fotonya upload dulu!";
    }
  });
// Fungsi untuk mendownload gambar dari canvas
function downloadCanvasAsImage() {
  var canvas = document.getElementById("avatarCanvas");

  // Dapatkan URL gambar dari canvas dalam format PNG
  var imageURL = canvas.toDataURL("image/png");

  // Buat elemen link (a) secara dinamis
  var downloadLink = document.createElement("a");
  downloadLink.href = imageURL;
  downloadLink.download = "hasil-avatar.png"; // Nama file yang akan diunduh

  // Trigger download dengan klik otomatis pada link
  downloadLink.click();
}

// Tambahkan event listener ke tombol download
document.getElementById("downloadBtn").addEventListener("click", downloadCanvasAsImage);
