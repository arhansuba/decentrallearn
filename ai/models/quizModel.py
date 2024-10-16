import torch
import torch.nn as nn
import torch.optim as optim
from transformers import BertForQuestionAnswering, BertTokenizer

class QuizGenerator(nn.Module):
    def __init__(self, pretrained_model='bert-base-uncased'):
        super(QuizGenerator, self).__init__()
        self.tokenizer = BertTokenizer.from_pretrained(pretrained_model)
        self.model = BertForQuestionAnswering.from_pretrained(pretrained_model)
        
    def forward(self, input_ids, attention_mask=None, token_type_ids=None):
        return self.model(input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids)
    
    def generate_question(self, context, answer, max_length=64):
        input_text = f"Answer: {answer} Context: {context}"
        input_ids = self.tokenizer.encode(input_text, return_tensors='pt')
        attention_mask = torch.ones(input_ids.shape, dtype=torch.long)
        
        with torch.no_grad():
            output = self.model.generate(
                input_ids,
                attention_mask=attention_mask,
                max_length=max_length,
                num_return_sequences=1,
                no_repeat_ngram_size=2,
                top_k=50,
                top_p=0.95,
                temperature=0.7
            )
        
        question = self.tokenizer.decode(output[0], skip_special_tokens=True)
        return question
    
    def fine_tune(self, dataset, epochs=3, learning_rate=2e-5):
        self.model.train()
        optimizer = optim.AdamW(self.model.parameters(), lr=learning_rate)
        
        for epoch in range(epochs):
            total_loss = 0
            for batch in dataset:
                optimizer.zero_grad()
                input_ids = batch['input_ids']
                attention_mask = batch['attention_mask']
                token_type_ids = batch['token_type_ids']
                start_positions = batch['start_positions']
                end_positions = batch['end_positions']
                
                outputs = self.model(
                    input_ids,
                    attention_mask=attention_mask,
                    token_type_ids=token_type_ids,
                    start_positions=start_positions,
                    end_positions=end_positions
                )
                
                loss = outputs.loss
                total_loss += loss.item()
                
                loss.backward()
                optimizer.step()
            
            print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss/len(dataset)}")
        
        self.model.eval()

    def generate_quiz(self, context, num_questions=5):
        sentences = context.split('.')
        quiz = []
        
        for _ in range(num_questions):
            sentence = sentences[torch.randint(0, len(sentences), (1,)).item()]
            words = sentence.split()
            answer = words[torch.randint(0, len(words), (1,)).item()]
            
            question = self.generate_question(sentence, answer)
            quiz.append({
                'question': question,
                'answer': answer,
                'context': sentence
            })
        
        return quiz