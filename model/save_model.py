#to save model in your local machine
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
import joblib
model = MBartForConditionalGeneration.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
joblib.dump(model,'translator.joblib')
