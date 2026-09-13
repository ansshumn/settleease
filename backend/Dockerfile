# 1. Base Image
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8001

CMD ["gunicorn", "settleease.wsgi:application", "--bind", "0.0.0.0:8001", "--workers", "2", "--threads", "4", "--worker-tmp-dir", "/dev/shm", "--timeout", "120", "--reload"]
