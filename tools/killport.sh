#!/bin/bash

PORT=$1

if [ -z "$PORT" ]; then
	echo "Использование: killport <port>"
	exit 1
fi

# Найти PID процесса, занимающего порт
PID=$(netstat -ano | grep ":$PORT" | grep LISTENING | awk '{print $5}')

if [ -z "$PID" ]; then
	echo "Порт $PORT свободен."
	exit 0
fi

echo "Найден PID: $PID"
echo "Убиваю процесс..."

taskkill //PID $PID //F

echo "Готово! Порт $PORT освобождён."
