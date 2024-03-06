from flask import Flask, request
import pickle
from selenium import webdriver
from bs4 import BeautifulSoup
from flask_cors import CORS
import joblib
import tensorflow as tf
app = Flask(_name_)

CORS(app)

model = joblib.load('model\model.joblib')
    
@app.route('/')
def hello_world():
    return '!! I love saneh !!'
