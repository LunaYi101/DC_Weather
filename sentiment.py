import sys
import json
import ast
from transformers import pipeline

import torch

# if torch.cuda.is_available():
#     device = torch.device("cuda")
#     print("cuda")
# else:
#     device = torch.device("cpu")
#     print("cpu")

if torch.backends.mps.is_available():
    mps_device = torch.device("mps")
    x = torch.ones(1, device=mps_device)
    print (x)
else:
    print ("MPS device not found.")

# 1. pos neg
# classifier = pipeline("text-classification", model="matthewburke/korean_sentiment")

# 2. 혐오표현
# classifier = pipeline("text-classification", model="smilegate-ai/kor_unsmile")

# 3. 감정
classifier = pipeline("text-classification", model="hun3359/klue-bert-base-sentiment", device=mps_device)

custom_tweet = "페이즈 << 얘도 동부 학살하는게 전부아님? 바이퍼 왜내려침?"
preds = classifier(custom_tweet, top_k=None)

sorted_preds = sorted(preds, key=lambda x: x['score'], reverse=True)

for item in sorted_preds:
    print(item['label'], round(item['score'], 3))

# is_positive = preds[0][1]['score'] > 0.5