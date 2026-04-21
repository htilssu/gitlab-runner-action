#!/bin/bash

echo "⏳ Đang theo dõi gitlab-runner..."
echo "🕐 Bắt đầu: $(date '+%Y-%m-%d %H:%M:%S')"
echo "⏱️  Timeout: TIMEOUT giây"

# Chạy docker logs với timeout
timeout "$TIMEOUT" bash -c "sed '/Pipeline successfully/q' <(docker logs gitlab-runner -f 2>&1)"

PIPELINE_EXIT=$?

echo ""
echo "🕐 Kết thúc: $(date '+%Y-%m-%d %H:%M:%S')"

if [ $PIPELINE_EXIT -eq 124 ]; then
    echo "⚠️  Timeout sau $TIMEOUT giây — Pipeline chưa hoàn thành."
else
    echo "✅ Pipeline successfully!"
fi

exit 0