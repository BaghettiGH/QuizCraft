from transformers import pipeline

generator = pipeline(model = "mrm8488/t5-base-finetuned-question-generation-ap")
res = generator(

    
)