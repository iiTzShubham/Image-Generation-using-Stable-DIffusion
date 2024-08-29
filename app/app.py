from flask import Flask, render_template, request, jsonify, url_for
from diffusers import StableDiffusionPipeline
import torch
import uuid
import os

app = Flask(__name__)

# Load the model
model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe = pipe.to("cuda")

# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle image generation
@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data['prompt']

    # Generate image
    image = pipe(prompt, num_inference_steps=30, height=384, width=384).images[0]

    # Save the image
    image_filename = f"{uuid.uuid4()}.png"
    image_path = os.path.join('static', image_filename)
    image.save(image_path)

    # Return the image URL
    return jsonify({'image_url': url_for('static', filename=image_filename)})

if __name__ == '__main__':
    app.run(debug=True)
