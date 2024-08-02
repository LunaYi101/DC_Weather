import sys
import json
import ast
from transformers import pipeline
import torch

if torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

# 1. pos neg
# classifier = pipeline("text-classification", model="matthewburke/korean_sentiment")

# 2. 혐오표현
# classifier = pipeline("text-classification", model="smilegate-ai/kor_unsmile")

# 3. 감정
classifier = pipeline("text-classification", model="hun3359/klue-bert-base-sentiment")

custom_tweet = ast.literal_eval(sys.argv[1])
preds = classifier(custom_tweet, top_k=None)

sorted_preds = sorted(preds, key=lambda x: x['score'], reverse=True)

print(json.dumps(sorted_preds))

sys.stdout.flush()
