import torch
from transformers import BertTokenizer
from models.quizModel import QuizGenerator
import argparse
import json

def load_model(model_path):
    model = QuizGenerator()
    model.load_state_dict(torch.load(model_path))
    model.eval()
    return model

def generate_quiz(model, context, num_questions=5):
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    quiz = []
    
    sentences = context.split('.')
    for _ in range(num_questions):
        sentence = sentences[torch.randint(0, len(sentences), (1,)).item()].strip()
        words = sentence.split()
        answer = words[torch.randint(0, len(words), (1,)).item()]
        
        input_text = f"Answer: {answer} Context: {sentence}"
        input_ids = tokenizer.encode(input_text, return_tensors='pt')
        
        with torch.no_grad():
            output = model.generate(
                input_ids,
                max_length=64,
                num_return_sequences=1,
                no_repeat_ngram_size=2,
                top_k=50,
                top_p=0.95,
                temperature=0.7
            )
        
        question = tokenizer.decode(output[0], skip_special_tokens=True)
        
        quiz.append({
            'question': question,
            'answer': answer,
            'context': sentence
        })
    
    return quiz

def main(args):
    model = load_model(args.model_path)
    
    with open(args.context_file, 'r') as f:
        context = f.read()
    
    quiz = generate_quiz(model, context, args.num_questions)
    
    print("Generated Quiz:")
    print(json.dumps(quiz, indent=2))
    
    if args.output_file:
        with open(args.output_file, 'w') as f:
            json.dump(quiz, f, indent=2)
        print(f"Quiz saved to {args.output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a quiz using a trained model.")
    parser.add_argument("--model_path", type=str, required=True, help="Path to the trained model file")
    parser.add_argument("--context_file", type=str, required=True, help="Path to the file containing the context for quiz generation")
    parser.add_argument("--num_questions", type=int, default=5, help="Number of questions to generate")
    parser.add_argument("--output_file", type=str, help="Path to save the generated quiz (optional)")
    
    args = parser.parse_args()
    main(args)