// progress.js

document.getElementById('promptForm').onsubmit = function(event) {
    event.preventDefault();
    var prompt = document.getElementById('prompt').value;
    var progressBar = document.getElementById('progress-bar');
    var progressContainer = document.getElementById('progress-container');
    var imageContainer = document.getElementById('image-container');
    var generatedImage = document.getElementById('generated-image');

    // Show the progress bar and hide the image container
    progressContainer.style.display = 'block';
    imageContainer.style.display = 'none';
    progressBar.value = 0;

    // Simulate progress bar increment
    var interval = setInterval(function() {
        if (progressBar.value < 100) {
            progressBar.value += 1;
        }
    }, 100);

    // Send the prompt to the server for image generation
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: prompt}),
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(interval); // Stop the progress bar when the image is ready
        progressBar.value = 100;
        generatedImage.src = data.image_url; // Set the image source to the generated image
        imageContainer.style.display = 'block'; // Show the image container
    })
    .catch(error => console.error('Error:', error));
};