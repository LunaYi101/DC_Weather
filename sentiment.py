import sys
import json
import ast
from transformers import pipeline
# from transformers import AutoTokenizer, AutoModelForSequenceClassification

# tokenizer = AutoTokenizer.from_pretrained("hun3359/klue-bert-base-sentiment")
# model = AutoModelForSequenceClassification.from_pretrained("hun3359/klue-bert-base-sentiment")


# 1. pos neg
# classifier = pipeline("text-classification", model="matthewburke/korean_sentiment")

# 2. 혐오표현
# classifier = pipeline("text-classification", model="smilegate-ai/kor_unsmile")

# 3. 감정
classifier = pipeline("text-classification", model="hun3359/klue-bert-base-sentiment")

# custom_tweet = ast.literal_eval(sys.argv[1])
# preds = classifier(custom_tweet, top_k=None)

# classifier = pipeline(task='text-classification',
#                       model=model,
#                       tokenizer=tokenizer)
custom_tweet = ast.literal_eval(sys.argv[1])
# custom_tweet = '테스트'
preds = classifier(custom_tweet, top_k=None)

sorted_preds = sorted(preds, key=lambda x: x['score'], reverse=True)

# Function to generate a random string of length 4
# def generate_random_label():
#     return ''.join(random.choices(string.ascii_lowercase, k=4))

# # Create a list of 60 dictionaries
# sorted_preds = [{'label': generate_random_label(), 'score': random.uniform(0, 1)} for _ in range(60)]

for item in sorted_preds:
    item['score'] = round(item['score'], 5)

# print(sorted_preds)
print(json.dumps(sorted_preds))

sys.stdout.flush()
