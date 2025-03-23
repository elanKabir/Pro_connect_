FROM python:3.9-slim

# Install system dependencies
RUN apt-get update \
    && apt-get install -y tzdata \
    && rm -rf /var/lib/apt/lists/*

# Set the timezone (optional)
ENV TZ=UTC

# Create and set the working directory
WORKDIR /app/backend

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools \
    && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 5000 for the Flask app
EXPOSE 5000

# Define the command to run the Flask application
CMD ["python", "server.py"]
