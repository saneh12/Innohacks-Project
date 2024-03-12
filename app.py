from flask import Flask, render_template ,request
from selenium import webdriver
from bs4 import BeautifulSoup
from flask_cors import CORS
from transformers import MBartForConditionalGeneration,MBart50TokenizerFast
import torch
import joblib
app = Flask(__name__)
CORS(app)

model = MBartForConditionalGeneration.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
@app.route('/')
def hello_world():
    return render_template("index.html")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        from_text = request.form.get('from_text')
        from_lang = request.form.get('from_language')
        print(from_lang)
        to_lang = request.form.get('to_language')

        tokenizer=MBart50TokenizerFast.from_pretrained('facebook/mbart-large-50-many-to-many-mmt')
        print("check 1")
        tokenizer.src_lang=from_lang
        print("check 2")
        encoded_ar = tokenizer(from_text,return_tensors="pt",add_special_tokens=True,lang=from_lang)
        print("check 3")
        generated_tokens=model.generate(**encoded_ar,
                                        forced_bos_token_id=tokenizer.get_lang_id(to_lang))
        data = tokenizer.batch_decode(generated_tokens,skip_special_tokens=True)
        return render_template('index.html',data)
    return render_template('index.html')   
if __name__ == '_main_':
    app.run(port=4000)