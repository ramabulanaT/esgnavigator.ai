FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir mlflow==2.19.0
RUN mkdir -p /app/mlartifacts
EXPOSE 5000
CMD ["sh", "-c", "mlflow server --host 0.0.0.0 --port ${PORT:-5000} --default-artifact-root /app/mlartifacts"]
