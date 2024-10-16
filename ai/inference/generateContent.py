import torch
from transformers import GPT2Tokenizer
from models.contentModel import ContentGenerator
import argparse

def load_model(model_path):
    model = ContentGenerator()
    model.load_state_dict(torch.load(model_path))
    model.eval()
    return model

def generate_content(model, prompt, max_length=500, temperature=0.7):
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
    input_ids = tokenizer.encode(prompt, return_tensors='pt')
    
    with torch.no_grad():
        output = model.generate(
            input_ids,
            max_length=max_length,
            temperature=temperature,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            top_k=50,
            top_p=0.95
        )
    
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
    return generated_text

def main(args):
    model = load_model(args.model_path)
    prompt = args.prompt
    max_length = args.max_length
    temperature = args.temperature

    generated_content = generate_content(model, prompt, max_length, temperature)
    print("Generated Content:")
    print(generated_content)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate educational content using a trained model.")
    parser.add_argument("--model_path", type=str, required=True, help="Path to the trained model file")
    parser.add_argument("--prompt", type=str, required=True, help="Prompt for content generation")
    parser.add_argument("--max_length", type=int, default=500, help="Maximum length of generated content")
    parser.add_argument("--temperature", type=float, default=0.7, help="Temperature for content generation")
    
    args = parser.parse_args()
    main(args)
